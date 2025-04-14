const mongoose = require("mongoose");

const avisosSchema = new mongoose.Schema({
  statusEmailMessage: { type: String, default: "" }
});

module.exports = mongoose.model("Avisos", avisosSchema);
