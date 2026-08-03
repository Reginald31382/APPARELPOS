export function determineShippingService(items, store) {
  const rules = store.shippingRules;

  const totalWeightLbs = items.reduce((total, item) => {
    return total + Number(item.weight || 0) * item.quantity;
  }, 0);

  const totalWeightOz = totalWeightLbs * 16;

  // console.log(
  //   `Package Weight: ${totalWeightLbs.toFixed(2)} lb (${totalWeightOz.toFixed(2)} oz)`,
  // );

  if (totalWeightOz <= rules.lightweightMaxOz) {
    return {
      carrier: rules.defaultCarrier,
      service: rules.lightweightService,
      totalWeightOz,
    };
  }

  return {
    carrier: rules.defaultCarrier,
    service: rules.heavyweightService,
    totalWeightOz,
  };
}
