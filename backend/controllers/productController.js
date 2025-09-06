import {
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  getMyProducts as getMyProductsService,
  getProductsByCategory as getProductsByCategoryService,
  searchProducts as searchProductsService,
} from '../services/productService.js';

export const createProduct = async (req, res) => {
  try {
    const savedProduct = await createProductService({ data: req.body, file: req.file, userId: req.user.id });
    return res.status(201).json(savedProduct);
  } catch (error) {
    const status = error.statusCode || 500;
    console.error('Error creating product:', error);
    return res.status(status).json({ message: status === 500 ? 'Server error while creating product.' : error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const saved = await updateProductService({ id: req.params.id, data: req.body, file: req.file, userId: req.user.id });
    return res.status(200).json(saved);
  } catch (error) {
    const status = error.statusCode || 500;
    console.error('Error updating product:', error);
    return res.status(status).json({ message: status === 500 ? 'Server error while updating product.' : error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService({ id: req.params.id, userId: req.user.id });
    return res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    const status = error.statusCode || 500;
    console.error('Error deleting product:', error);
    return res.status(status).json({ message: status === 500 ? 'Server error while deleting product.' : error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await getMyProductsService({ userId: req.user.id });
    return res.status(200).json(products);
  } catch (error) {
    const status = error.statusCode || 500;
    console.error('Error fetching user products:', error);
    return res.status(status).json({ message: status === 500 ? 'Server error while fetching products.' : error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const categoryParam = decodeURIComponent(req.params.category);
    const subcategoryParam = decodeURIComponent(req.params.subcategory);
    const shaped = await getProductsByCategoryService({ category: categoryParam, subcategory: subcategoryParam });
    return res.status(200).json(shaped);
  } catch (error) {
    const status = error.statusCode || 500;
    console.error('Error fetching category products:', error);
    return res.status(status).json({ message: status === 500 ? 'Server error while fetching products.' : error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const products = await searchProductsService({ query: req.params.query });
    return res.status(200).json(products);
  } catch (error) {
    const status = error.statusCode || 500;
    console.error('Error searching products:', error);
    return res.status(status).json({ message: status === 500 ? 'Server error while searching for products.' : error.message });
  }
};


