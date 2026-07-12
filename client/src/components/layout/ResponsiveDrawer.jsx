const ResponsiveDrawer = ({ open, onClose, width = "500px", children }) => {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed right-0 top-0 z-50
          flex h-full flex-col
          bg-white shadow-2xl
          transition-transform duration-300 ease-in-out

          w-full
          sm:max-w-[500px]

          ${open ? "translate-x-0" : "translate-x-full"}
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
