import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";

export async function initDB(dbPath) {
  if (!dbPath || typeof dbPath !== "string") {
    throw new Error("DB_PATH is undefined or invalid");
  }

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = await open({ filename: dbPath, driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,       -- store S3 key
      originalname TEXT NOT NULL,   -- original file name
      mimetype TEXT,
      size INTEGER,
      url TEXT,
      uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}
