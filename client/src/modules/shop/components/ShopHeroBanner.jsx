import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Hero1 from "../../../assets/images/jrome_skyline.png";
import Hero2 from "../../../assets/images/jrome_skyline_whypipo.png";
import Hero3 from "../../../assets/images/jrome_skyline_latin.png";
// import Hero4 from "../../../assets/images/fouramigos.png";

const slides = [Hero1, Hero2, Hero3];

const ShopHeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative mb-10 h-[290px] overflow-hidden rounded-3xl sm:h-[340px] lg:h-[420px]">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slides[current]}
          alt="J.Rome Collection"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 8, ease: "easeInOut" },
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
      {/* 
      <div className="absolute top-8 left-8 z-10">
        <p className="text-xs font-medium uppercase tracking-[0.45em] text-white">
          SHOP RESPONSIBLY
        </p>
      </div> */}
    </section>
  );
};

export default ShopHeroBanner;
