const DashboardCard = ({
  title,
  value,
  icon,
  color = "bg-blue-50 text-blue-600",
  subtitle,
}) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>

          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
