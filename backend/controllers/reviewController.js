import {
  getProductReviews as getProductReviewsService,
  getShopReviews as getShopReviewsService,
  createProductReview as createProductReviewService,
  createShopReview as createShopReviewService,
} from '../services/reviewService.js';

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await getProductReviewsService({ productId });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Get product reviews error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getShopReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const reviews = await getShopReviewsService({ sellerId });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Get shop reviews error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const review = await createProductReviewService({ userId: req.user.id, productId, rating, comment, files: req.files || [] });
    return res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Create product review error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};

export const createShopReview = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { rating, comment } = req.body;
    const review = await createShopReviewService({ userId: req.user.id, sellerId, rating, comment, files: req.files || [] });
    return res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Create shop review error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};


