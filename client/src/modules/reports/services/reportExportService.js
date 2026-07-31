import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/*
|--------------------------------------------------------------------------
| CSV Export
|--------------------------------------------------------------------------
*/

export const exportCSV = (report) => {
  const { filters, summary, orders } = report;

  const rows = orders?.recentOrders ?? [];

  const csv = [];

  csv.push(["J.Rome POS Sales Report"]);
  csv.push([]);

  csv.push(["Report Range", filters.range]);
  csv.push(["Generated", new Date().toLocaleString()]);
  csv.push([]);

  csv.push(["Revenue", summary.revenue]);
  csv.push(["Orders", summary.orders]);
  csv.push(["Average Order", summary.averageOrder]);
  csv.push(["Tax", summary.tax]);
  csv.push([]);

  csv.push(["Order", "Date", "Payment", "Status", "Total"]);

  rows.forEach((order) => {
    csv.push([
      order._id,
      new Date(order.createdAt).toLocaleDateString(),
      order.paymentMethod,
      order.status,
      order.total.toFixed(2),
    ]);
  });

  const csvContent = csv.map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `sales-report-${Date.now()}.csv`;

  link.click();

  URL.revokeObjectURL(url);
};

/*
|--------------------------------------------------------------------------
| Excel Export
|--------------------------------------------------------------------------
*/

export const exportExcel = async (report) => {
  const { filters, summary, orders, inventory } = report;

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "J.Rome POS";
  workbook.created = new Date();

  /*
  |--------------------------------------------------------------------------
  | Summary Sheet
  |--------------------------------------------------------------------------
  */

  const summarySheet = workbook.addWorksheet("Summary");

  summarySheet.columns = [{ width: 30 }, { width: 25 }];

  summarySheet.addRow(["J.Rome POS Sales Report"]);
  summarySheet.addRow([]);
  summarySheet.addRow(["Generated", new Date().toLocaleString()]);
  summarySheet.addRow(["Report Range", filters.range]);
  summarySheet.addRow([]);
  summarySheet.addRow(["Revenue", summary.revenue]);
  summarySheet.addRow(["Orders", summary.orders]);
  summarySheet.addRow(["Average Order", summary.averageOrder]);
  summarySheet.addRow(["Tax", summary.tax]);

  summarySheet.getRow(1).font = {
    bold: true,
    size: 18,
  };

  /*
  |--------------------------------------------------------------------------
  | Orders Sheet
  |--------------------------------------------------------------------------
  */

  const ordersSheet = workbook.addWorksheet("Orders");

  ordersSheet.columns = [
    { header: "Order", key: "order", width: 35 },
    { header: "Date", key: "date", width: 20 },
    { header: "Payment", key: "payment", width: 18 },
    { header: "Status", key: "status", width: 18 },
    { header: "Total", key: "total", width: 15 },
  ];

  ordersSheet.getRow(1).font = {
    bold: true,
  };

  (orders?.recentOrders ?? []).forEach((order) => {
    ordersSheet.addRow({
      order: order._id,
      date: new Date(order.createdAt).toLocaleDateString(),
      payment: order.paymentMethod,
      status: order.status,
      total: order.total,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Inventory Sheet
  |--------------------------------------------------------------------------
  */

  const inventorySheet = workbook.addWorksheet("Low Inventory");

  inventorySheet.columns = [
    { header: "Product", key: "name", width: 35 },
    { header: "Variant", key: "variant", width: 20 },
    { header: "Quantity", key: "quantity", width: 15 },
  ];

  inventorySheet.getRow(1).font = {
    bold: true,
  };

  (inventory?.lowInventory ?? []).forEach((product) => {
    product.variants.forEach((variant) => {
      inventorySheet.addRow({
        name: product.name,
        variant: variant.size || variant.color || "Default",
        quantity: variant.quantity,
      });
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Download
  |--------------------------------------------------------------------------
  */

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer]);

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `sales-report-${Date.now()}.xlsx`;

  link.click();

  URL.revokeObjectURL(url);
};

/*
|--------------------------------------------------------------------------
| PDF Export
|--------------------------------------------------------------------------
*/

export const exportPDF = (report) => {
  const { filters, summary, orders } = report;

  const doc = new jsPDF();

  let y = 18;

  // ------------------------------------------------------------------
  // Header
  // ------------------------------------------------------------------

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("J.Rome POS", 14, y);

  y += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Sales Report", 14, y);

  y += 8;

  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);

  y += 6;

  doc.text(`Report Range: ${filters.range}`, 14, y);

  y += 12;

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Executive Summary", 14, y);

  y += 8;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Metric", "Value"]],
    body: [
      ["Revenue", `$${summary.revenue.toFixed(2)}`],
      ["Orders", summary.orders],
      ["Average Order", `$${summary.averageOrder.toFixed(2)}`],
      ["Tax Collected", `$${summary.tax.toFixed(2)}`],
    ],
    styles: {
      fontSize: 11,
    },
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  y = doc.lastAutoTable.finalY + 15;

  // ------------------------------------------------------------------
  // Recent Orders
  // ------------------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Recent Orders", 14, y);

  autoTable(doc, {
    startY: y + 5,
    head: [["Order", "Date", "Payment", "Status", "Total"]],
    body: (orders?.recentOrders ?? []).map((order) => [
      order._id.slice(-6),
      new Date(order.createdAt).toLocaleDateString(),
      order.paymentMethod,
      order.status,
      `$${order.total.toFixed(2)}`,
    ]),
    headStyles: {
      fillColor: [37, 99, 235],
    },
    styles: {
      fontSize: 10,
    },
  });

  // ------------------------------------------------------------------
  // Footer
  // ------------------------------------------------------------------

  const pageHeight = doc.internal.pageSize.height;

  doc.setDrawColor(180);
  doc.line(14, pageHeight - 18, 196, pageHeight - 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");

  doc.text("Generated by J.Rome POS Reporting", 14, pageHeight - 10);

  doc.save(`sales-report-${Date.now()}.pdf`);
};
