import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const HomeFavourites = () => {
  const { isDarkMode } = useDarkMode();

  // --- Image URLs have been updated to new, working links ---
  const categories = [
    {
      id: 1,
      title: "Home Decor",
      image: "https://www.tbsnews.net/sites/default/files/styles/infograph/public/images/2023/06/20/design_living_room_3_0.jpg",
      alt: "Home Decor"
    },
    {
      id: 2,
      title: "Wall Art",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
      alt: "Wall Art"
    },
    {
      id: 3,
      title: "Kitchen & Dining",
      // This one was not in your list, but keeping it updated
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2070&auto=format&fit=crop",
      alt: "Kitchen & Dining"
    },
    {
      id: 4,
      title: "Furniture",
       // This one was not in your list, but keeping it updated
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
      alt: "Furniture"
    },
    {
      id: 5,
      title: "Area Rugs",
      image: "https://m.media-amazon.com/images/I/81ZCxYcUZLL._UF894,1000_QL80_.jpg",
      alt: "Area Rugs"
    },
    {
      id: 6,
      title: "Lighting",
      // This one was not in your list, but keeping it updated
      image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1974&auto=format&fit=crop",
      alt: "Lighting"
    },
    {
      id: 7,
      title: "Bedding",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2070&auto=format&fit=crop",
      alt: "Bedding"
    },
    {
      id: 8,
      title: "Storage & Organization",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ17JWFQnNb-rJRhfNaPVXTlmEOy7ZikZu6g&s",
      alt: "Storage & Organization"
    },
    {
      id: 9,
      title: "Home Improvement",
      image: "https://img.buzzfeed.com/buzzfeed-static/static/2019-02/19/16/asset/buzzfeed-prod-web-02/sub-buzz-31271-1550612180-1.jpg?downsize=900:*&output-format=auto&output-quality=auto",
      alt: "Home Improvement"
    },
    {
      id: 10,
      title: "Bathroom",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      alt: "Bathroom"
    },
    {
      id: 11,
      title: "Curtains",
      // This one was not in your list, but keeping it updated
      image: "https://img.drz.lazcdn.com/g/kf/Sf64f4ee9bf5d4e1f92d5260692738f463.jpg_960x960q80.jpg_.webp",
      alt: "Curtains"
    },
    {
      id: 12,
      title: "Outdoor & Garden",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOuUWwbE-VMZCc13vLq8AqB6cKxa22THBZSQ&s",
      alt: "Outdoor & Garden"
    },
    {
      id: 13,
      title: "Trending: Decorative Lampshades",
      image: "https://5.imimg.com/data5/SELLER/Default/2021/9/RO/TH/YG/131919184/whatsapp-image-2021-09-13-at-9-31-58-pm-500x500.jpeg",
      alt: "Decorative Lampshades"
    },
    {
      id: 14,
      title: "Chrome Decor",
      image: "https://designbx.com/wp-content/uploads/2017/11/chromeaccessories.jpg",
      alt: "Chrome Decor"
    },
    {
      id: 15,
      title: "Vintage Glassware Sets",
      image: "https://m.media-amazon.com/images/I/71doKHdNbNL.jpg",
      alt: "Vintage Glassware Sets"
    },
    {
      id: 16,
      title: "Personalized Portraits",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT33PYYC9y5QYdjJlnFkdv3IST5PpZYrcKOQQ&s",
      alt: "Personalized Portraits"
    },
    {
      id: 17,
      title: "Original Paintings",
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop",
      alt: "Original Paintings"
    },
    {
      id: 18,
      title: "Vintage Home Decor",
      image: "https://www.elleihome.com/cdn/shop/articles/Ellei_Home_Vintage_Homewears_1000x1000.jpg?v=1685549365",
      alt: "Vintage Home Decor"
    }
  ];

  return (
    <section className={`home-favourites ${isDarkMode ? 'dark' : ''}`}>
      <div className="container">
        <div className="home-favourites__header">
          <h2 className="home-favourites__title">Home Favorites</h2>
          <p className="home-favourites__subtitle">
            Be our guest! Time to spruce up your living space with affordable statement pieces, essential finds, and decor to adore.
          </p>
        </div>
        
        <div className="home-favourites__grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-card__image-wrapper">
                <img 
                  src={category.image} 
                  alt={category.alt}
                  className="category-card__image"
                />
              </div>
              <div className="category-card__content">
                <h3 className="category-card__title">{category.title}</h3>
                <svg 
                  className="category-card__arrow" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path 
                    d="M6 12L10 8L6 4" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .home-favourites {
          padding: 60px 0;
          background-color: ${isDarkMode ? '#1a1a1a' : '#f8f6f0'};
          transition: background-color 0.3s ease;
        }
        
        .home-favourites.dark {
          background-color: #1a1a1a;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .home-favourites__header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .home-favourites__title {
          font-size: 2.5rem;
          font-weight: 400;
          color: ${isDarkMode ? '#ffffff' : '#333'};
          margin-bottom: 16px;
          font-family: 'Georgia', serif;
          transition: color 0.3s ease;
        }
        
        .home-favourites__subtitle {
          font-size: 1.1rem;
          color: ${isDarkMode ? '#b0b0b0' : '#666'};
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          transition: color 0.3s ease;
        }
        
        .home-favourites__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .category-card:hover {
          transform: translateY(-5px);
        }
        
        .category-card__image-wrapper {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 16px;
          box-shadow: ${isDarkMode 
            ? '0 4px 12px rgba(255, 255, 255, 0.1)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)'};
          transition: box-shadow 0.3s ease;
          border: ${isDarkMode ? '2px solid #333' : 'none'};
        }
        
        .category-card:hover .category-card__image-wrapper {
          box-shadow: ${isDarkMode 
            ? '0 6px 20px rgba(255, 255, 255, 0.15)' 
            : '0 6px 20px rgba(0, 0, 0, 0.15)'};
        }
        
        .category-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: ${isDarkMode ? 'brightness(0.8)' : 'none'};
          transition: filter 0.3s ease;
        }
        
        .category-card__content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .category-card__title {
          font-size: 0.95rem;
          font-weight: 500;
          color: ${isDarkMode ? '#ffffff' : '#333'};
          margin: 0;
          line-height: 1.3;
          transition: color 0.3s ease;
        }
        
        .category-card__arrow {
          color: ${isDarkMode ? '#b0b0b0' : '#666'};
          flex-shrink: 0;
          transition: transform 0.3s ease, color 0.3s ease;
        }
        
        .category-card:hover .category-card__arrow {
          transform: translateX(3px);
          color: ${isDarkMode ? '#ffffff' : '#333'};
        }
        
        @media (max-width: 768px) {
          .home-favourites {
            padding: 40px 0;
          }
          
          .home-favourites__title {
            font-size: 2rem;
          }
          
          .home-favourites__subtitle {
            font-size: 1rem;
          }
          
          .home-favourites__grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 25px;
          }
          
          .category-card__image-wrapper {
            width: 100px;
            height: 100px;
          }
          
          .category-card__title {
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 480px) {
          .home-favourites__grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .category-card__image-wrapper {
            width: 80px;
            height: 80px;
          }
          
          .category-card__title {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeFavourites;