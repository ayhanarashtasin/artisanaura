import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './features/user/profile';
import SignIn from './features/autentication/signin';
import Register from './features/autentication/register';
import {AuthProvider} from './contexts/AuthContext';
import Gift from './pages/gift';
import HomeFavourites from './features/products/homefavourites';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Account from './features/user/account';
import Security from './features/user/security';
import Address from './features/user/addresses';
import Emails from './features/user/emails';
import MyShop from './features/user/myshop';
import AddProduct from './features/user/AddProduct';
import ShopSettings from './features/user/ShopSettings';
import MensClothing from './pages/mensclothing';
import SearchResults from './pages/SearchResults';
import Chatbot from './components/common/chatbot';
import CreateAccount from './features/autentication/createaccount';
const App = () => {
  return (
    <DarkModeProvider>
      <AuthProvider>
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
            <Route path = "/profile/shop" element = {<MyShop/>} />
            <Route path = "/profile/addproduct" element = {<AddProduct/>} />
            <Route path = "/profile/shop-settings" element = {<ShopSettings/>} />
            <Route path = "/mens-clothing" element = {<MensClothing/>} />
            <Route path = "/search" element = {<SearchResults/>} />
            <Route path = "/createaccount" element = {<CreateAccount/>} />
            {/* Add more routes as needed */}
          </Routes>
          {/* Global ArtisanAura Assistant */}
          <Chatbot />
        </div>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;