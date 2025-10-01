const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    originalUrl : {type: String, required: true},
    shortCode: {type: String, required: true, unique: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdAt: {type: Date, default: Date.now},
    clicks: {type: Number, default: 0},
    qrCode: {type: String},
});


UrlSchema.virtual('shortUrl').get(function () {
  const base = process.env.BASE_URL || 'http://localhost:5000';
  return `${base}/${this.shortCode}`;
});

UrlSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Url", UrlSchema);