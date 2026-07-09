const ResponsiveDrawer = ({ open, onClose, width = "420px", children }) => {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <div
        className={`
          fixed right-0 top-0 z-50
          h-full w-full
          bg-white shadow-2xl
          transition-transform duration-300

          lg:static
          lg:translate-x-0

          ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
        style={{
          maxWidth: width,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default ResponsiveDrawer;
