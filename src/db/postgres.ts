import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Database connected!");
});

pool.on("error", (err) => {
  console.log("Unexpexted error", err);
});

export default pool;
