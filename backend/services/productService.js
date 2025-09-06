import Product from '../models/Product.js';

export const createProduct = async ({ data, file, userId }) => {
  const { name, description, price, category, subcategory } = data;
  if (!name || !description || !price || !category || !subcategory || !file) {
    const err = new Error('Please fill all required fields.');
    err.statusCode = 400;
    throw err;
  }
  const imageUrl = `/uploads/${file.filename}`;
  const newProduct = new Product({ name, description, price, category, subcategory, imageUrl, seller: userId });
  const savedProduct = await newProduct.save();
  return savedProduct;
};

export const updateProduct = async ({ id, data, file, userId }) => {
  const product = await Product.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  if (String(product.seller) !== String(userId)) {
    const err = new Error('Not authorized to update this product');
    err.statusCode = 403;
    throw err;
  }

  const { name, description, price, category, subcategory } = data || {};
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (subcategory) product.subcategory = subcategory;
  if (file) {
    product.imageUrl = `/uploads/${file.filename}`;
  }
  const saved = await product.save();
  return saved;
};

export const deleteProduct = async ({ id, userId }) => {
  const product = await Product.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  if (String(product.seller) !== String(userId)) {
    const err = new Error('Not authorized to delete this product');
    err.statusCode = 403;
    throw err;
  }
  await product.deleteOne();
  return { success: true };
};

export const getMyProducts = async ({ userId }) => {
  const products = await Product.find({ seller: userId })
    .select('name imageUrl price createdAt')
    .sort({ createdAt: -1 })
    .lean();
  return products;
};

export const getProductsByCategory = async ({ category, subcategory }) => {
  const products = await Product.find({
    category: { $regex: new RegExp(`^${category}$`, 'i') },
    subcategory: { $regex: new RegExp(`^${subcategory}$`, 'i') }
  })
    .select('name description price category subcategory imageUrl seller createdAt')
    .populate({ path: 'seller', select: 'firstName shop' })
    .sort({ createdAt: -1 })
    .lean();

  const shaped = products.map((p) => ({
    _id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    subcategory: p.subcategory,
    imageUrl: p.imageUrl,
    seller: p.seller ? {
      id: p.seller._id,
      firstName: p.seller.firstName,
      shop: p.seller.shop ? {
        name: p.seller.shop.name || null,
        isSetup: !!p.seller.shop.isSetup
      } : { name: null, isSetup: false }
    } : null,
    createdAt: p.createdAt
  }));

  return shaped;
};

export const searchProducts = async ({ query }) => {
  if (!query) {
    const err = new Error('Search query cannot be empty.');
    err.statusCode = 400;
    throw err;
  }
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  })
    .select('name description price imageUrl createdAt')
    .sort({ createdAt: -1 })
    .lean();
  return products;
};


