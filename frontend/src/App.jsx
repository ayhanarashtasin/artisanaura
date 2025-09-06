// Application routes and global providers
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Profile from './features/user/profile';
import SignIn from './features/autentication/signin';
import Register from './features/autentication/register';
import {AuthProvider} from './contexts/AuthContext';
import Gift from './pages/gift';
import HomeFavourites from './features/products/homefavourites';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { CartProvider } from './contexts/CartContext';
import Account from './features/user/account';
import Security from './features/user/security';
import Address from './features/user/addresses';
import Emails from './features/user/emails';
import PublicProfile from './features/user/public';
import MyShop from './features/user/myshop';
import AddProduct from './features/user/addproduct';
import ShopSettings from './features/user/shopsettings';
import MensClothing from './pages/mensclothing';
import Clothing from './pages/Clothing';
import SearchResults from './pages/SearchResults';
import Chatbot from './components/common/chatbot';
import Cart from './features/cart/cart';
import CreateAccount from './features/autentication/createaccount';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import { NotificationProvider } from './contexts/NotificationContext';
import ShopDetails from './pages/ShopDetails';
import Orders from './features/user/Orders';
import MyOrders from './features/user/MyOrders';
import Analytics from './features/user/Analytics';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminRoute from './components/common/AdminRoute';
// Note: Stripe checkout pages exist as success/cancel routes
const App = () => {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gift" element={<Gift />} />
            <Route path="/homefavourites" element={<HomeFavourites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/account" element={<Account />} />
            <Route path="/profile/security" element={<Security/>} />
            <Route path="/profile/addresses" element={<Address/>} />
            <Route path="/profile/emails" element={<Emails/>} />
            <Route path="/profile/public" element={<PublicProfile/>} />
            <Route path = "/profile/shop" element = {<MyShop/>} />
            <Route path = "/profile/addproduct" element = {<AddProduct/>} />
            <Route path = "/profile/shop-settings" element = {<ShopSettings/>} />
            <Route path = "/profile/orders" element = {<Orders/>} />
            <Route path = "/profile/analytics" element = {<Analytics/>} />
            <Route path = "/orders" element = {<MyOrders/>} />
            <Route path = "/mens-clothing" element = {<MensClothing/>} />
            <Route path = "/clothing" element = {<Clothing/>} />
            <Route path = "/search" element = {<SearchResults/>} />
            <Route path = "/createaccount" element = {<CreateAccount/>} />
            <Route path = "/cart" element = {<Cart/>} />
            <Route path = "/checkout/success" element = {<CheckoutSuccess/>} />
            <Route path = "/checkout/cancel" element = {<CheckoutCancel/>} />
            <Route path = "/shop/:sellerId" element = {<ShopDetails/>} />
            <Route path = "/admin" element = {<AdminRoute><AdminDashboard /></AdminRoute>} />
            {/* Checkout routes removed */}
            {/* Add more routes as needed */}
          </Routes>
          {/* Global ArtisanAura Assistant */}
          <Chatbot />
            </div>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;