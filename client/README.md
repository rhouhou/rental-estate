# Nestora Client

This folder contains the React/Vite frontend for Nestora, a full-stack real estate web application for browsing, creating, updating, and managing property listings.

## Features

* Modern responsive UI
* Home, About, Search, Listing, Profile, Sign In, and Sign Up pages
* Protected frontend routes
* User profile management
* Listing creation and editing
* Listing image uploads with Cloudinary
* Google sign-in with Firebase Authentication
* Global user state with Redux Toolkit and Redux Persist
* Listing search, filtering, and sorting

## Tech Stack

* React
* Vite
* React Router
* Redux Toolkit
* Redux Persist
* Tailwind CSS
* Swiper
* React Icons
* Firebase Authentication
* Cloudinary image uploads

## Environment Variables

Create a `.env` file inside the `client` folder:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_unsigned_upload_preset
```

Do not commit the real `.env` file.

An example file is included:

```text
client/.env.example
```

## Installation

From the project root:

```bash
npm install --prefix client
```

Or from inside the `client` folder:

```bash
npm install
```

## Development

From the project root:

```bash
npm run dev:client
```

Or from inside the `client` folder:

```bash
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Build

From the project root:

```bash
npm run build
```

Or from inside the `client` folder:

```bash
npm run build
```

The production build is generated in:

```text
client/dist
```

The backend serves this folder in production.

## Main Frontend Folders

```text
src/
├── components/
├── pages/
├── redux/
├── utils/
├── App.jsx
├── firebase.js
└── main.jsx
```

## Notes

Cloudinary is used for profile and listing image uploads.

Firebase is used only for Google sign-in.

MongoDB and JWT authentication are handled by the backend API.
