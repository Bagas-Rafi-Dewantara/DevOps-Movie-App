/**
 * MongoDB Setup Script
 *
 * Creates all collections and indexes required by the Movie App.
 * Run this once before starting the server for the first time.
 *
 * Usage (from the server/ directory):
 *   npm install mongodb
 *   node scripts/setupMongoDB.js
 */

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local without needing the dotenv package ─────────────────────
function loadEnv(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed
        .slice(eqIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) process.env[key] = val;
    }
  } catch {
    // file not found — rely on existing environment variables
  }
}

loadEnv(path.resolve(__dirname, "../.env.local"));

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("❌  MONGODB_URL is not set in server/.env.local");
  process.exit(1);
}

// ── Collection definitions ──────────────────────────────────────────────────
const COLLECTIONS = [
  {
    name: "user-data",
    indexes: [
      { key: { userId: 1 }, options: { unique: true, name: "userId_unique" } },
      { key: { email: 1 }, options: { unique: true, name: "email_unique" } },
    ],
  },
  {
    name: "movie-data",
    indexes: [
      { key: { userId: 1, movieId: 1 }, options: { name: "userId_movieId" } },
      { key: { vote_average: -1 }, options: { name: "vote_average_desc" } },
    ],
  },
  {
    name: "person-data",
    indexes: [
      { key: { userId: 1, personId: 1 }, options: { name: "userId_personId" } },
      { key: { popularity: -1 }, options: { name: "popularity_desc" } },
    ],
  },
  {
    name: "review-data",
    indexes: [
      {
        key: { userId: 1, movieId: 1 },
        options: { unique: true, name: "userId_movieId_unique" },
      },
      {
        key: { movieId: 1, time: -1 },
        options: { name: "movieId_time_desc" },
      },
    ],
  },
];

// ── Main ────────────────────────────────────────────────────────────────────
async function setup() {
  console.log("🔌  Connecting to MongoDB Atlas…");
  const client = new MongoClient(MONGODB_URL);
  await client.connect();
  console.log("✅  Connected!\n");

  const db = client.db();
  const existingCols = (await db.listCollections().toArray()).map((c) => c.name);

  for (const col of COLLECTIONS) {
    // Create collection if it doesn't exist
    if (!existingCols.includes(col.name)) {
      await db.createCollection(col.name);
      console.log(`📁  Created  : ${col.name}`);
    } else {
      console.log(`📁  Exists   : ${col.name}`);
    }

    // Create indexes
    const collection = db.collection(col.name);
    for (const { key, options } of col.indexes) {
      await collection.createIndex(key, options);
      console.log(
        `   ↳ index "${options.name}"${options.unique ? " (unique)" : ""}`
      );
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n📊  Document counts:");
  for (const col of COLLECTIONS) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`   ${col.name.padEnd(14)}: ${count} docs`);
  }

  console.log("\n🎉  MongoDB setup complete!\n");
  await client.close();
}

setup().catch((err) => {
  console.error("❌  Setup failed:", err.message);
  process.exit(1);
});
