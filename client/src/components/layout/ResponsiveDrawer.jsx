const ResponsiveDrawer = ({ open, onClose, width = "500px", children }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`
          fixed right-0 top-0 z-50
          flex h-dvh max-h-dvh flex-col
          bg-white shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        style={{
          width: "100%",
          maxWidth: `min(${width}, 100vw)`,
          visibility: open ? "visible" : "hidden",
        }}
      >
        {children}
      </aside>
    </>
  );
};

export default ResponsiveDrawer;
