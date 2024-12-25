const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "081000",
  database: "likeme",
  allowExitOnIdle: true,
});

module.exports= { pool }