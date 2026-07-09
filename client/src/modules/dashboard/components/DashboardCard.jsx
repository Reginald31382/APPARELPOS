const DashboardCard = ({ title, value }) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>

      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;
