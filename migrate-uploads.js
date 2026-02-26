/**
 * One-time migration script: reorganize existing uploaded files.
 *
 * BEFORE: uploads/{uuid}                          (flat, no extension)
 * AFTER:  uploads/{public|private}/{tag}/{uuid}.ext
 *
 * Also updates the "fileName" column in the Media table to include the extension.
 *
 * Safe to run multiple times — already-migrated files are skipped.
 *
 * Usage:
 *   node migrate-uploads.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// ─── Read .env ────────────────────────────────────────────────────────────────
function readEnv(filePath) {
  const env = {};
  try {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (_) {}
  return env;
}

const env = readEnv(path.join(__dirname, '.env'));

const UPLOAD_LOCATION = env.UPLOAD_LOCATION || './uploads';
const DB = {
  host:     env.DB_HOST,
  port:     parseInt(env.DB_PORT || '5432', 10),
  database: env.APP_MODE === 'prod' ? env.DB_NAME : env.DB_DEV_NAME,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function safeTag(tag) {
  return (tag || 'misc')
    .replace(/[/\\:*?"<>|]/g, '_')
    .replace(/\s+/g, '_');
}

function getExt(originalName) {
  const m = (originalName || '').match(/(\.[^.]+)$/);
  return m ? m[1].toLowerCase() : '';
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function migrate() {
  console.log('Connecting to database:', DB.database, 'on', DB.host);
  const client = new Client(DB);
  await client.connect();
  console.log('Connected.\n');

  // Fetch ALL media records (including inactive — we still want to move the file)
  const { rows } = await client.query(`SELECT * FROM "Media" ORDER BY id`);
  console.log(`Found ${rows.length} Media record(s) to process.\n`);

  let moved = 0, alreadyDone = 0, notFound = 0, errors = 0;

  for (const row of rows) {
    const { id, fileName, originalName, isPublic, tag } = row;

    const ext        = getExt(originalName);
    // New fileName includes the extension (e.g. "abc123.jpg")
    const newFileName = (ext && !fileName.endsWith(ext))
      ? `${fileName}${ext}`
      : fileName;

    const visibility = isPublic ? 'public' : 'private';
    const folder     = safeTag(tag);

    const oldPath = path.join(UPLOAD_LOCATION, fileName);          // old flat path
    const newDir  = path.join(UPLOAD_LOCATION, visibility, folder);
    const newPath = path.join(newDir, newFileName);

    const label = `[${id}] ${fileName}`;

    // ── Already at new location ──────────────────────────────────────────────
    if (fs.existsSync(newPath)) {
      if (newFileName !== fileName) {
        // DB might still have old name; update it
        await client.query(
          `UPDATE "Media" SET "fileName" = $1 WHERE id = $2`,
          [newFileName, id]
        );
      }
      console.log(`${label} → SKIP (already at ${visibility}/${folder}/${newFileName})`);
      alreadyDone++;
      continue;
    }

    // ── Old file not found ───────────────────────────────────────────────────
    if (!fs.existsSync(oldPath)) {
      console.log(`${label} → NOT FOUND on disk (skipping)`);
      notFound++;
      continue;
    }

    // ── Move the file ────────────────────────────────────────────────────────
    try {
      fs.mkdirSync(newDir, { recursive: true });
      fs.renameSync(oldPath, newPath);

      if (newFileName !== fileName) {
        await client.query(
          `UPDATE "Media" SET "fileName" = $1 WHERE id = $2`,
          [newFileName, id]
        );
      }

      console.log(`${label} → OK  →  ${visibility}/${folder}/${newFileName}`);
      moved++;
    } catch (e) {
      console.error(`${label} → ERROR: ${e.message}`);
      errors++;
    }
  }

  await client.end();

  console.log('\n══════════════════════════════');
  console.log(`  Moved:          ${moved}`);
  console.log(`  Already done:   ${alreadyDone}`);
  console.log(`  Not on disk:    ${notFound}`);
  console.log(`  Errors:         ${errors}`);
  console.log('══════════════════════════════');
  console.log('Migration complete.');
}

migrate().catch((err) => {
  console.error('\nMigration failed:', err.message);
  process.exit(1);
});
