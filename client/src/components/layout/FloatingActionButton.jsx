const FloatingActionButton = ({ onClick, children, badge }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-105 lg:hidden"
    >
      {children}

      {badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
          {badge}
        </span>
      )}
    </button>
  );
};

export default FloatingActionButton;
