import { useState } from "react";

import Privacy from "./sections/Privacy";
import Refund from "./sections/Refund";
import Terms from "./sections/Terms";
import Shipping from "./sections/Shipping";
import Cookies from "./sections/Cookies";
import FAQ from "./sections/FAQ";

const tabs = [
  {
    id: "privacy",
    label: "Privacy",
  },
  {
    id: "refund",
    label: "Exchanges",
  },
  {
    id: "terms",
    label: "Terms",
  },
  {
    id: "shipping",
    label: "Shipping",
  },
  {
    id: "cookies",
    label: "Cookies",
  },
  {
    id: "faq",
    label: "FAQ",
  },
];

const Policies = () => {
  const [activeTab, setActiveTab] = useState("privacy");

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
      <div className="mx-auto max-w-6xl px-6 py-20">
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

        {/* Navigation */}

        <div className="scrollbar-hide mt-14 overflow-x-auto">
          <div className="flex w-max gap-3 pb-2">
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
        </div>

        {/* Selected Policy */}

        <div className="mt-16">{renderContent()}</div>
      </div>
    </section>
  );
};

export default Policies;
