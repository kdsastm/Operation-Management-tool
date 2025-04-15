const mongoose = require("mongoose");

const RevenueSchema = new mongoose.Schema({
  partner: { type: String, required: true },
  project: { type: String, required: true },
  totalNFR: { type: Number, required: true },
  country: { type: String, required: true },
  client: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Revenue", RevenueSchema);
