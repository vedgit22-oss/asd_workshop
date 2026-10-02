const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ping() {
  const result = await pool.query("SELECT NOW() AS now");
  return result.rows[0];
}

async function countProducts() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM "Product"');
  return result.rows[0].count;
}

async function close() {
  await pool.end();
}

module.exports = {
  pool,
  ping,
  countProducts,
  close,
};
