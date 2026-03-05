// backend/utils/mongo.js
const { MongoClient, ServerApiVersion } = require("mongodb");

async function withMongo(callback) {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || "bynight";

  if (!uri) {
    throw new Error("MONGODB_URI/MONGO_URI não definida no backend/.env");
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });

  try {
    await client.connect();           // ABRE
    const db = client.db(dbName);     // USA (db do projeto)
    return await callback(db);
  } catch (err) {
    console.error("MongoDB error:", err);
    throw err;
  } finally {
    await client.close().catch(() => {}); // FECHA (SEMPRE)
  }
}

module.exports = { withMongo };