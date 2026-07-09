import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed, FaChair, FaParking } from "react-icons/fa";

const fallbackImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

export default function ListingItem({ listing }) {
  const coverImage = listing.imageUrls?.[0] || fallbackImage;

  const displayedPrice = listing.offer
    ? listing.discountPrice
    : listing.regularPrice;

  return (
    <article className="bg-white shadow-sm hover:shadow-xl transition-shadow overflow-hidden rounded-2xl border border-slate-100 w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={coverImage}
            alt={listing.name}
            className="h-[260px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>

            {listing.offer && (
              <span className="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Offer
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div>
            <h3 className="truncate text-lg font-semibold text-slate-800">
              {listing.name}
            </h3>

            <div className="flex items-center gap-1 mt-2">
              <MdLocationOn className="h-4 w-4 text-green-700 flex-shrink-0" />
              <p className="text-sm text-slate-500 truncate">
                {listing.address}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          <div>
            <p className="text-xl font-bold text-slate-900">
              ${Number(displayedPrice).toLocaleString("en-US")}
              {listing.type === "rent" && (
                <span className="text-sm font-medium text-slate-500">
                  {" "}
                  / month
                </span>
              )}
            </p>

            {listing.offer && (
              <p className="text-xs text-slate-500 mt-1">
                Regular price: $
                {Number(listing.regularPrice).toLocaleString("en-US")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-700 text-sm border-t border-slate-100 pt-3">
            <Feature
              icon={<FaBed />}
              text={`${listing.bedrooms} ${
                listing.bedrooms > 1 ? "beds" : "bed"
              }`}
            />

            <Feature
              icon={<FaBath />}
              text={`${listing.bathrooms} ${
                listing.bathrooms > 1 ? "baths" : "bath"
              }`}
            />

            <Feature
              icon={<FaParking />}
              text={listing.parking ? "Parking" : "No parking"}
            />

            <Feature
              icon={<FaChair />}
              text={listing.furnished ? "Furnished" : "Unfurnished"}
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-green-700 flex-shrink-0">{icon}</span>
      <span className="font-semibold text-xs truncate">{text}</span>
    </div>
  );
}