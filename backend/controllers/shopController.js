import { getMyShop as getMyShopService, getShopBySeller as getShopBySellerService, saveMyShop as saveMyShopService } from '../services/shopService.js';

export const getMyShop = async (req, res) => {
  try {
    const shop = await getMyShopService({ userId: req.user.id });
    return res.status(200).json({ success: true, shop });
  } catch (error) {
    console.error('Get shop error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};

export const getShopBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const data = await getShopBySellerService({ sellerId });
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error('Get public shop error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};

export const saveMyShop = async (req, res) => {
  try {
    const { name, address } = req.body;
    const shop = await saveMyShopService({ userId: req.user.id, name, address });
    return res.status(200).json({ success: true, message: 'Shop profile saved', shop });
  } catch (error) {
    console.error('Save shop error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};


