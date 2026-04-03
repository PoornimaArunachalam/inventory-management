const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  productId: { type: Number, required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
