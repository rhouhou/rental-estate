import { useEffect, useMemo, useState } from "react";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const landlordId =
    typeof listing?.userRef === "object" ? listing.userRef?._id : listing?.userRef;

  useEffect(() => {
    const fetchLandlord = async () => {
      if (!landlordId) {
        setError("Could not find the listing owner.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/user/${landlordId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setError(data.message || "Could not load contact information.");
          return;
        }

        setLandlord(data);
      } catch (error) {
        setError(error.message || "Could not load contact information.");
      } finally {
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [landlordId]);

  const mailtoLink = useMemo(() => {
    if (!landlord?.email || !listing?.name) {
      return "#";
    }

    const subject = encodeURIComponent(`Regarding ${listing.name}`);
    const body = encodeURIComponent(
      message ||
        `Hi ${landlord.username}, I am interested in "${listing.name}". Please send me more information.`
    );

    return `mailto:${landlord.email}?subject=${subject}&body=${body}`;
  }, [landlord, listing, message]);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      {loading && (
        <p className="text-slate-500 text-sm">Loading contact details...</p>
      )}

      {error && <p className="text-red-700 text-sm">{error}</p>}

      {!loading && !error && landlord && (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-slate-700">
              Contact{" "}
              <span className="font-semibold text-slate-900">
                {landlord.username}
              </span>
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Ask about{" "}
              <span className="font-semibold">{listing.name}</span>
            </p>
          </div>

          <textarea
            name="message"
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
          />

          <a
            href={mailtoLink}
            className="bg-slate-900 text-white text-center p-3 uppercase rounded-lg font-semibold hover:opacity-95"
          >
            Send Message
          </a>
        </div>
      )}
    </div>
  );
};

export default Contact;