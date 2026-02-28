import pool from "./postgres";

const createTables = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses(
        id SERIAL PRIMARY KEY,
        owner INTEGER REFERENCES users(id),
        expenseName VARCHAR(200) NOT NULL,
        amount INTEGER,
        category VARCHAR(50),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
  } catch (e) {
    console.error("Error creating tables", e);
  }
};

createTables();
