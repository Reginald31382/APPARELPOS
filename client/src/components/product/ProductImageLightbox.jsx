import { useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ProductImageLightbox = ({
  isOpen,
  onClose,
  images = [],
  selectedImage,
  onSelect,
}) => {
  const currentIndex = images.findIndex((image) => image === selectedImage);

  const nextImage = () => {
    const next = (currentIndex + 1) % images.length;
    onSelect(images[next]);
  };

  const previousImage = () => {
    const previous = (currentIndex - 1 + images.length) % images.length;

    onSelect(images[previous]);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();

      if (e.key === "ArrowRight") nextImage();

      if (e.key === "ArrowLeft") previousImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, selectedImage]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-8"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 text-white"
      >
        <IoClose size={34} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              previousImage();
            }}
            className="absolute left-8 text-white"
          >
            <FaChevronLeft size={42} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-8 text-white"
          >
            <FaChevronRight size={42} />
          </button>
        </>
      )}

      <img
        src={selectedImage || images[0]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(image);
              }}
              className={`overflow-hidden rounded border-2 ${
                image === selectedImage ? "border-white" : "border-transparent"
              }`}
            >
              <img src={image} alt="" className="h-16 w-16 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageLightbox;
