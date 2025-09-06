import Review from '../models/Review.js';

export const getProductReviews = async ({ productId }) => {
  return Review.find({ product: productId })
    .select('user rating comment images createdAt')
    .populate({ path: 'user', select: 'firstName' })
    .sort({ createdAt: -1 })
    .lean();
};

export const getShopReviews = async ({ sellerId }) => {
  return Review.find({ shop: sellerId })
    .select('user rating comment images createdAt')
    .populate({ path: 'user', select: 'firstName' })
    .sort({ createdAt: -1 })
    .lean();
};

export const createProductReview = async ({ userId, productId, rating, comment, files }) => {
  if (!rating) {
    const err = new Error('Rating is required');
    err.statusCode = 400;
    throw err;
  }
  const images = (files || []).map(f => `/uploads/${f.filename}`);
  const review = new Review({ user: userId, product: productId, rating, comment, images });
  await review.save();
  return review;
};

export const createShopReview = async ({ userId, sellerId, rating, comment, files }) => {
  if (!rating) {
    const err = new Error('Rating is required');
    err.statusCode = 400;
    throw err;
  }
  const images = (files || []).map(f => `/uploads/${f.filename}`);
  const review = new Review({ user: userId, shop: sellerId, rating, comment, images });
  await review.save();
  return review;
};


