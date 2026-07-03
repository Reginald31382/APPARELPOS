const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-xl bg-white shadow-md border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
