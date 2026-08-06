import { useEffect, useState } from "react";

import Privacy from "./sections/Privacy";
import Refund from "./sections/Refund";
import Terms from "./sections/Terms";
import Shipping from "./sections/Shipping";
import Cookies from "./sections/Cookies";
import FAQ from "./sections/FAQ";

const tabs = [
  { id: "privacy", label: "Privacy" },
  { id: "refund", label: "Exchanges" },
  { id: "terms", label: "Terms" },
  { id: "shipping", label: "Shipping" },
  { id: "cookies", label: "Cookies" },
  { id: "faq", label: "FAQ" },
];

const Policies = () => {
  const [activeTab, setActiveTab] = useState("privacy");
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "privacy":
        return <Privacy />;

      case "refund":
        return <Refund />;

      case "terms":
        return <Terms />;

      case "shipping":
        return <Shipping />;

      case "cookies":
        return <Cookies />;

      case "faq":
        return <FAQ />;

      default:
        return <Privacy />;
    }
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
            HELP CENTER
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Policies & Information
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            Everything you need to know before and after your purchase.
          </p>
        </div>

        {/* Desktop Navigation */}

        {!mobile && (
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full border px-6 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Navigation */}

        {mobile && (
          <div className="mt-10">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Select Policy
            </label>

            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full rounded-xl border bg-white p-4 text-base"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-12 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default Policies;
