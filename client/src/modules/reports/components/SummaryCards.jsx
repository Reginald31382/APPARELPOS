import { formatCurrency } from "../../../utils/currency";

const SummaryCards = ({ data = {} }) => {
  const cards = [
    {
      title: "Revenue",
      value: formatCurrency(data.revenue ?? 0),
      accent: "text-green-600",
    },
    {
      title: "Orders",
      value: data.orders ?? 0,
      accent: "text-blue-600",
    },
    {
      title: "Tax Collected",
      value: formatCurrency(data.tax ?? 0),
      accent: "text-purple-600",
    },
    {
      title: "Average Order",
      value: formatCurrency(data.averageOrder ?? 0),
      accent: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 lg:p-6"
        >
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            {card.title}
          </p>

          <h2
            className={`mt-2 break-words text-xl font-bold sm:text-2xl lg:text-3xl ${card.accent}`}
          >
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
