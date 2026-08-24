import SEO from "../components/SEO";
import { Mail, MapPin } from "lucide-react";
import { RiInstagramFill } from "react-icons/ri";

const Contact = () => {
  return (
    <>
      <SEO
        title="About J.Rome Studios"
        description="Learn about J.Rome Studios, an urban apparel and streetwear brand built around creativity, culture, individuality, and expressive fashion."
        path="/about"
      />
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-12">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
              CONTACT
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              We'd Love to Hear From You
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Whether you have a question about an order, sizing, exchanges, or
              just want to connect, we're here to help.
            </p>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="flex gap-4">
                <Mail className="mt-1" />

                <div>
                  <h2 className="font-semibold">Email</h2>

                  <a
                    href="mailto:jromestudios1@gmail.com"
                    className="text-gray-600 hover:text-black"
                  >
                    jromestudios1@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <RiInstagramFill className="mt-1" />

                <div>
                  <h2 className="font-semibold">Instagram</h2>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 hover:text-black"
                  >
                    @jrome
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="mt-1" />

                <div>
                  <h2 className="font-semibold">Location</h2>

                  <p className="text-gray-600">
                    Proudly based in Michigan, USA.
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />

              <textarea
                rows={6}
                placeholder="How can we help?"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-neutral-800"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
