import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import { initDB } from "./db/db.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// simple health route (handy for testing)
app.get("/health", (_req, res) => res.json({ ok: true }));

async function start() {
  try {
    const dbPath = process.env.DB_PATH || "./db/cloudvault.sqlite";
    const db = await initDB(dbPath);
    console.log(chalk.green.inverse("SQLite Database initialized"));

    app.use((req, _res, next) => {
      req.db = db;
      next();
    });

    app.use("/api/files", fileRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(chalk.green.inverse(`Server running on port ${PORT}`))
    );
  } catch (e) {
    console.error(chalk.red.inverse("Failed to start server:"), e);
    process.exit(1);
  }
}

start();
