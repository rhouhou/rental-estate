# Nestora

Nestora is a full-stack real estate web application for browsing, creating, updating, and managing property listings. The app includes user authentication, protected routes, listing CRUD operations, image uploads, search filters, and a modern responsive frontend.

## Features

* User signup and signin
* Google sign-in with Firebase Authentication
* JWT-based authentication with secure cookies
* Protected profile, create listing, and update listing routes
* Create, update, delete, and view property listings
* Upload listing and profile images with Cloudinary
* Search listings by keyword, type, offer, parking, and furnished status
* Sort listings by price or date
* Contact listing owners by email
* Responsive React frontend
* Express and MongoDB backend
* Clean backend validation and error handling

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Redux Toolkit
* Redux Persist
* Tailwind CSS
* Swiper
* React Icons
* Firebase Authentication
* Cloudinary uploads

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* cookie-parser
* dotenv
* helmet
* express-rate-limit
* cors

## Project Structure

```text
rental-estate/
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── package.json
└── README.md
```

## API Routes

### Authentication

```text
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/google
GET  /api/auth/signout
```

### Users

```text
GET    /api/user/test
POST   /api/user/update/:id
DELETE /api/user/delete/:id
GET    /api/user/listings/:id
GET    /api/user/:id
```

### Listings

```text
POST   /api/listing/create
DELETE /api/listing/delete/:id
POST   /api/listing/update/:id
GET    /api/listing/get/:id
GET    /api/listing/get
```

### Health Check

```text
GET /api/health
```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

Create a `client/.env` file inside the `client` folder:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_unsigned_upload_preset
```

Example files are included:

```text
.env.example
client/.env.example
```

Do not commit real `.env` files.

## Installation

Clone the repository:

```bash
git clone https://github.com/rhouhou/rental-estate.git
cd rental-estate
```

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm install --prefix client
```

## Running Locally

Start the backend server from the root directory:

```bash
npm run dev:backend
```

The backend runs on:

```text
http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev:client
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Production Build

Build the frontend:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The Express server serves the production frontend from:

```text
client/dist
```

## Image Uploads

Nestora uses Cloudinary for image uploads.

Images are uploaded from the frontend using an unsigned Cloudinary upload preset. The returned Cloudinary image URLs are saved in MongoDB as part of each listing or user profile.

Required client environment variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_unsigned_upload_preset
```

## Google Sign-In

Nestora uses Firebase Authentication for Google sign-in.

Required client environment variable:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

The Firebase config is stored in:

```text
client/src/firebase.js
```

## Current Status

Nestora is a portfolio project demonstrating a full-stack MERN-style real estate application with authentication, image uploads, protected routes, search, filtering, listing management, and responsive UI design.

The project has been cleaned and improved with stronger validation, clearer backend error handling, Cloudinary uploads, Firebase Google sign-in, and a more professional frontend design.

## Planned Improvements

* Add screenshots to the README
* Add deployment instructions
* Add backend tests
* Add frontend form validation refinements
* Add better loading skeletons
* Add pagination metadata for listings
* Add saved/favorite listings
* Add map integration for listing locations
* Add role-based admin features
