const money = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export const receiptTemplate = (order) => {
  const customer =
    order.shippingAddress?.firstName && order.shippingAddress?.lastName
      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
      : "Valued Customer";

  const items = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;">
          <strong>${item.name}</strong><br/>
          <span style="color:#666;font-size:13px;">
            ${item.color || ""} ${item.size || ""}
          </span>
        </td>

        <td align="center">${item.quantity}</td>

        <td align="right">${money(item.unitPrice)}</td>

        <td align="right">${money(item.quantity * item.unitPrice)}</td>
      </tr>
    `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>

<title>Receipt</title>

</head>

<body style="margin:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="40">

<tr>

<td align="center">

<table
width="650"
style="
background:#ffffff;
border-radius:10px;
overflow:hidden;
">

<tr>

<td
style="
background:#000;
color:white;
padding:30px;
text-align:center;
">

<h1 style="margin:0;">
J.Rome Apparel
</h1>

<p style="margin-top:10px;">
Thank you for your purchase!
</p>

</td>

</tr>

<tr>

<td style="padding:35px;">

<p>Hello <strong>${customer}</strong>,</p>

<p>
We've received your order and your payment has been successfully processed.
</p>

<hr/>

<h3>
Order #${order.orderNumber}
</h3>

<p>
${new Date(order.createdAt).toLocaleString()}
</p>

<table width="100%" cellspacing="0">

<thead>

<tr>

<th align="left">Item</th>

<th>Qty</th>

<th align="right">Price</th>

<th align="right">Total</th>

</tr>

</thead>

<tbody>

${items}

</tbody>

</table>

<hr/>

<table width="100%">

<tr>

<td>Subtotal</td>

<td align="right">
${money(order.subtotal)}
</td>

</tr>

<tr>

<td>Tax</td>

<td align="right">
${money(order.tax)}
</td>

</tr>

<tr>

<td>Shipping</td>

<td align="right">
${money(order.shipping?.cost || 0)}
</td>

</tr>

<tr>

<td style="padding-top:15px;">
<strong>Total</strong>
</td>

<td align="right" style="padding-top:15px;">
<strong>${money(order.total)}</strong>
</td>

</tr>

</table>

<hr/>

<p>
Payment Method:
<strong>${order.paymentMethod}</strong>
</p>

<p>
Status:
<strong>${order.status}</strong>
</p>

</td>

</tr>

<tr>

<td
style="
background:#fafafa;
padding:25px;
text-align:center;
color:#777;
">

Thank you for shopping with
<strong>J.Rome Apparel</strong>

<br/><br/>

<a href="https://www.jrome-studios.com">
Visit Our Store
</a>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
};
