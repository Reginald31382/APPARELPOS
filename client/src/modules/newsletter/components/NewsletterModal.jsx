import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const NewsletterModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const subscribe = async () => {
    const subscribe = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        return toast.error("Please enter a valid email.");
      }

      try {
        setLoading(true);

        const { data } = await api.post("/newsletter", {
          email: email.trim().toLowerCase(),
        });

        toast.success(data.message);

        setEmail("");

        onClose();
      } catch (err) {
        toast.error(err.response?.data?.message ?? "Unable to subscribe.");
      } finally {
        setLoading(false);
      }
    };

    try {
      setLoading(true);

      await api.post("/newsletter", {
        email,
      });

      toast.success("Welcome to the J.Rome newsletter!");
      setEmail("");

      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Join J.Rome</h2>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <p className="mb-6 leading-7 text-gray-600">
            Be the first to know about new collections, exclusive releases, and
            special offers.
          </p>

          <input
            ref={inputRef}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                subscribe();
              }
            }}
            className="mb-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          />

          <button
            onClick={subscribe}
            disabled={!email.trim() || loading}
            className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>

          <p className="mt-5 text-center text-xs text-gray-500">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </>
  );
};

export default NewsletterModal;
