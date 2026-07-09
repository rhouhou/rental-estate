import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const APP_NAME = "Nestora";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const requests = [
          fetch("/api/listing/get?offer=true&limit=4"),
          fetch("/api/listing/get?type=rent&limit=4"),
          fetch("/api/listing/get?type=sale&limit=4"),
        ];

        const responses = await Promise.all(requests);

        const data = await Promise.all(
          responses.map(async (res) => {
            const json = await res.json();

            if (!res.ok || json.success === false) {
              throw new Error(json.message || "Failed to fetch listings");
            }

            return Array.isArray(json) ? json : [];
          })
        );

        setOfferListings(data[0]);
        setRentListings(data[1]);
        setSaleListings(data[2]);
      } catch (error) {
        console.error("Failed to fetch homepage listings:", error);
        setFetchError("We could not load listings right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const featuredListings =
    offerListings.length > 0
      ? offerListings
      : [...rentListings, ...saleListings].slice(0, 4);

  const hasListings =
    offerListings.length > 0 || rentListings.length > 0 || saleListings.length > 0;

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 mb-6">
              Welcome to {APP_NAME}
            </p>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Find a home that fits your life, your budget, and your plans.
            </h1>

            <p className="mt-6 text-slate-200 text-base sm:text-lg max-w-2xl">
              Browse curated rental and sale listings, compare key property
              details, and discover your next place with a simple, modern real
              estate experience.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/search"
                className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold text-center hover:bg-slate-100 transition"
              >
                Browse listings
              </Link>

              <Link
                to="/create-listing"
                className="border border-white/40 px-6 py-3 rounded-lg font-semibold text-center hover:bg-white/10 transition"
              >
                List your property
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14">
            <div className="bg-white/10 rounded-xl p-5 border border-white/10">
              <p className="text-2xl font-bold">Rent</p>
              <p className="text-slate-300 text-sm mt-1">
                Explore homes and apartments available for rent.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-5 border border-white/10">
              <p className="text-2xl font-bold">Buy</p>
              <p className="text-slate-300 text-sm mt-1">
                Find properties listed for sale in one place.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-5 border border-white/10">
              <p className="text-2xl font-bold">Manage</p>
              <p className="text-slate-300 text-sm mt-1">
                Create, update, and manage your own listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured image slider */}
      {featuredListings.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
          <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
            <Swiper navigation modules={[Navigation]}>
              {featuredListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <Link to={`/listing/${listing._id}`}>
                    <div
                      style={{
                        background: `linear-gradient(rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.35)), url(${
                          listing.imageUrls?.[0]
                        }) center no-repeat`,
                        backgroundSize: "cover",
                      }}
                      className="h-[320px] sm:h-[420px] lg:h-[500px] flex items-end"
                    >
                      <div className="p-6 sm:p-8 text-white">
                        <p className="text-sm uppercase tracking-wide text-slate-200">
                          Featured property
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                          {listing.name}
                        </h2>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
              Latest properties
            </p>
            <h2 className="text-3xl font-bold text-slate-800 mt-2">
              Explore available homes
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Discover recent offers, rentals, and properties for sale from one
              clean and easy-to-use dashboard.
            </p>
          </div>

          <Link
            to="/search"
            className="text-blue-700 font-semibold hover:underline"
          >
            View all listings
          </Link>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-8 text-center text-slate-500 shadow-sm">
            Loading listings...
          </div>
        )}

        {fetchError && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && !hasListings && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-slate-700">
              No listings yet
            </h3>
            <p className="text-slate-500 mt-2">
              Create the first property listing to start showcasing the app.
            </p>
            <Link
              to="/create-listing"
              className="inline-block mt-5 bg-slate-800 text-white px-5 py-3 rounded-lg hover:opacity-95"
            >
              Create listing
            </Link>
          </div>
        )}

        {!loading && !fetchError && hasListings && (
          <div className="flex flex-col gap-12">
            <ListingSection
              title="Special offers"
              linkText="Show more offers"
              linkTo="/search?offer=true"
              listings={offerListings}
            />

            <ListingSection
              title="Homes for rent"
              linkText="Show more rentals"
              linkTo="/search?type=rent"
              listings={rentListings}
            />

            <ListingSection
              title="Homes for sale"
              linkText="Show more properties for sale"
              linkTo="/search?type=sale"
              listings={saleListings}
            />
          </div>
        )}
      </section>
    </main>
  );
}

function ListingSection({ title, linkText, linkTo, listings }) {
  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <h3 className="text-2xl font-semibold text-slate-700">{title}</h3>

        <Link
          className="text-sm text-blue-700 font-semibold hover:underline"
          to={linkTo}
        >
          {linkText}
        </Link>
      </div>

      <div className="flex flex-wrap gap-5">
        {listings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  );
}