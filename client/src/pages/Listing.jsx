import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");
        setActionError("");

        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setError(data.message || "Could not load this listing.");
          return;
        }

        setListing(data);
      } catch (error) {
        setError(error.message || "Could not load this listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      setActionError("Could not copy the listing link.");
    }
  };

  const handleDeleteListing = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) return;

    try {
      setActionError("");

      const res = await fetch(`/api/listing/delete/${listing._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setActionError(data.message || "Could not delete this listing.");
        return;
      }

      navigate("/profile");
    } catch (error) {
      setActionError(error.message || "Could not delete this listing.");
    }
  };

  if (loading) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-2xl font-semibold text-slate-700">
              Loading listing...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-2xl font-semibold text-red-700">{error}</p>

            <Link
              to="/search"
              className="inline-block mt-5 bg-slate-900 text-white px-5 py-3 rounded-lg hover:opacity-95"
            >
              Back to search
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return null;
  }

  const listingOwnerId =
    typeof listing.userRef === "object" ? listing.userRef?._id : listing.userRef;

  const isOwner = currentUser && listingOwnerId === currentUser._id;

  const displayedPrice = listing.offer
    ? listing.discountPrice
    : listing.regularPrice;

  const savings = Number(listing.regularPrice) - Number(listing.discountPrice);

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Image gallery */}
      <section className="relative bg-slate-900">
        {listing.imageUrls && listing.imageUrls.length > 0 ? (
          <Swiper navigation modules={[Navigation]}>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[360px] sm:h-[480px] lg:h-[560px]"
                  style={{
                    background: `linear-gradient(rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.25)), url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  aria-label={`Listing image ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-[360px] sm:h-[480px] lg:h-[560px] flex items-center justify-center text-white">
            No images available
          </div>
        )}

        <button
          type="button"
          onClick={handleCopyLink}
          className="absolute top-6 right-6 z-10 rounded-full w-12 h-12 flex justify-center items-center bg-white/90 shadow-md hover:bg-white transition"
          aria-label="Copy listing link"
        >
          <FaShare className="text-slate-600" />
        </button>

        {copied && (
          <p className="absolute top-20 right-6 z-10 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 shadow-md">
            Link copied!
          </p>
        )}
      </section>

      {/* Listing content */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>

              {listing.offer && (
                <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  ${savings.toLocaleString("en-US")} off
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              {listing.name}
            </h1>

            <p className="flex items-center gap-2 text-slate-500 mt-4">
              <FaMapMarkedAlt className="text-green-700" />
              {listing.address}
            </p>

            <div className="mt-6">
              <p className="text-3xl font-bold text-slate-900">
                ${Number(displayedPrice).toLocaleString("en-US")}
                {listing.type === "rent" && (
                  <span className="text-base font-medium text-slate-500">
                    {" "}
                    / month
                  </span>
                )}
              </p>

              {listing.offer && (
                <p className="text-sm text-slate-500 mt-1">
                  Regular price: $
                  {Number(listing.regularPrice).toLocaleString("en-US")}
                  {listing.type === "rent" && " / month"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <FeatureCard
                icon={<FaBed />}
                label={listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                value={listing.bedrooms}
              />

              <FeatureCard
                icon={<FaBath />}
                label={listing.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                value={listing.bathrooms}
              />

              <FeatureCard
                icon={<FaParking />}
                label="Parking"
                value={listing.parking ? "Yes" : "No"}
              />

              <FeatureCard
                icon={<FaChair />}
                label="Furnished"
                value={listing.furnished ? "Yes" : "No"}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-800">
                Description
              </h2>

              <p className="text-slate-700 leading-relaxed mt-3 whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {actionError && (
              <p className="text-red-700 text-sm mt-5">{actionError}</p>
            )}
          </div>

          {/* Action card */}
          <aside className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
            <h2 className="text-xl font-semibold text-slate-800">
              Interested in this property?
            </h2>

            <p className="text-slate-500 text-sm mt-2">
              Manage your own listing or contact the owner for more details.
            </p>

            {isOwner && (
              <div className="flex flex-col gap-3 mt-6">
                <Link
                  to={`/update-listing/${listing._id}`}
                  className="bg-green-700 text-white text-center p-3 rounded-lg uppercase font-semibold hover:opacity-95"
                >
                  Edit Listing
                </Link>

                <button
                  type="button"
                  onClick={handleDeleteListing}
                  className="bg-red-700 text-white text-center p-3 rounded-lg uppercase font-semibold hover:opacity-95"
                >
                  Delete Listing
                </button>
              </div>
            )}

            {currentUser && !isOwner && !contact && (
              <button
                type="button"
                onClick={() => setContact(true)}
                className="w-full bg-slate-900 text-white rounded-lg uppercase p-3 mt-6 font-semibold hover:opacity-95"
              >
                Contact Landlord
              </button>
            )}

            {!currentUser && (
              <Link
                to="/sign-in"
                className="block bg-slate-900 text-white rounded-lg uppercase p-3 mt-6 text-center font-semibold hover:opacity-95"
              >
                Sign in to contact
              </Link>
            )}

            {contact && (
              <div className="mt-6">
                <Contact listing={listing} />
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
};

const FeatureCard = ({ icon, label, value }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
      <div className="text-green-700 text-xl">{icon}</div>
      <p className="text-xl font-bold text-slate-800 mt-2">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
};

export default Listing;