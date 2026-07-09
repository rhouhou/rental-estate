# Rental Estate Client

This folder contains the React/Vite frontend for the Rental Estate application.

The frontend provides the user interface for browsing listings, signing in, creating property listings, updating user profile information, and managing user-specific listings.

## Main Tools

* React
* Vite
* JavaScript
* CSS

## Development

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

During development, API requests are handled by the backend server running from the root project folder.

## Build

Create a production build:

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

In production, the Express backend serves this build from the `client/dist` folder.
