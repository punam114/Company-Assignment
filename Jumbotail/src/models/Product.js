const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    index: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sales: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  metadata: {
    ram: { type: String },
    storage: { type: String },
    color: { type: String },
    screenSize: { type: String },
    brightness: { type: String },
    model: { type: String },
    brand: { type: String },
    category: { type: String },
    processor: { type: String },
    battery: { type: String },
    camera: { type: String },
    os: { type: String }
  }
}, {
  timestamps: true
});

productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ price: 1, rating: -1 });

module.exports = mongoose.model('Product', productSchema);