const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const Database = require('better-sqlite3');

const projectRoot = path.resolve(__dirname, '..');
const defaultDatabasePath = path.join(projectRoot, 'nexora.sqlite');
const defaultBackupRoot = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
const retentionCount = 30;

const parseOptions = (args) => {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const name = args[index];
    if (!['--database', '--backup-dir'].includes(name) || !args[index + 1]) {
      throw new Error(`Unknown or incomplete option: ${name}`);
    }
    options[name] = args[index + 1];
    index += 1;
  }
  return options;
};

const backupDatabase = async ({ databasePath, backupDir }) => {
  if (databasePath === ':memory:') {
    throw new Error('Cannot back up an in-memory database.');
  }
  const sourcePath = path.resolve(databasePath);
  const backupDirectory = path.resolve(backupDir);
  const relativeSourcePath = path.relative(backupDirectory, sourcePath);
  if (relativeSourcePath === '' || (!relativeSourcePath.startsWith(`..${path.sep}`) && relativeSourcePath !== '..' && !path.isAbsolute(relativeSourcePath))) {
    throw new Error('The backup directory must not contain the source database.');
  }

  await fs.mkdir(backupDirectory, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDirectory, `nexora-backup-${timestamp}.sqlite`);
  const database = new Database(sourcePath, { readonly: true, fileMustExist: true });

  try {
    await database.backup(backupPath);
  } catch (error) {
    await fs.rm(backupPath, { force: true });
    throw error;
  } finally {
    database.close();
  }

  const backup = new Database(backupPath, { readonly: true, fileMustExist: true });
  try {
    const result = backup.pragma('quick_check', { simple: true });
    if (result !== 'ok') throw new Error(`Backup integrity check failed: ${result}`);
  } catch (error) {
    await fs.rm(backupPath, { force: true });
    throw error;
  } finally {
    backup.close();
  }

  const entries = await fs.readdir(backupDirectory, { withFileTypes: true });
  const backups = entries
    .filter((entry) => entry.isFile() && /^nexora-backup-.*\.sqlite$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .reverse();
  await Promise.all(backups.slice(retentionCount).map((name) => fs.rm(path.join(backupDirectory, name))));

  return backupPath;
};

if (require.main === module) {
  const options = parseOptions(process.argv.slice(2));
  const databasePath = options['--database'] || process.env.DATABASE_PATH || defaultDatabasePath;
  const backupDir = options['--backup-dir'] || path.join(defaultBackupRoot, 'Nexora', 'database-backups');
  backupDatabase({ databasePath, backupDir })
    .then((backupPath) => console.log(`SQLite backup created and verified: ${backupPath}`))
    .catch((error) => {
      console.error(`SQLite backup failed: ${error.message}`);
      process.exitCode = 1;
    });
}

module.exports = { backupDatabase };
