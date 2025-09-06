import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  paymentSessionId: { type: String, required: true, index: true },
  status: { type: String, enum: ['paid', 'refunded', 'cancelled'], default: 'paid' },
}, { timestamps: true });

orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ buyer: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;


