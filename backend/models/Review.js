import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Either product or shop (seller user id) must be provided
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  images: [{ type: String }], // stored as /uploads/filename.ext
}, { timestamps: true });

// prevent both empty
reviewSchema.pre('validate', function(next) {
  if (!this.product && !this.shop) {
    return next(new Error('Either product or shop must be specified'));
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);
// Useful indexes
Review.collection?.createIndex?.({ product: 1, createdAt: -1 });
Review.collection?.createIndex?.({ shop: 1, createdAt: -1 });
Review.collection?.createIndex?.({ user: 1, createdAt: -1 });
export default Review;


