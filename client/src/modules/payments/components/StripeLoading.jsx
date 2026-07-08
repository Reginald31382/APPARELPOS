const StripeLoading = () => {
  return (
    <div className="rounded-lg border bg-blue-50 p-6 text-center">
      <h3 className="text-lg font-semibold">Preparing Secure Payment...</h3>

      <p className="mt-2 text-sm text-gray-600">Connecting to Stripe.</p>
    </div>
  );
};

export default StripeLoading;
