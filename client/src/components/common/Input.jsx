const Input = ({ placeholder, value, onChange }) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default Input;
