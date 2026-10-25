/**
 * Copy one SQLite/libSQL database into another: schema (tables, then indexes and triggers), then every row,
 * in parameterised batches. Used by `npm run push:db` and by the one-time import on Vercel.
 */
const userTables = "type='table' and name not like 'sqlite_%' and name not like '_litestream%'"

export async function listTables(client) {
  return (await client.execute(`select name from sqlite_master where ${userTables}`)).rows.map((r) => r.name)
}

export async function copyDatabase({ from, to, replace = false, log = console.log }) {
  const existing = await listTables(to)
  if (existing.length && !replace) {
    throw new Error(`The target database already has ${existing.length} tables (use replace to overwrite).`)
  }
  if (existing.length) {
    log(`Dropping ${existing.length} existing tables…`)
    await to.executeMultiple(['PRAGMA foreign_keys=OFF;', ...existing.map((t) => `DROP TABLE IF EXISTS "${t}";`)].join('\n'))
  }

  const schema = (
    await from.execute(
      "select type, name, sql from sqlite_master where sql is not null and name not like 'sqlite_%' order by case type when 'table' then 0 else 1 end",
    )
  ).rows
  const tables = schema.filter((s) => s.type === 'table').map((s) => s.name)
  await to.executeMultiple(['PRAGMA foreign_keys=OFF;', ...schema.map((s) => `${s.sql};`)].join('\n'))
  log(`Created ${tables.length} tables and ${schema.length - tables.length} indexes/triggers.`)

  await to.execute('PRAGMA foreign_keys = ON')

  // All rows in one transaction, with foreign-key checks deferred to the commit: rows can arrive in any table
  // order, yet the copy only succeeds if every reference resolves. (On a remote database each request is its own
  // connection, so "PRAGMA foreign_keys=OFF" from an earlier request does not apply here.)
  let total = 0
  const tx = await to.transaction('write')
  try {
    await tx.execute('PRAGMA defer_foreign_keys = ON')
    for (const table of tables) {
      const { rows, columns } = await from.execute(`select * from "${table}"`)
      if (!rows.length) continue
      const sql = `insert into "${table}" (${columns.map((c) => `"${c}"`).join(', ')}) values (${columns.map(() => '?').join(', ')})`
      for (let i = 0; i < rows.length; i += 100) {
        await tx.batch(rows.slice(i, i + 100).map((r) => ({ sql, args: columns.map((c) => r[c]) })))
      }
      total += rows.length
    }
    await tx.commit()
  } catch (err) {
    await tx.rollback().catch(() => {})
    throw err
  } finally {
    tx.close()
  }
  log(`Copied ${total} rows.`)
  return { tables: tables.length, rows: total }
}
