export function addTimelineEvent(order, title, description = "") {
  if (!order.timeline) {
    order.timeline = [];
  }

  order.timeline.push({
    title,
    description,
    createdAt: new Date(),
  });
}

export function hasTimelineEvent(order, title) {
  return order.timeline?.some((event) => event.title === title);
}
