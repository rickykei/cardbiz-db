const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  staffId: { type: String, required: true },
  company_id: { type: String, required: true },
  scanDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Checkout', checkoutSchema);