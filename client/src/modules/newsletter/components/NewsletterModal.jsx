import { X } from "lucide-react";

const NewsletterModal = ({ open, onClose }) => {
  if (!open) return null;

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
            type="email"
            placeholder="Email Address"
            className="mb-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          />

          <button className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-neutral-800">
            Subscribe
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
