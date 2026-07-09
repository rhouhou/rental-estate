# Rental Estate

Rental Estate is a full-stack MERN-style real estate application for browsing, creating, updating, and managing property listings. The app includes user authentication, protected user actions, listing management, and a React frontend built with Vite.

## Features

* User signup and signin
* Google authentication route support
* JWT-based authentication with secure cookies
* Create, update, delete, and view property listings
* View user-specific listings
* Search and browse listings
* React frontend with Vite
* Express and MongoDB backend
* Protected API routes for authenticated user actions

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* cookie-parser
* dotenv

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
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
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
POST /api/listing/create
POST /api/listing/delete/:id
POST /api/listing/update/:id
GET  /api/listing/get/:id
GET  /api/listing/get
```

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB Atlas account or local MongoDB database

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

An example file is included as `.env.example`.

> Do not commit your real `.env` file to GitHub.

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
cd client
npm install
cd ..
```

## Running the App Locally

Start the backend server from the root directory:

```bash
npm run dev:backend
```

The backend runs on:

```text
http://localhost:3000
```

In a second terminal, start the frontend development server:

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

The Express server serves the built frontend from:

```text
client/dist
```

## Current Status

Rental Estate is a portfolio project demonstrating a full-stack real estate application with authentication, protected user routes, listing CRUD operations, and a React frontend.

The project is currently in active cleanup and improvement. Planned improvements include stronger backend validation, clearer API error handling, improved documentation, deployment setup, screenshots, and frontend polish.

## Planned Improvements

* Add API health check endpoint
* Add clearer backend error handling
* Validate required environment variables
* Validate MongoDB ObjectIds on protected routes
* Improve listing and user controller logic
* Add frontend loading and error states
* Add screenshots to the README
* Add deployment instructions
* Add security middleware
* Add a changelog and license
