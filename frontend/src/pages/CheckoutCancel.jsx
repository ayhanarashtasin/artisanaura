import React from 'react';
import Header from '../components/common/Header';

const CheckoutCancel = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Payment Cancelled</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">Your payment was cancelled. You can continue shopping and try again.</p>
      </div>
    </div>
  );
};

export default CheckoutCancel;


