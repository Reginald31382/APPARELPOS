import { STORE_CONFIG } from "../../config/storeConfig";

const messages = [
  `FREE SHIPPING ON ORDERS OVER $${STORE_CONFIG.FREE_SHIPPING_THRESHOLD}`,
  "PREMIUM QUALITY",
  "SECURE CHECKOUT",
  "ORDERS TYPICALLY SHIP IN 1-3 BUSINESS DAYS",
  "SHOP THE COLLECTION",
];

const AnnouncementBar = () => {
  const items = [...messages, ...messages];

  return (
    <div className="overflow-hidden bg-black py-2.5 text-white">
      <div className="announcement-track flex w-max">
        {items.map((message, index) => (
          <div
            key={index}
            className="mx-8 flex items-center whitespace-nowrap text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.3em]"
          >
            {message}
            <span className="ml-8 text-white/40"> • </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
