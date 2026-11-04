const fs = require('node:fs/promises');
const path = require('node:path');
const { parse } = require('csv-parse/sync');

const defaultCsvPath = path.join(__dirname, '..', 'supplier-catalog.csv');
const requiredColumns = ['sku', 'title', 'price', 'stock', 'image_url', 'category'];
const categoryMappings = {
  electronics: { category: 'Electronics' },
  wearables: { category: 'Electronics', subcategory: 'Wearables' },
  accessories: { category: 'Electronics', subcategory: 'Accessories' }
};

const parseSupplierCsv = (csvText) => {
  const rows = parse(csvText, { bom: true, skip_empty_lines: true, trim: true });
  const headers = rows.shift()?.map((header) => String(header).trim().toLowerCase());
  if (!headers?.length) throw new Error('Supplier CSV is empty');
  if (new Set(headers).size !== headers.length) throw new Error('Supplier CSV contains duplicate column names');
  const missingColumns = requiredColumns.filter((column) => !headers.includes(column));
  if (missingColumns.length) throw new Error(`Supplier CSV is missing required columns: ${missingColumns.join(', ')}`);
  if (!rows.length) throw new Error('Supplier CSV has no product rows');

  return rows.map((row, index) => {
    const rowNumber = index + 2;
    if (row.length !== headers.length) throw new Error(`Supplier CSV row ${rowNumber} has an unexpected number of columns`);
    const record = Object.fromEntries(headers.map((header, column) => [header, String(row[column] || '').trim()]));
    const price = Number(record.price);
    const stock = Number(record.stock);
    if (!record.sku || !record.title) throw new Error(`Supplier CSV row ${rowNumber} must include a SKU and title`);
    if (!record.price || !Number.isFinite(price) || price < 0) throw new Error(`Supplier CSV row ${rowNumber} has an invalid price`);
    if (!record.stock || !Number.isSafeInteger(stock) || stock < 0) throw new Error(`Supplier CSV row ${rowNumber} has invalid stock`);

    let image;
    try {
      image = new URL(record.image_url);
    } catch {
      throw new Error(`Supplier CSV row ${rowNumber} has an invalid image URL`);
    }
    if (image.protocol !== 'https:' || !image.hostname || image.username || image.password || record.image_url.length > 2048) {
      throw new Error(`Supplier CSV row ${rowNumber} image URL must use HTTPS, contain no credentials, and be at most 2,048 characters`);
    }

    const category = categoryMappings[record.category.toLowerCase()];
    if (!category) throw new Error(`Supplier CSV row ${rowNumber} has unsupported category "${record.category}"`);
    return {
      external_product_id: record.sku,
      sku: record.sku,
      name: record.title,
      category: category.category,
      ...(category.subcategory ? { subcategory: category.subcategory } : {}),
      brand: 'Unbranded',
      price,
      stock,
      image_url: record.image_url,
      images_json: [record.image_url]
    };
  });
};

const validateApiBase = (value) => {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('NEXORA_API_BASE must be a valid HTTP(S) API origin');
  }
  const localHosts = ['localhost', '127.0.0.1', '[::1]'];
  if (!['http:', 'https:'].includes(url.protocol)
    || url.username || url.password || url.pathname !== '/' || url.search || url.hash
    || (url.protocol !== 'https:' && !localHosts.includes(url.hostname))) {
    throw new Error('NEXORA_API_BASE must be an HTTPS API origin (HTTP is allowed only for localhost), without credentials, path, query or fragment');
  }
  return url.origin;
};

const importSupplierCatalog = async (
  csvPath = defaultCsvPath,
  { apiBase = process.env.NEXORA_API_BASE || 'http://localhost:3000', apiKey = process.env.NEXORA_SUPPLIER_KEY } = {}
) => {
  if (!apiKey || !apiKey.trim()) throw new Error('Set NEXORA_SUPPLIER_KEY to the active supplier key from the Nexora Admin Panel');
  const products = parseSupplierCsv(await fs.readFile(csvPath, 'utf8'));
  const origin = validateApiBase(apiBase);
  const response = await fetch(`${origin}/api/supplier/feed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-supplier-key': apiKey.trim()
    },
    body: JSON.stringify({ products }),
    redirect: 'error'
  });
  const responseText = await response.text();
  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(`Supplier feed returned a non-JSON response (HTTP ${response.status})`);
  }
  if (!response.ok) throw new Error(result.error || `Supplier feed request failed with HTTP ${response.status}`);
  return result;
};

if (require.main === module) {
  const csvPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultCsvPath;
  importSupplierCatalog(csvPath)
    .then(({ supplier, results }) => {
      console.log(`Imported ${results.total} products for ${supplier}: ${results.created} created, ${results.updated} updated.`);
    })
    .catch((error) => {
      console.error(`Supplier catalog import failed: ${error.message}`);
      process.exitCode = 1;
    });
}

module.exports = { defaultCsvPath, importSupplierCatalog, parseSupplierCsv };
