import useReceipts from "../hooks/useReceipts";
import { formatCurrency } from "../../../utils/currency";

const ReceiptSummaryCards = () => {
  const { data: receipts = [] } = useReceipts();

  const today = new Date().toDateString();

  const todaysReceipts = receipts.filter(
    (r) => new Date(r.createdAt).toDateString() === today,
  );

  const revenue = todaysReceipts.reduce(
    (sum, receipt) => sum + receipt.total,
    0,
  );

  const average =
    todaysReceipts.length > 0 ? revenue / todaysReceipts.length : 0;

  const cards = [
    {
      title: "Today's Receipts",
      value: todaysReceipts.length,
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(revenue),
    },
    {
      title: "Average Sale",
      value: formatCurrency(average),
    },
    {
      title: "Total Receipts",
      value: receipts.length,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">{card.title}</p>

          <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default ReceiptSummaryCards;
