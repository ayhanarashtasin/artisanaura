import React from 'react';
import Header from '../components/common/Header';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Link } from 'react-router-dom';

// Simple SVG Icons for the "What is Artisanaura?" section
const CommunityIcon = () => (
  <svg className="w-12 h-12 mb-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
);

const CreatorsIcon = () => (
  <svg className="w-12 h-12 mb-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
);

const PeaceOfMindIcon = () => (
  <svg className="w-12 h-12 mb-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
);


const Home = () => {
  const { isDarkMode } = useDarkMode();

  // Category data with image URLs
  const topCategories = [
    { name: "Women's Clothing", path: "/womens-clothing", imageUrl: "https://safaaworld.com/cdn/shop/articles/main_35fee5f5-12af-47f8-8ee9-d271781c5953.png?height=440&v=1752231975&width=640" },
    { name: "Men's Clothing", path: "/mens-clothing", imageUrl: "https://www.ernest.ca/cdn/shop/articles/Guide_Vestimentaire_3.png?v=1667419005&width=1000" },
    { name: "Kids & Baby Clothing", path: "/kids-clothing", imageUrl: "data:image/jpeg;base64,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" },
    { name: "Ships Free: Linen Clothing", path: "/linen-clothing", imageUrl: "data:image/jpeg;base64,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" },
    { name: "Lounge & Sleepwear", path: "/sleepwear", imageUrl: "https://sijohome.com/cdn/shop/products/LONGSLEEVE_0003s_0000_SIJO_Lounge_20Mariana_20_blue_Longe_20Set_20Makenzie_0270_800x.webp?v=1657833486" },
    { name: "Accessories", path: "/accessories", imageUrl: "https://dressbarn.com/cdn/shop/articles/learning-the-different-types-of-accessories-dressbarn-105638.jpg?v=1711148381" },
  ];

  const jewelryCategories = [
    { name: "Handbags", path: "/handbags", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9GHaWZmKDRuzbWl1cP7Z1ctE_xoAdVGuLQQ&s" },
    { name: "Necklaces", path: "/necklaces", imageUrl: "https://cdn.shopify.com/s/files/1/0137/0033/3614/files/Antique-Victorian-Emerald-Diamond-Lavaliere-Necklace-5ct-Emerald-WORN_89634d1b-de9a-42c4-9585-36daca55fd7a_1024x1024.jpg?v=1713450874" },
    { name: "Rings", path: "/rings", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT-fXfcJwAXPg9HWIcp57PIUb9g51YgE6FUA&s" },
    { name: "Earrings", path: "/earrings", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCdH47cZmwxn8l65IlfwZ9LEZThvMayk6Vag&s" },
    { name: "Charms", path: "/charms", imageUrl: "https://images.meesho.com/images/products/451541619/yihj1_512.webp" },
    { name: "Birthstone Jewelry", path: "/birthstone-jewelry", imageUrl: "https://i0.wp.com/greenweddingshoes.com/wp-content/uploads/2021/12/birthstone-necklaces-1.jpg?resize=2048%2C19998" },
  ];

  const accessoryCategories = [
    { name: "Baseball Caps", path: "/baseball-caps", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/58/Basecap_New_York_Yankees.jpg" },
    { name: "Hair Accessories", path: "/hair-accessories", imageUrl: "https://www.gosupps.com/media/catalog/product/8/1/81kVi_1-SvL.jpg" },
    { name: "Personalized Tees & Sweatshirts", path: "/personalized-clothing", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5OVunl27wuiQqnoNdQY-dzMCjmDC0-AcrZQ&s" },
    { name: "Keychains", path: "/keychains", imageUrl: "https://www.amylattacreations.com/wp-content/uploads/2022/08/keychain4.jpg" },
    { name: "Jackets", path: "/jackets", imageUrl: "https://assets.vogue.com/photos/63ff8bc8f9eb0536c2ef6be8/master/w_2560%2Cc_limit/00-story%2520(2).jpg" },
    { name: "Travel Accessories", path: "/travel-accessories", imageUrl: "https://blog.thomascook.in/wp-content/uploads/2015/09/12537357764_7f1baa310e_z.jpg" },
  ];

  // Helper function to render categories
  const renderCategory = (category, index) => (
    <Link 
      to={category.path} 
      key={index}
      className="group flex flex-col items-center"
    >
      <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-3 
        ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} 
        flex items-center justify-center transition-transform group-hover:-translate-y-1 duration-300`}
      >
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-sm text-center font-medium flex items-center">
        {category.name} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </p>
    </Link>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <Header />
      
      {/* Hero Section */}
      <section className={`py-12 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-orange-50'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-medium mb-4 ${isDarkMode ? 'text-orange-200' : 'text-gray-800'}`}>
            Fashion Favorites
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-orange-100' : 'text-gray-600'}`}>
            Discover trending items, vintage pieces, and dazzling accessories to elevate your style.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 mb-12">
          {topCategories.map(renderCategory)}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 mb-12">
          {jewelryCategories.map(renderCategory)}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
          {accessoryCategories.map(renderCategory)}
        </div>
      </div>

      {/* What is Artisanaura Section - NEW */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-orange-50'}`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className={`text-3xl font-medium mb-12 ${isDarkMode ? 'text-orange-200' : 'text-gray-800'}`}>
            What is Artisanaura?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Column 1 */}
            <div className="flex flex-col items-center">
              <CommunityIcon />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                A community doing good
              </h3>
              <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Artisanaura is a global online marketplace, where people come together to make, sell, buy, and collect unique items.
              </p>
            </div>
            {/* Column 2 */}
            <div className="flex flex-col items-center">
              <CreatorsIcon />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Support independent creators
              </h3>
              <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                There’s no Artisanaura warehouse – just millions of people selling the things they love. We make the whole process easy.
              </p>
            </div>
            {/* Column 3 */}
            <div className="flex flex-col items-center">
              <PeaceOfMindIcon />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Peace of mind
              </h3>
              <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your privacy is the highest priority of our dedicated team. And if you ever need assistance, we are always ready to step in for support.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;