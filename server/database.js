import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Load configuration from config.json
//const config = JSON.parse(fs.readFileSync("./config.json"));

// Create a connection pool with SSL settings if needed
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: true, // You can set this to `false` to allow self-signed certs
  },
});

// Directly use the promise-based pool.execute
// Used for prepared queries
export const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (err) {
    throw err; // Forward the error for handling elsewhere
  }
};

// Used for making queries with multiple tuples
export const bulkQuery = async (sql, params) => {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (err) {
    throw err; // Forward the error for handling elsewhere
  }
};

// Optionally export the pool if you need to manage connections manually
export default pool;
