import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden border-t bg-white lg:block">
        <div className="mx-auto max-w-7xl px-12 py-20">
          <div className="grid grid-cols-4 gap-16">
            {/* Brand */}
            <div>
              <h2
                className="text-4xl"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                J.Rome
              </h2>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                Premium apparel inspired by confidence, culture, and timeless
                style.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em]">
                Shop
              </h3>

              <div className="space-y-3 text-gray-600">
                <Link className="block hover:text-black" to="/shop">
                  Shop All
                </Link>

                <Link
                  className="block hover:text-black"
                  to="/shop?category=Men"
                >
                  Men
                </Link>

                <Link
                  className="block hover:text-black"
                  to="/shop?category=Women"
                >
                  Women
                </Link>

                <Link
                  className="block hover:text-black"
                  to="/shop?category=Kids"
                >
                  Kids
                </Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em]">
                Company
              </h3>

              <div className="space-y-3 text-gray-600">
                <Link className="block hover:text-black" to="/about">
                  About
                </Link>

                <Link className="block hover:text-black" to="/policies">
                  Policies
                </Link>

                <button className="block hover:text-black">Newsletter</button>
              </div>
            </div>

            {/* Follow */}
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em]">
                Follow
              </h3>

              <div className="space-y-4">
                <a
                  href="https://instagram.com/jrome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-black"
                >
                  <RiInstagramFill size={18} />
                  Instagram
                </a>

                <button className="flex items-center gap-3 text-gray-600 hover:text-black">
                  <Mail size={18} />
                  Newsletter
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} J.Rome LLC. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Footer */}
      <footer className="border-t py-8 text-center text-xs text-gray-500 lg:hidden">
        © {new Date().getFullYear()} J.Rome LLC
      </footer>
    </>
  );
};

export default Footer;
