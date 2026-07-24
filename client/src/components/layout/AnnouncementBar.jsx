import { useEffect, useState } from "react";

const messages = [
  "FREE SHIPPING ON ORDERS OVER $100",
  "NEW SUMMER COLLECTION AVAILABLE NOW",
  "MADE FOR DETROIT. WORN EVERYWHERE.",
  "PREMIUM QUALITY • EVERYDAY ESSENTIALS",
  "BUY NOW • PAY LATER AVAILABLE",
];

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 overflow-hidden bg-black text-white">
      <div
        className="flex h-full items-center justify-center transition-all duration-500"
        key={index}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.35em]">
          {messages[index]}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
