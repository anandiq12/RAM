# Nexora Premium Market

Nexora is a mobile-first shopping web app with a premium purple storefront, Express API, and SQLite persistence.

## Features

- Database-backed product search and filters for category, sub-category, brand, price, rating, discount, and availability; SQLite uses FTS5 prefix search and PostgreSQL schema includes a generated full-text search vector with a GIN index
- Twenty-six seeded e-commerce category families (including garden/outdoors, arts/crafts, digital goods, industrial/scientific, and collectibles), with category metadata available in production without demo product listings
- Five-level product catalog: category, sub-category, brand, product type/model, and individual product details; common starting taxonomy is seeded across categories, can be extended in Admin, and is exposed as a nested catalog API for storefront filters
- Per-product variant option arrays support standard and custom attributes such as size, color, storage, material, capacity, and pack size; these are listing options, not separate variant-level SKU/price/stock inventory
- Admin catalog management with protected add/edit/delete actions at every hierarchy level
- Admin and approved-seller bulk product imports from CSV and XLSX, with duplicate matching and feed upserts
- Authorized supplier push API with one-time per-supplier keys, key rotation/revocation, HTTPS-only production requests, rate limiting, sync health/error/count reporting, and idempotent external-ID/SKU/model upserts; repeat supplier batches automatically update the matching listing (up to 5,000 records per request)
- Admin duplicate review detects formatting-normalized SKU collisions and exact category/brand/model matches; ambiguous matches are reported, not silently merged
- Curated fashion, gadget, home, brand, and quick-access shelves with category and brand links
- Paginated API product feed with cursor/keyset pagination for storefront infinite scroll, avoiding deep OFFSET scans; offset pagination remains supported for compatibility
- Indexed product filter/sort paths and transaction-maintained popularity counters avoid per-product order aggregation on catalog reads
- Nexora-branded website footer; not shown in the native app
- Optional storefront survey saved only in the visitor's local browser storage
- Search screen with live suggestions and recent searches
- Product details, variants, specifications, reviews, Q&A, and related products
- Persistent written reviews are limited to authenticated customers with a delivered paid/COD order item; one review is accepted per delivered order item
- Wishlist and cart quantity controls
- Authenticated, server-priced Razorpay checkout (when configured), cash-on-delivery orders, and user-scoped order history
- Customer order cancellation before seller processing, seven-day return requests after delivery, and seller-owned fulfillment/return decisions
- Delivery address management
- Premium offers, per-account notification preferences, profile, and responsive bottom navigation
- Persistent, user-scoped order notifications and optional SendGrid order-confirmation emails
- Approved-seller product studio with ownership-scoped product CRUD and validated photo uploads, plus seller applications, customer-care tickets, and advertising requests
- Nexora rewards and Plus membership coins earned from demo orders
- Demo gift cards with one-time codes and account balances
- Signup and login endpoints are rate-limited to 10 attempts per IP per 15 minutes using an in-process store; multi-instance deployments need a shared rate-limit store
- Passwords are stored only as salted scrypt hashes on the server. Browser signup/login requires the API; legacy locally stored plaintext account data is removed rather than used as an offline fallback.
- SQLite-backed product, cart, wishlist, address, and order data
- Render free-plan configuration for SQLite demos
- PostgreSQL schema and batched one-time SQLite migration utility for future scale-out work; the current API runtime remains SQLite

## Requirements

- Node.js 18 or newer
- npm

## Local setup

```powershell
npm ci
Copy-Item .env.example .env
npm start
```

