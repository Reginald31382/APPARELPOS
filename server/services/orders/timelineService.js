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
