import clsx from "clsx";

const Button = ({
  children,
  onClick,
  className,
  variant = "primary",
  type = "button",
}) => {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "rounded-lg px-5 py-2 font-semibold transition duration-200",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
