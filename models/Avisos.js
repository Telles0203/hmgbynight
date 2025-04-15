const mongoose = require("mongoose");

const avisosSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("Avisos", avisosSchema);
