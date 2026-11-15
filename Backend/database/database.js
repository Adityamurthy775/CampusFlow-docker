import { config } from "dotenv";
import { connect } from "mongoose";
import { fileURLToPath } from "node:url";

config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

let databaseReady = false;
let databaseError = null;

export function getDatabaseStatus() {
  return {
    ready: databaseReady,
    error: databaseError,
  };
}

export function requireDatabase(req, res, next) {
  if (req.path === "/" || req.path === "/health" || req.method === "OPTIONS") {
    return next();
  }
  if (!databaseReady) {
    return res.status(503).json({
      message: "CampusFlow database is not ready",
      code: "DATABASE_UNAVAILABLE",
      detail: databaseError || "The server is still connecting to MongoDB.",
    });
  }
  next();
}

export async function connectToDatabase() {
  const mongoUri = process.env.MONGO_DIRECT_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("FATAL: MONGO_URI is not set. Add it to Backend/.env and restart.");
    process.exit(1);
  }

  try {
    await connect(mongoUri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
    databaseReady = true;
    databaseError = null;
    console.log("Connection to MongoDB is successful");
  } catch (error) {
    databaseReady = false;
    databaseError = error.message;
    console.error("Error connecting to the Database:", error.message);
    setTimeout(connectToDatabase, 10000);
  }
}

