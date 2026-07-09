import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const initialFormData = {
  imageUrls: [],
  name: "",
  description: "",
  address: "",
  type: "rent",
  bedrooms: 1,
  bathrooms: 1,
  regularPrice: 50,
  discountPrice: 0,
  offer: false,
  parking: false,
  furnished: false,
};

const inputClass =
  "border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300";

const UpdateListing = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [pageLoading, setPageLoading] = useState(true);
  const [imageUploadError, setImageUploadError] = useState("");
  const [imageUploadSuccess, setImageUploadSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { listingId } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setPageLoading(true);
        setError("");

        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setError(data.message || "Could not load listing.");
          return;
        }

        const listingOwnerId =
          typeof data.userRef === "object" ? data.userRef?._id : data.userRef;

        if (currentUser?._id && listingOwnerId !== currentUser._id) {
          setError("You can only update your own listings.");
          return;
        }

        setFormData({
          ...initialFormData,
          ...data,
        });
      } catch (error) {
        setError(error.message || "Could not load listing.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchListing();
  }, [listingId, currentUser?._id]);

  const handleImageSubmit = async () => {
    setImageUploadError("");
    setImageUploadSuccess("");

    if (files.length === 0) {
      setImageUploadError("Please choose at least one image.");
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can only upload up to 6 images per listing.");
      return;
    }

    try {
      setUploading(true);

      const urls = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));

      setImageUploadSuccess(
        `${urls.length} image${urls.length > 1 ? "s" : ""} uploaded successfully.`
      );

      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setImageUploadError(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));

    setImageUploadSuccess("");
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    setError("");

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
      return;
    }

    if (id === "offer") {
      setFormData((prev) => ({
        ...prev,
        offer: checked,
        discountPrice: checked ? prev.discountPrice : 0,
      }));
      return;
    }

    if (id === "parking" || id === "furnished") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) {
      setError("You must be signed in to update a listing.");
      return;
    }

    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image.");
      return;
    }

    if (
      formData.offer &&
      Number(formData.discountPrice) >= Number(formData.regularPrice)
    ) {
      setError("Discounted price must be lower than the regular price.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Could not update listing.");
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message || "Could not update listing.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-2xl font-semibold text-slate-700">
              Loading listing...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error && !formData._id) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-2xl font-semibold text-red-700">{error}</p>

            <Link
              to="/profile"
              className="inline-block mt-5 bg-slate-900 text-white px-5 py-3 rounded-lg hover:opacity-95"
            >
              Back to profile
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
            Manage property
          </p>
          <h1 className="text-4xl font-bold text-slate-800 mt-2">
            Update Listing
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Edit your property details, update images, and keep your Nestora
            listing accurate.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8"
        >
          {/* Property details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-5">
              Property details
            </h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Listing title"
                className={inputClass}
                id="name"
                maxLength="62"
                minLength="10"
                required
                onChange={handleChange}
                value={formData.name}
              />

              <textarea
                placeholder="Description"
                className={`${inputClass} min-h-32 resize-none`}
                id="description"
                required
                onChange={handleChange}
                value={formData.description}
              />

              <input
                type="text"
                placeholder="Address"
                className={inputClass}
                id="address"
                required
                onChange={handleChange}
                value={formData.address}
              />

              <div>
                <p className="font-semibold text-slate-700 mb-3">
                  Listing type
                </p>

                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="radio"
                      id="rent"
                      name="type"
                      className="w-5 h-5 accent-slate-900"
                      onChange={handleChange}
                      checked={formData.type === "rent"}
                    />
                    Rent
                  </label>

                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="radio"
                      id="sale"
                      name="type"
                      className="w-5 h-5 accent-slate-900"
                      onChange={handleChange}
                      checked={formData.type === "sale"}
                    />
                    Sale
                  </label>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-700 mb-3">
                  Property features
                </p>

                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-5 h-5 accent-slate-900"
                      onChange={handleChange}
                      checked={formData.parking}
                    />
                    Parking
                  </label>

                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-5 h-5 accent-slate-900"
                      onChange={handleChange}
                      checked={formData.furnished}
                    />
                    Furnished
                  </label>

                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-5 h-5 accent-slate-900"
                      onChange={handleChange}
                      checked={formData.offer}
                    />
                    Special offer
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 text-slate-700">
                  Bedrooms
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    className={inputClass}
                    onChange={handleChange}
                    value={formData.bedrooms}
                  />
                </label>

                <label className="flex flex-col gap-2 text-slate-700">
                  Bathrooms
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    className={inputClass}
                    onChange={handleChange}
                    value={formData.bathrooms}
                  />
                </label>

                <label className="flex flex-col gap-2 text-slate-700">
                  Regular price
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      id="regularPrice"
                      min="50"
                      max="1000000"
                      required
                      className={`${inputClass} pl-7 w-full`}
                      onChange={handleChange}
                      value={formData.regularPrice}
                    />
                  </div>
                  {formData.type === "rent" && (
                    <span className="text-xs text-slate-500">
                      Price per month
                    </span>
                  )}
                </label>

                {formData.offer && (
                  <label className="flex flex-col gap-2 text-slate-700">
                    Discounted price
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">
                        $
                      </span>
                      <input
                        type="number"
                        id="discountPrice"
                        min="0"
                        max="1000000"
                        required
                        className={`${inputClass} pl-7 w-full`}
                        onChange={handleChange}
                        value={formData.discountPrice}
                      />
                    </div>
                    {formData.type === "rent" && (
                      <span className="text-xs text-slate-500">
                        Discounted monthly price
                      </span>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Images and submit */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Listing images
            </h2>

            <p className="text-sm text-slate-500 mb-5">
              Upload up to 6 images. The first image will be used as the cover.
              Each image must be under 2 MB.
            </p>

            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                onChange={(e) => {
                  setFiles(Array.from(e.target.files));
                  setImageUploadError("");
                  setImageUploadSuccess("");
                }}
                className="p-3 border border-slate-200 rounded-lg w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />

              <button
                disabled={
                  uploading ||
                  files.length === 0 ||
                  formData.imageUrls.length >= 6
                }
                onClick={handleImageSubmit}
                type="button"
                className="p-3 text-green-700 border border-green-700 rounded-lg uppercase font-semibold hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload images"}
              </button>
            </div>

            {imageUploadError && (
              <p className="text-red-700 text-sm mt-3">{imageUploadError}</p>
            )}

            {imageUploadSuccess && (
              <p className="text-green-700 text-sm mt-3">
                {imageUploadSuccess}
              </p>
            )}

            {formData.imageUrls.length > 0 && (
              <div className="flex flex-col gap-3 mt-5">
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex justify-between gap-4 p-3 border border-slate-200 rounded-lg items-center"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={url}
                        alt={`Listing ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700">
                          Image {index + 1}
                        </p>
                        {index === 0 && (
                          <p className="text-xs text-slate-500">
                            Cover image
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 text-red-700 rounded-lg uppercase text-sm font-semibold hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              disabled={loading || uploading}
              className="w-full mt-6 p-3 bg-slate-900 text-white rounded-lg uppercase font-semibold hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>

            {error && <p className="text-red-700 text-sm mt-4">{error}</p>}
          </div>
        </form>
      </section>
    </main>
  );
};

export default UpdateListing;