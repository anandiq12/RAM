const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const Database = require('better-sqlite3');
const { backupDatabase } = require('../scripts/backup-sqlite');

test('creates an integrity-checked backup and retains only the newest 30 copies', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'nexora-backup-test-'));
  const sourcePath = path.join(directory, 'source.sqlite');
  const backupDir = path.join(directory, 'backups');
  const source = new Database(sourcePath);
  source.pragma('journal_mode = WAL');
  source.exec('CREATE TABLE backup_test (value TEXT NOT NULL)');
  source.prepare('INSERT INTO backup_test (value) VALUES (?)').run('preserved');

  try {
    await fs.mkdir(backupDir);
    for (let index = 0; index < 30; index += 1) {
      const name = `nexora-backup-2000-01-${String(index + 1).padStart(2, '0')}T00-00-00-000Z.sqlite`;
      await fs.writeFile(path.join(backupDir, name), '');
    }

    const backupPath = await backupDatabase({ databasePath: sourcePath, backupDir });
    const backup = new Database(backupPath, { readonly: true });
    try {
      assert.equal(backup.pragma('quick_check', { simple: true }), 'ok');
      assert.deepEqual(backup.prepare('SELECT value FROM backup_test').get(), { value: 'preserved' });
    } finally {
      backup.close();
    }

    const backups = (await fs.readdir(backupDir)).filter((name) => name.endsWith('.sqlite'));
    assert.equal(backups.length, 30);
    assert.equal(await fs.stat(sourcePath).then((stat) => stat.isFile()), true);
  } finally {
    source.close();
    await fs.rm(directory, { recursive: true, force: true });
  }
});
