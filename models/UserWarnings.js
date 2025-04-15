const mongoose = require("mongoose");

const userWarningSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("userWarnings", userWarningSchema, "userWarnings");



