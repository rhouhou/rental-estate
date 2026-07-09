import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState("");
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showListingsError, setShowListingsError] = useState("");
  const [userListings, setUserListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!currentUser?._id) return;

      try {
        setListingsLoading(true);
        setShowListingsError("");

        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();

        if (data.success === false) {
          setShowListingsError(data.message || "Error loading listings");
          return;
        }

        setUserListings(data);
      } catch (error) {
        setShowListingsError(error.message || "Error loading listings");
      } finally {
        setListingsLoading(false);
      }
    };

    fetchUserListings();
  }, [currentUser?._id]);

  const handleFileUpload = async (file) => {
    try {
      setFileUploadError("");
      setFilePerc(10);

      const imageUrl = await uploadToCloudinary(file);

      setFormData((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));

      setFilePerc(100);
    } catch (error) {
      console.error("Profile image upload error:", error);
      setFileUploadError(error.message || "Image upload failed");
      setFilePerc(0);
    }
  };

  const handleChange = (e) => {
    setUpdateSuccess(false);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setFormData({});
      setFilePerc(0);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleListingDelete = async (listingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(data.message || "Could not delete listing");
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      setShowListingsError(error.message || "Could not delete listing");
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              My Profile
            </h1>
            <p className="text-slate-500 text-sm mb-6">
              Update your account details, profile image, and password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
              />

              <div className="flex flex-col items-center">
                <img
                  onClick={() => fileRef.current.click()}
                  src={formData.avatar || currentUser.avatar}
                  alt="Profile"
                  className="rounded-full h-28 w-28 object-cover cursor-pointer border-4 border-slate-100 hover:opacity-90 transition"
                />

                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="text-sm text-blue-700 font-semibold mt-3 hover:underline"
                >
                  Change photo
                </button>

                <p className="text-sm mt-2 min-h-5">
                  {fileUploadError ? (
                    <span className="text-red-700">{fileUploadError}</span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-slate-600">
                      Uploading image...
                    </span>
                  ) : filePerc === 100 ? (
                    <span className="text-green-700">
                      Image uploaded successfully.
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>

              <input
                type="text"
                placeholder="Username"
                id="username"
                defaultValue={currentUser.username}
                onChange={handleChange}
                className="border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              />

              <input
                type="email"
                placeholder="Email"
                id="email"
                defaultValue={currentUser.email}
                onChange={handleChange}
                className="border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              />

              <input
                type="password"
                placeholder="New password"
                id="password"
                onChange={handleChange}
                className="border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              />

              <button
                disabled={loading}
                className="bg-slate-900 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 disabled:opacity-70"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>

              <Link
                className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                to="/create-listing"
              >
                Create Listing
              </Link>
            </form>

            <div className="flex justify-between mt-5 text-sm">
              <button
                type="button"
                onClick={handleDeleteUser}
                className="text-red-700 font-semibold hover:underline"
              >
                Delete account
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="text-red-700 font-semibold hover:underline"
              >
                Sign out
              </button>
            </div>

            {error && <p className="text-red-700 mt-5 text-sm">{error}</p>}

            {updateSuccess && (
              <p className="text-green-700 mt-5 text-sm">
                Profile updated successfully.
              </p>
            )}
          </div>

          {/* Listings card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  My Listings
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Manage the properties you have created.
                </p>
              </div>

              <Link
                to="/create-listing"
                className="bg-slate-900 text-white px-5 py-3 rounded-lg text-sm font-semibold text-center hover:opacity-95"
              >
                Add Listing
              </Link>
            </div>

            {listingsLoading && (
              <p className="text-slate-500">Loading your listings...</p>
            )}

            {showListingsError && (
              <p className="text-red-700 mb-4">{showListingsError}</p>
            )}

            {!listingsLoading && userListings.length === 0 && (
              <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold text-slate-700">
                  No listings yet
                </h3>
                <p className="text-slate-500 mt-2">
                  Create your first property listing and it will appear here.
                </p>
                <Link
                  to="/create-listing"
                  className="inline-block mt-5 bg-slate-900 text-white px-5 py-3 rounded-lg hover:opacity-95"
                >
                  Create listing
                </Link>
              </div>
            )}

            {userListings.length > 0 && (
              <div className="flex flex-col gap-4">
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <Link to={`/listing/${listing._id}`}>
                      <img
                        src={listing.imageUrls[0]}
                        alt={listing.name}
                        className="h-24 w-full sm:w-28 object-cover rounded-lg"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        className="text-slate-800 font-semibold hover:underline line-clamp-1"
                        to={`/listing/${listing._id}`}
                      >
                        {listing.name}
                      </Link>

                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                        {listing.description}
                      </p>

                      <p className="text-slate-700 font-semibold mt-2">
                        $
                        {listing.offer
                          ? listing.discountPrice?.toLocaleString("en-US")
                          : listing.regularPrice?.toLocaleString("en-US")}
                        {listing.type === "rent" && " / month"}
                      </p>
                    </div>

                    <div className="flex sm:flex-col gap-3 sm:items-end">
                      <Link
                        to={`/update-listing/${listing._id}`}
                        className="text-green-700 font-semibold uppercase text-sm hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleListingDelete(listing._id)}
                        className="text-red-700 font-semibold uppercase text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;