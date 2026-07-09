const PageContainer = ({ title, children }) => {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {title && <h1 className="text-3xl font-bold">{title}</h1>}

      {children}
    </div>
  );
};

export default PageContainer;
