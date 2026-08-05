export const groupInventoryHistory = (history) => {
  return history.reduce((groups, item) => {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(item);

    return groups;
  }, {});
};
