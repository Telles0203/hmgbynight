// utils/db.js
const mongoose = require("mongoose");

const testConnectDB = async () => {
  try {
await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB");
    await mongoose.disconnect();
    console.log("🔒 Desconectado do MongoDB");
  } catch (err) {
    console.error("Erro ao conectar:", err.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB");
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log("🔒 Desconectado do MongoDB");
  }
};

module.exports = {
  testConnectDB,
  connectDB,
  disconnectDB
};
