https://www.youtube.com/watch?v=Cbzzq9c5NXg

ArtisanAura – Full‑Stack E‑commerce (Monorepo)

Overview

ArtisanAura is a full‑stack e‑commerce application built with a Node.js/Express + MongoDB backend and a React (Vite) + Tailwind frontend. It supports product management, authentication with JWT + refresh tokens, checkout with Stripe, order management for buyers and sellers, reviews, a simple admin area, a help desk flow, and an image‑aware chatbot (Gemini API) to assist users.

Repository structure

- backend – Express API, MongoDB models, services, and routes
- frontend – React app (Vite + Tailwind)

## Key Features

### 🔐 Authentication & Profiles
- Register, login, logout with JWT + refresh tokens (secure HTTP-only cookies)  
- Email verification, password reset, and multi-session logout  
- User profiles with editable details and roles (buyer, seller, admin)

### 🛍️ Products & Catalog
- Create, update, delete, and manage product/service listings  
- Product catalog with categories, subcategories, and seller-specific pages  
- Advanced search and multi-filter browsing  
- Detailed product pages with descriptions, ratings, reviews, and images  
- AI-assisted product description generation (Gemini integration)  
- Image uploads for products and reviews

### 🏪 Shops & Dashboards
- Public shop pages and seller profiles  
- Buyer dashboard for tracking orders and reviews  
- Seller dashboard with order management, analytics, and sales statistics  
- Shop management tools for sellers

### 💬 Messaging 
- user ↔ admin help messaging system  
- Real-time notifications for new orders, sales, reviews, disputes, and updates

### 💳 Checkout & Orders
- Stripe integration for secure payments  
- Automatic post-payment order confirmation  
- Buyer and seller order management (statuses, tracking, analytics)  

### ⭐ Reviews & Ratings
- Product and shop reviews (with optional images)  
- Star ratings to build reputation and trust  

### 🆘 Support & Dispute Resolution
- Built-in help desk for submitting and tracking tickets  
- Admin-mediated dispute resolution between buyers and sellers  
- Help center with resources and FAQs  

### ⚙️ Admin Panel
- Manage users, products, orders, reviews, and support tickets  
- Monitor platform metrics and activity summaries  

### 🤖 AI & Chatbot
- AI chatbot powered by **Gemini API** (text + image prompts)  
- Product description auto-generation and suggestions  

---

Tech stack

- Backend: Node.js, Express, Mongoose, JWT, Multer, Nodemailer, Stripe
- Frontend: React 19, React Router, Axios, Vite, Tailwind CSS

Quick start

1) Prerequisites

- Node.js 18+ and npm or yarn
- A MongoDB connection string
- Stripe account (for checkout)
- Google Generative AI (Gemini) API key (for chatbot)

2) Clone and install

```bash
git clone <your-repo-url> artisanaura
cd artisanaura

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3) Configure environment

Create a .env file in backend with the following keys:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@<host>/<db>?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx

# Mail (Nodemailer)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_password
MAIL_FROM=no-reply@artisanaura.local
# Optional: use ethereal for testing (auto-creates test account)
ENABLE_ETHEREAL=false

# Gemini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
```

4) Run the apps

```bash
# In one terminal
cd backend
npm run dev

# In another terminal
cd frontend
npm run dev
```

- Backend runs on http://localhost:3000
- Frontend runs on http://localhost:5173

Configuration notes

- CORS: Backend currently allows origin http://localhost:5173 with credentials enabled.
- Static uploads: Backend serves files from /uploads; product/review routes accept images via Multer.
- API base URL: Frontend uses http://localhost:3000/api (see frontend/src/api/client.js). Refresh token endpoint is /api/refresh.

Scripts

Backend (package.json):

- npm run dev – Start with nodemon on PORT (defaults to 3000)
- npm start – Start with node

Frontend (package.json):

- npm run dev – Start Vite dev server
- npm run build – Build for production
- npm run preview – Preview the built app
- npm run lint – Lint the codebase

API overview

Base URL: http://localhost:3000

Auth (prefixed with /api):

