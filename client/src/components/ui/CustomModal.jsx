import { X, Mail } from "lucide-react";
import { Phone } from "lucide-react";
import useContactStore from "../../store/ui/useContactStore";

const CustomModal = () => {
  const isOpen = useContactStore((state) => state.isOpen);
  const closeModal = useContactStore((state) => state.closeModal);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-5 top-5 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Custom Orders
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Interested in creating something custom with J.Rome Studios? Get in
            touch with us to discuss your ideas.
          </p>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          {/* Email */}
          <a
            href="mailto:your@email.com"
            className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 transition hover:bg-gray-50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <Mail size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Email
              </p>

              <p className="text-sm font-medium text-gray-900">
                jromestudios1@gmail.com
              </p>
            </div>
          </a>
          ```jsx
          {/* Phone */}
          <a
            href="tel:+13134741286"
            className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 transition hover:bg-gray-50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <Phone size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Phone
              </p>

              <p className="text-sm font-medium text-gray-900">313-474-1286</p>
            </div>
          </a>
          ```
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={closeModal}
          className="mt-7 w-full rounded-full bg-black py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomModal;
