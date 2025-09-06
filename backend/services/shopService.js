import User from '../models/User.js';

export const getMyShop = async ({ userId }) => {
  const user = await User.findById(userId).select('shop');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.shop || { name: null, address: null, isSetup: false };
};

export const getShopBySeller = async ({ sellerId }) => {
  const user = await User.findById(sellerId).select('firstName email shop createdAt');
  if (!user) {
    const err = new Error('Shop not found');
    err.statusCode = 404;
    throw err;
  }
  const shop = user.shop && user.shop.isSetup ? user.shop : null;
  return { seller: { id: user._id, firstName: user.firstName }, shop };
};

export const saveMyShop = async ({ userId, name, address }) => {
  if (!name || !address) {
    const err = new Error('Shop name and address are required');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  user.shop = { name: String(name).trim(), address: String(address).trim(), isSetup: true, createdAt: user.shop?.createdAt || new Date() };
  await user.save();
  return { name: user.shop.name, address: user.shop.address, isSetup: user.shop.isSetup };
};


