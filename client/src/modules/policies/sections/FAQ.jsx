import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What material are your shirts made from?",
    answer:
      "Most J.Rome apparel is made from premium 100% cotton for maximum comfort, breathability, and durability. Material details are listed on each product page.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are typically processed within 1–3 business days. Delivery times depend on your selected shipping method and destination.",
  },
  {
    question: "Do you accept returns?",
    answer:
      "We currently offer exchanges within 30 days for eligible items. Please visit our Exchange Policy for complete details.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive an email with tracking information. You can also use the Order Tracking page on our website.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "If your order has not yet shipped, contact us as soon as possible and we'll do our best to help.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Email us anytime at jromestudios1@gmail.com and we'll respond as quickly as possible.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-10 text-3xl font-bold">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-2xl border">
            <button
              onClick={() => setOpen(open === index ? null : index)}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <span className="font-semibold">{faq.question}</span>

              <ChevronDown
                className={`transition ${open === index ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                open === index ? "max-h-60 px-6 pb-6" : "max-h-0"
              }`}
            >
              <p className="leading-7 text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