- POST /api/register – Register
- POST /api/login – Login; sets refresh cookie; returns access token
- GET /api/me – Current user (Bearer)
- POST /api/change-password – Change password (Bearer)
- POST /api/verify-email – Verify email via code
- POST /api/resend-verification – Resend verification code
- POST /api/update-email – Initiate email change
- POST /api/verify-email-change – Confirm email change (Bearer)
- POST /api/resend-email-change – Resend email change code (Bearer)
- POST /api/refresh – Issue new access token from refresh cookie
- POST /api/logout – Clear refresh cookie
- POST /api/logout-all – Invalidate other sessions (Bearer)

Products (prefixed with /api/products):

- POST / – Create (Bearer, image single: image)
- PUT /:id – Update (Bearer, image single: image)
- DELETE /:id – Delete (Bearer)
- GET /myshop – List seller products (Bearer)
- GET /category/:category/:subcategory – List by category/subcategory
- GET /search/:query – Search products

Shop (prefixed with /api/shop):

- GET / – Get current seller shop profile (Bearer)
- GET /seller/:sellerId – Public shop info by seller id
- POST / – Create/update current seller shop (Bearer)

Orders (prefixed with /api/orders):

- POST /confirm – Confirm order after payment (Bearer)
- GET /seller – Seller orders (Bearer)
- GET /seller/stats – Seller stats (Bearer)
- GET /seller/analytics – Seller analytics (Bearer)
- GET /buyer – Buyer orders (Bearer)

Checkout (prefixed with /checkout):

- POST / – Create Stripe checkout session

Reviews (prefixed with /api/reviews):

- GET /product/:productId – Product reviews
- GET /shop/:sellerId – Shop reviews
- POST /product/:productId – Create product review (Bearer, images array: images)
- POST /shop/:sellerId – Create shop review (Bearer, images array: images)

Help desk (prefixed with /api/help):

- POST / – Create help request (Bearer)
- GET /mine – List my help requests (Bearer)

Admin (prefixed with /api/admin):

- GET /summary – System metrics
- GET /users – List users
- PATCH /users/:id/role – Update user role
- GET /products – List products
- PATCH /products/:id – Patch product
- DELETE /products/:id – Delete product
- GET /orders – List orders
- PATCH /orders/:id/status – Update order status
- GET /reviews – List reviews
- DELETE /reviews/:id – Delete a review
- GET /help – List help requests
- PATCH /help/:id/status – Update help status

Authentication flow

- Login returns a short‑lived access token (stored in localStorage by the frontend) and sets an HTTP‑only refresh cookie.
- Frontend attaches Authorization: Bearer <access> to requests. On 401, it automatically calls /api/refresh to obtain a new access token.
- Refresh cookie is cleared on logout; logout‑all bumps token version to invalidate other sessions.

File uploads

- Product creation/update uses upload.single('image')
- Reviews use upload.array('images', 4)
- Uploaded files are served from GET /uploads/<filename>

Email

- Outbound mail via SMTP (configure SMTP_HOST/PORT/USER/PASS and MAIL_FROM). Set ENABLE_ETHEREAL=true to use Ethereal for local testing.

Chatbot

- Configure GEMINI_API_KEY and optional GEMINI_MODEL. Endpoint: POST /api/chatbot/chat (supports text and up to 3 images).

Production notes

- Set NODE_ENV=production to enable secure cookie settings.
- Configure CORS origin to your deployed frontend URL in backend/index.js.
- Ensure STRIPE_SECRET_KEY and all JWT secrets are set via environment variables.
- Serve frontend separately (e.g., static hosting) and point it to your backend API base URL.

Troubleshooting

- 401 responses: Ensure JWT_SECRET/REFRESH secret values are set and consistent; confirm refresh cookie domain/path in browser.
- Mongo connection errors: Verify MONGODB_URI and that your IP is whitelisted (Atlas).
- Stripe errors: Confirm STRIPE_SECRET_KEY and that the price/product IDs passed from frontend exist.
- Image uploads fail: Check that the backend has write access to backend/uploads and that requests use the correct form field names.

License

MIT – see LICENSE if present.
