import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const initialSidebarData = {
  searchTerm: "",
  type: "all",
  parking: false,
  furnished: false,
  offer: false,
  sort: "createdAt",
  order: "desc",
};

const checkboxClass = "w-5 h-5 accent-slate-900";
const inputClass =
  "border border-slate-200 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-slate-300";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState(initialSidebarData);
  const [loading, setLoading] = useState(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const typeFromUrl = urlParams.get("type") || "all";
    const parkingFromUrl = urlParams.get("parking") === "true";
    const furnishedFromUrl = urlParams.get("furnished") === "true";
    const offerFromUrl = urlParams.get("offer") === "true";
    const sortFromUrl = urlParams.get("sort") || "createdAt";
    const orderFromUrl = urlParams.get("order") || "desc";

    setSidebardata({
      searchTerm: searchTermFromUrl,
      type: typeFromUrl,
      parking: parkingFromUrl,
      furnished: furnishedFromUrl,
      offer: offerFromUrl,
      sort: sortFromUrl,
      order: orderFromUrl,
    });

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");
        setShowMore(false);

        urlParams.set("limit", 9);

        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setError(data.message || "Could not load listings.");
          setListings([]);
          return;
        }

        setListings(Array.isArray(data) ? data : []);
        setShowMore(Array.isArray(data) && data.length > 8);
      } catch (error) {
        setError(error.message || "Could not load listings.");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    setError("");

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebardata((prev) => ({
        ...prev,
        type: id,
      }));
      return;
    }

    if (id === "searchTerm") {
      setSidebardata((prev) => ({
        ...prev,
        searchTerm: value,
      }));
      return;
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setSidebardata((prev) => ({
        ...prev,
        [id]: checked,
      }));
      return;
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");

      setSidebardata((prev) => ({
        ...prev,
        sort: sort || "createdAt",
        order: order || "desc",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    if (sidebardata.searchTerm.trim()) {
      urlParams.set("searchTerm", sidebardata.searchTerm.trim());
    }

    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    try {
      setShowMoreLoading(true);
      setError("");

      const numberOfListings = listings.length;
      const urlParams = new URLSearchParams(location.search);

      urlParams.set("startIndex", numberOfListings);
      urlParams.set("limit", 9);

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Could not load more listings.");
        return;
      }

      setListings((prev) => [...prev, ...data]);
      setShowMore(data.length > 8);
    } catch (error) {
      setError(error.message || "Could not load more listings.");
    } finally {
      setShowMoreLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
            Search properties
          </p>

          <h1 className="text-4xl font-bold text-slate-800 mt-2">
            Find your next home
          </h1>

          <p className="text-slate-500 mt-2 max-w-2xl">
            Search and filter rental and sale listings by property type,
            amenities, offers, and price.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Filters */}
          <aside className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
            <h2 className="text-2xl font-semibold text-slate-800 mb-5">
              Filters
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="searchTerm"
                  className="block font-semibold text-slate-700 mb-2"
                >
                  Search term
                </label>

                <input
                  type="text"
                  id="searchTerm"
                  placeholder="City, address, keyword..."
                  className={inputClass}
                  value={sidebardata.searchTerm}
                  onChange={handleChange}
                />
              </div>

              <div>
                <p className="font-semibold text-slate-700 mb-3">Type</p>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="radio"
                      id="all"
                      name="type"
                      className={checkboxClass}
                      onChange={handleChange}
                      checked={sidebardata.type === "all"}
                    />
                    Rent & Sale
                  </label>

                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="radio"
                      id="rent"
                      name="type"
                      className={checkboxClass}
                      onChange={handleChange}
                      checked={sidebardata.type === "rent"}
                    />
                    Rent
                  </label>

                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="radio"
                      id="sale"
                      name="type"
                      className={checkboxClass}
                      onChange={handleChange}
                      checked={sidebardata.type === "sale"}
                    />
                    Sale
                  </label>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-700 mb-3">Options</p>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      id="offer"
                      className={checkboxClass}
                      onChange={handleChange}
                      checked={sidebardata.offer}
                    />
                    Special offer
                  </label>

                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      id="parking"
                      className={checkboxClass}
                      onChange={handleChange}
                      checked={sidebardata.parking}
                    />
                    Parking
                  </label>

                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      id="furnished"
                      className={checkboxClass}
                      onChange={handleChange}
                      checked={sidebardata.furnished}
                    />
                    Furnished
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="sort_order"
                  className="block font-semibold text-slate-700 mb-2"
                >
                  Sort by
                </label>

                <select
                  onChange={handleChange}
                  value={`${sidebardata.sort}_${sidebardata.order}`}
                  id="sort_order"
                  className={inputClass}
                >
                  <option value="regularPrice_desc">Price high to low</option>
                  <option value="regularPrice_asc">Price low to high</option>
                  <option value="createdAt_desc">Latest</option>
                  <option value="createdAt_asc">Oldest</option>
                </select>
              </div>

              <button className="bg-slate-900 text-white p-3 rounded-lg uppercase font-semibold hover:opacity-95">
                Search
              </button>
            </form>
          </aside>

          {/* Results */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Listing results
                </h2>

                <p className="text-slate-500 mt-1">
                  {loading
                    ? "Searching properties..."
                    : `${listings.length} listing${
                        listings.length === 1 ? "" : "s"
                      } found`}
                </p>
              </div>
            </div>

            {loading && (
              <div className="text-center py-12">
                <p className="text-xl text-slate-600">Loading listings...</p>
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
                {error}
              </div>
            )}

            {!loading && !error && listings.length === 0 && (
              <div className="border border-dashed border-slate-300 rounded-xl p-10 text-center">
                <h3 className="text-xl font-semibold text-slate-700">
                  No listings found
                </h3>

                <p className="text-slate-500 mt-2">
                  Try changing your search term or removing some filters.
                </p>
              </div>
            )}

            {!loading && !error && listings.length > 0 && (
              <div className="flex flex-wrap gap-5">
                {listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {showMore && !loading && !error && (
              <button
                type="button"
                disabled={showMoreLoading}
                onClick={onShowMoreClick}
                className="text-green-700 hover:underline p-7 text-center w-full font-semibold disabled:opacity-60"
              >
                {showMoreLoading ? "Loading more..." : "Show more"}
              </button>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Search;