# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

* Nestora branding across the frontend.
* Redesigned Home, About, Search, Listing, Profile, Sign In, Sign Up, Create Listing, and Update Listing pages.
* Cloudinary image uploads for profile and listing images.
* Firebase Google sign-in support.
* Protected routes for profile, create listing, and update listing pages.
* Listing owner actions for editing and deleting listings.
* Contact landlord component with mailto support.
* Backend validation for users and listings.
* ObjectId validation middleware.
* Improved JWT authentication middleware.
* API health check endpoint.
* Security middleware with Helmet, CORS, and rate limiting.
* Environment example files for backend and frontend.
* Updated root and client README files.

### Changed

* Replaced Firebase Storage uploads with Cloudinary.
* Improved listing search, filters, sorting, and pagination behavior.
* Improved Redux user state handling.
* Improved backend error handling for validation, duplicate fields, invalid IDs, and authentication errors.
* Cleaned user, auth, listing controllers and route definitions.
* Updated app UI to a more professional portfolio-ready design.

### Fixed

* Fixed listing edit route.
* Fixed listing ownership checks.
* Fixed Google OAuth navigation bug.
* Fixed listing bathroom label.
* Fixed stale upload states and unclear upload errors.
* Removed unnecessary console logs and frontend typos.
