const DashboardCard = ({
  title,
  value,
  icon,
  color = "bg-blue-50 text-blue-600",
  subtitle,
}) => {
  return (
    <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-medium text-gray-500 sm:text-sm">
            {title}
          </h3>

          <p className="mt-2 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 ${color}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
