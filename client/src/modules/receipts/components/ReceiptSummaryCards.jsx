import useReceipts from "../hooks/useReceipts";
import { formatCurrency } from "../../../utils/currency";

const ReceiptSummaryCards = () => {
  const { data: receipts = [] } = useReceipts();

  const today = new Date().toDateString();

  const todaysReceipts = receipts.filter(
    (receipt) => new Date(receipt.createdAt).toDateString() === today,
  );

  const revenue = todaysReceipts.reduce(
    (sum, receipt) => sum + (Number(receipt.total) || 0),
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
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="min-w-0 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 lg:p-6"
        >
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            {card.title}
          </p>

          <h2 className="mt-2 break-words text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default ReceiptSummaryCards;
