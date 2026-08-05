import { STORE_CONFIG } from "../../config/storeConfig";
import { useEffect, useState } from "react";

const messages = [
  `FREE SHIPPING ON ORDERS OVER $${STORE_CONFIG.FREE_SHIPPING_THRESHOLD}`,
  "NEW SUMMER COLLECTION AVAILABLE NOW",
  "MADE FOR DETROIT. WORN EVERYWHERE.",
  "PREMIUM QUALITY • EVERYDAY ESSENTIALS",
  "BUY NOW • PAY LATER AVAILABLE",
  "100% COTTON • BECAUSE IT MATTERS",
  "THANK YOU FOR SHOPPING WITH US!",
];

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, STORE_CONFIG.ANNOUNCEMENT_ROTATION_SPEED);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 overflow-hidden bg-black px-3 text-white">
      <div
        className="flex h-full items-center justify-center transition-all duration-500"
        key={index}
      >
        <p className="truncate text-center text-[10px] font-medium uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.35em]">
          {messages[index]}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
