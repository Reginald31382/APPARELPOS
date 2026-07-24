const messages = [
  "Premium Apparel",
  "Free Shipping on Orders $75+",
  "New Arrivals Every Week",
  "Veteran Owned",
  "Quality You Can Trust",
];

const TextCarousel = () => {
  const items = [...messages, ...messages];

  return (
    <div className="relative overflow-hidden whitespace-nowrap">
      <div className="flex animate-text-scroll">
        {items.map((message, index) => (
          <div key={index} className="mx-6 flex shrink-0 items-center gap-6">
            <span className="text-sm font-medium uppercase tracking-wider text-white">
              {message}
            </span>

            <span className="text-gray-300">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextCarousel;
