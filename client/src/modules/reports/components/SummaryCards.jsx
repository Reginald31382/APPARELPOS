import { formatCurrency } from "../../../utils/currency";

const SummaryCards = ({ data }) => {
  const cards = [
    {
      title: "Revenue",
      value: formatCurrency(data.revenue ?? 0),
    },
    {
      title: "Orders",
      value: data.orders ?? 0,
    },
    {
      title: "Tax Collected",
      value: formatCurrency(data.tax ?? 0),
    },
    {
      title: "Average Order",
      value: formatCurrency(data.averageOrder ?? 0),
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-gray-500">{card.title}</p>

          <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
