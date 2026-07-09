export default function About() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            About Nestora
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold mt-4 max-w-3xl">
            A modern real estate platform for discovering, listing, and managing
            homes.
          </h1>

          <p className="text-slate-300 mt-6 max-w-2xl text-base sm:text-lg">
            Nestora is a full-stack real estate web application built to make
            property browsing and listing management simple, clear, and user
            friendly.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">
              Browse properties
            </h2>
            <p className="text-slate-600 mt-3">
              Users can explore recent listings, search for homes, and filter
              properties by rent, sale, offers, amenities, and more.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">
              Manage listings
            </h2>
            <p className="text-slate-600 mt-3">
              Authenticated users can create, update, and delete their own
              property listings with uploaded images and detailed property
              information.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">
              Built with MERN
            </h2>
            <p className="text-slate-600 mt-3">
              The project uses React, Node.js, Express, MongoDB, JWT
              authentication, Cloudinary image uploads, and Firebase Google
              sign-in.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-800 mb-5">
            Project purpose
          </h2>

          <p className="text-slate-700 mb-4 leading-relaxed">
            Nestora was developed as a portfolio project to demonstrate a
            complete full-stack application workflow. It includes user
            authentication, protected routes, CRUD operations, image uploads,
            property search, responsive UI design, and backend API integration.
          </p>

          <p className="text-slate-700 mb-4 leading-relaxed">
            The goal of the project is to show how a real-world property
            platform can be structured, from database models and API controllers
            to reusable frontend components and user-facing pages.
          </p>

          <p className="text-slate-700 leading-relaxed">
            While Nestora is not a real estate agency, it is designed to reflect
            the core features of a professional rental and property listing
            application.
          </p>
        </div>
      </section>
    </main>
  );
}