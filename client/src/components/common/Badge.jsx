const Badge = ({ children }) => {
  return (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
      {children}
    </span>
  );
};

export default Badge;
