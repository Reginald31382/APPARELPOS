import useStore from "../../settings/hooks/useStore";
import useUpdateStore from "../../settings/hooks/useUpdateStore";
import { useState, useEffect } from "react";

const ShippingRules = () => {
  const { data: store } = useStore();
  const updateStore = useUpdateStore();

  const [rules, setRules] = useState({
    freeShippingThreshold: 150,
    lightweightMaxOz: 16,
    defaultCarrier: "USPS",
    lightweightService: "Ground Advantage",
    heavyweightService: "Priority Mail",
    expressService: "Priority Mail Express",
  });

  useEffect(() => {
    if (!store) return;

    setRules(
      store.shippingRules ?? {
        freeShippingThreshold: 150,
        lightweightMaxOz: 16,
        defaultCarrier: "USPS",
        lightweightService: "Ground Advantage",
        heavyweightService: "Priority Mail",
        expressService: "Priority Mail Express",
      },
    );
  }, [store]);

  const save = () => {
    updateStore.mutate({
      ...store,
      shippingRules: rules,
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Shipping Rules</h1>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-lg">Free Shipping</h2>

        <input
          type="number"
          value={rules.freeShippingThreshold}
          onChange={(e) =>
            setRules({
              ...rules,

              freeShippingThreshold: Number(e.target.value),
            })
          }
          className="mt-4 border rounded-lg p-3"
        />
      </div>

      <button
        onClick={save}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Save Rules
      </button>
    </div>
  );
};

export default ShippingRules;
