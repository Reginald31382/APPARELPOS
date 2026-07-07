const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

      <p className="mt-4 text-sm text-gray-500">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