Open [http://localhost:3000](http://localhost:3000).

For development, `npm run dev` starts the same server.

## Android web assets

The Capacitor app packages the same storefront source files used by the website and reads products from the same live Nexora API. Before syncing/building Android, set `NEXORA_API_BASE` to the deployed HTTPS API origin reachable from the device, then run:

```powershell
$env:NEXORA_API_BASE = "https://your-deployed-api.example"
npm run sync:android
```

`sync:android` refreshes the packaged HTML, JavaScript, styles and assets, injects the API origin into Android's web bundle, and runs `npx cap sync android`. It fails if the API origin is missing, malformed, or non-HTTPS (localhost HTTP is permitted for development). Product API responses remain uncached to keep prices and stock current; the storefront uses cursor pagination and refreshes loaded product snapshots at most every five minutes, coalescing duplicate refreshes. Facets use ETag/browser caching, and static assets have cache headers. Cart and checkout revalidate product IDs and calculate totals from current server prices; orders are rejected when stock is insufficient. Seller photos are converted to a resized (maximum 1,600-pixel) WebP when that reduces file size; otherwise the original is retained. Product and seller-photo images load lazily where appropriate. Do not commit a private or environment-specific API URL.

## Generate an image

Install the Python dependency and set an OpenAI API key in the current PowerShell
session. Do not commit or share the key.

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
$env:OPENAI_API_KEY = "your-api-key"
.\.venv\Scripts\python.exe .\generate_image.py "A watercolor illustration of a quiet mountain lake at sunrise"
```

The script saves `generated_image.png` in the current directory. Use `--output`
to choose another path or omit the prompt argument to enter it interactively.

## Environment variables

Use `.env.example` as the template. Never commit `.env` or production secrets.

- `PORT`: HTTP port; defaults to `3000`
- `NODE_ENV`: `development` or `production`
- `ADMIN_KEY`: required for admin API access; server startup fails if it is missing, has surrounding whitespace, or is shorter than 32 characters. Generate a unique cryptographically random value and keep it out of source control.
- `DATABASE_PATH`: SQLite file path; defaults to `./nexora.sqlite`. Production orders require a persistent path outside the operating-system temporary directory.
- `DATABASE_DURABLE`: explicitly acknowledge that production `DATABASE_PATH` is on persistent storage; live Razorpay and COD stay disabled until this is `true` and the path is not a temporary directory.
- `DATABASE_URL`: PostgreSQL connection string used by `npm run migrate:postgres`; the running server currently uses `DATABASE_PATH` instead
- SQLite runs in WAL mode with a 5-second busy timeout, a bounded 32 MiB page cache, and targeted product/order indexes. Keep `DATABASE_PATH` on a local persistent disk; the included free Render `/tmp` location and local seller-image uploads are ephemeral and are for demos only. For durable production use a persistent volume/database and object storage for uploaded images.
- On Windows, run `.\scripts\install-sqlite-backup-task.ps1` to schedule a daily 02:00 local SQLite backup. It writes verified, timestamped copies under `%LOCALAPPDATA%\Nexora\database-backups`, keeps the newest 30, and starts missed runs when the laptop is available again. Use `-Time '03:30'` to change the schedule. Run `npm run backup:sqlite` for a manual backup. If you use a custom `DATABASE_PATH`, set it in the current PowerShell session before installing the task. Backups remain on this laptop; copy them to separate storage for protection against laptop loss.
- `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL`: optional server-only SendGrid credentials for COD order confirmation emails; failed delivery is logged and does not undo a placed order
- `COD_FREE_SHIPPING_THRESHOLD`: free COD shipping threshold in rupees; defaults to `899`. COD delivery is ₹40 below the threshold. Existing Razorpay pricing is unchanged.
- `COD_ENABLED`: COD is available by default outside production unless set to `false`; production requires explicit `true`. Keep it disabled until the production database is durable and verified.
- `SHIPPING_WEBHOOK_SECRET`: optional secret of at least 32 bytes for signed normalized carrier status callbacks; keep it private and configure carrier adapters to send an HMAC-SHA256 signature in `x-shipping-signature`.
- `SHIPPING_TRACKING_REQUIRED`: require tracking before marking real orders shipped in development/staging. Production always requires a carrier name, tracking number, and HTTPS tracking URL.
- `SEED_DEMO_DATA`: set to `true` to seed demo products; defaults to disabled in all environments and seeds only an empty products table. Existing product listings are never updated by demo seeding. Catalog taxonomy metadata is seeded independently.
- `SELLER_UPLOAD_DIR`: optional directory for seller-uploaded photos; defaults to `./assets/uploads/sellers`
- `NEXORA_API_BASE`: API origin for Android asset sync and supplier catalog imports; supplier imports default to `http://localhost:3000`
- `NEXORA_SUPPLIER_KEY`: active supplier-feed key for the CSV importer; keep it in the local process environment and never commit or expose it
- `RAZORPAY_MODE`: `test` (default) or `live`; live mode requires production `NODE_ENV`, HTTPS, a matching `rzp_live_` key, and webhook secret
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: Razorpay server credentials; only the public key ID is returned to the browser
- `RAZORPAY_WEBHOOK_SECRET`: the webhook signing secret configured in the Razorpay dashboard; required for live mode

Start with Razorpay test credentials in `.env`; keep the key secret and webhook secret on the server only. Configure the Razorpay webhook URL as `https://your-api-domain/api/payments/razorpay/webhook` for `payment.captured` and `payment.failed`. Set `RAZORPAY_MODE=live` only after switching to live credentials and verifying the production webhook. Never put a Razorpay secret in website or Android assets.

## API overview

- `GET /healthz` reports the active SQLite engine and whether durable storage is configured.
- `GET /api/products`
- `GET /api/products?category=Fashion`
- `GET /api/products?category=Mobiles&subcategory=Smartphones&brand=Samsung&product_type=Galaxy%20S%20Series&model=Galaxy%20S26`
- `GET /api/products?id=123&id=456` returns a targeted, uncached snapshot for up to 100 product IDs (active listings only by default).
- Product listings are paginated (`limit`, up to 100, and `offset`) and return `pagination.total` and `pagination.hasMore`; inactive products are excluded by default (`active=0` returns inactive records).
- Product queries support `q`, repeated `category`/`brand` values, `minPrice`, `maxPrice`, `minRating`, `onDiscount=true`, `inStock=true`, and `sort=price|rating|newest|popularity` (prefix with `-` for descending). Search uses indexed token-prefix matching. Use `cursor=start` for the first keyset page and `pagination.nextCursor` for the next; cursor responses omit exact totals to avoid a full matching-row count. Offset pagination returns exact totals for compatibility.
- `GET /api/products/facets` returns available category, sub-category, and brand filter values.
- `GET /api/products/:productId/reviews` returns published verified-purchase reviews; authenticated customers can check `GET /api/products/:productId/reviews/eligibility` and submit one review per delivered paid order item with `POST /api/products/:productId/reviews`.
- Admins and approved sellers can import CSV/XLSX files with up to 5,000 product rows; imported products are matched by supplier ID, SKU, or catalog identity and updated rather than duplicated. Product imports accept image URLs, descriptions, prices, and a `specifications_json` JSON object.
- Admins can create/rotate/revoke supplier feed keys. Give a key only to a supplier with an authorized data agreement; suppliers POST JSON batches (up to 5,000 listings) to `POST /api/supplier/feed` with `x-supplier-key`. The route returns create/update counts and the admin panel tracks the latest sync status. Production requests must use HTTPS.
- The supplied `supplier-catalog.csv` sample can be sent to the authorized feed with `npm run import:supplier-catalog` (or pass a CSV path). Create a supplier named `Nexora` in the Admin Panel, set `NEXORA_SUPPLIER_KEY` to its one-time key, and optionally set `NEXORA_API_BASE` to the API origin; it defaults to `http://localhost:3000`. The importer maps title/SKU/price/stock/image URL to the Nexora feed, labels absent brands `Unbranded`, maps Wearables and Accessories under the Electronics category, and requires HTTPS image URLs. Never commit supplier keys.
- `GET /api/admin/products/duplicates?limit=50` detects duplicate candidate groups by normalized SKU and exact catalog identity. The Admin Panel provides the same report. Candidate records are not auto-deleted or merged; manual review is required to prevent accidental loss of distinct listings.
- Supplier payload shape: `{"products":[{"external_product_id":"supplier-123","name":"Product name","category":"Electronics","brand":"Brand","price":1999,"original_price":2499,"stock":12,"sku":"SKU-123","images_json":["https://authorized-cdn.example/item.jpg"],"description":"Product details","specifications_json":{"Display":"6.7 inch AMOLED","Battery":"5000 mAh"},"variants_json":{"color":["Black","Blue"]}}]}`. Include `external_product_id`, `name`, `category`, `brand`, and `price` on every record; external IDs are unique within each supplier feed.
- Admin product records support photo URL lists, MRP, size/color/storage variants, seller, delivery details, and catalog hierarchy fields
- `POST /api/auth/signup`
- `POST /api/auth/login`
- Authenticated cart, wishlist, address, order, seller-account, notification-preference, support-ticket, advertising-request, rewards, and gift-card endpoints
- `GET /api/payments/razorpay/config`, `POST /api/payments/razorpay/orders`, and `POST /api/payments/razorpay/verify` support server-created Razorpay orders and signature/API-verified payments
- `POST /api/orders/cod` places authenticated COD orders, reserves stock, and returns it on eligible pre-processing cancellation; `GET /api/notifications` and `POST /api/notifications/read-all` provide persistent user-scoped alerts
- `POST /api/payments/razorpay/webhook` verifies captured/failed payment events; inventory is decremented only after confirmed capture
- Razorpay is disabled until valid credentials are configured. COD is also available and is a real order requiring durable production database hosting; `POST /api/orders` remains demo-only and never collects money.
- `PATCH /api/auth/profile` to update account name, email, and mobile after current-password verification
- `GET /api/rewards`, `GET /api/gift-cards`, `POST /api/gift-cards/purchase`, and `POST /api/gift-cards/redeem`
- `GET /api/admin/marketplace-requests` and `PATCH /api/admin/marketplace-requests/:kind/:id` (send the `x-admin-key` header)
- `GET /api/admin/catalog`, `POST /api/admin/catalog-nodes`, `PUT /api/admin/catalog-nodes/:id`, and `DELETE /api/admin/catalog-nodes/:id` (send the `x-admin-key` header)
- `GET /api/seller-account` and `POST /api/seller-account` manage a seller application; sellers need admin approval before product management is enabled
- Approved sellers can use `GET /api/seller/orders`, `PATCH /api/seller/order-items/:id/status` (pending → processing → shipped → delivered), `GET /api/seller/returns`, and `PATCH /api/seller/returns/:id` to review owned order items and return requests
- Sellers can save a carrier name, tracking number, and HTTPS tracking link when marking an order item shipped. Customers see the link in order history. `POST /api/shipping/webhook` accepts an HMAC-SHA256-signed normalized payload (`provider`, `tracking_number`, and `status` of `shipped`, `in_transit`, or `delivered`) when `SHIPPING_WEBHOOK_SECRET` is configured.
- Customers can use `POST /api/orders/:id/cancel` before seller processing and `POST /api/orders/:id/returns` for paid delivered items within 7 days; paid-order refunds are not automated and require separate support processing
- Approved sellers can use `GET/POST /api/seller/products`, `PUT/DELETE /api/seller/products/:id`, and `POST/DELETE /api/seller/products/images`. Photo uploads accept JPEG, PNG, or WebP content up to 5 MB per image; uploaded files are stored under `assets/uploads/sellers/`

Account endpoints require an `Authorization` header using the `Bearer` scheme with the session token returned at sign-in. Name, email, and mobile changes require the account's current password; email changes are unique across users. Delivery addresses can be viewed and edited from My Profile. Seller applications and advertising requests start as `pending`; customer-care tickets start as `open`. Admins can review requests and update their status. Seller product and order-item operations are scoped to the authenticated, approved seller; seller ownership is snapshotted on order items. Sellers can advance captured paid items from `pending` to `processing`, `shipped`, and `delivered`; demo records remain explicitly marked and do not reserve stock. Carrier account setup, pickup booking, label purchase, and provider-specific webhook adapters are not included; tracking details must be entered by the seller, and a carrier adapter must normalize and sign callbacks before posting them. Paid-order cancellations and refunds require support processing. Return approvals for captured payments are recorded for refund review and do not transfer money. Rewards and gift cards remain demo account features: demo orders do not earn coins or deduct gift-card balances. Demo gift-card creation does not collect payment.

## Render deployment

`render.yaml` defines the free-plan service:

- Build command: `npm ci`
- Start command: `npm start`
- Health check: `/healthz`
- SQLite path: `/tmp/nexora.sqlite`
- `ADMIN_KEY` generated by Render

The free Render service may sleep and its local SQLite data and uploaded seller photos are not durable across redeploys or instance replacement. Use a paid persistent disk or external database/object storage before storing real production data.

## Project files

- `Index.html` — storefront and application markup
- `Style.css` — responsive premium UI
- `Script.js` — frontend state and interactions
- `server.js` — Express API and static hosting
- `db.js` — SQLite schema and seed data
- `render.yaml` — Render service configuration
