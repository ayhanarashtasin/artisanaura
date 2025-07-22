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
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;