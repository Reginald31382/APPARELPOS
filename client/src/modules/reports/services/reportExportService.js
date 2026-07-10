import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/*
|--------------------------------------------------------------------------
| CSV Export
|--------------------------------------------------------------------------
*/

export const exportCSV = (orders) => {
  const headers = ["Order", "Date", "Payment", "Status", "Total"];

  const rows = orders.map((order) => [
    order._id,
    new Date(order.createdAt).toLocaleDateString(),
    order.paymentMethod,
    order.status,
    order.total.toFixed(2),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "sales-report.csv";

  link.click();

  URL.revokeObjectURL(url);
};

/*
|--------------------------------------------------------------------------
| Excel Export
|--------------------------------------------------------------------------
*/

export const exportExcel = async (orders) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Sales Report");

  worksheet.columns = [
    { header: "Order", key: "order", width: 35 },
    { header: "Date", key: "date", width: 20 },
    { header: "Payment", key: "payment", width: 15 },
    { header: "Status", key: "status", width: 15 },
    { header: "Total", key: "total", width: 15 },
  ];

  orders.forEach((order) => {
    worksheet.addRow({
      order: order._id,
      date: new Date(order.createdAt).toLocaleDateString(),
      payment: order.paymentMethod,
      status: order.status,
      total: order.total,
    });
  });

  worksheet.getRow(1).font = {
    bold: true,
  };

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer]);

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "sales-report.xlsx";

  link.click();

  URL.revokeObjectURL(url);
};

/*
|--------------------------------------------------------------------------
| PDF Export
|--------------------------------------------------------------------------
*/

export const exportPDF = (orders) => {
  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("J.Rome POS Sales Report", 14, 18);

  autoTable(doc, {
    startY: 30,

    head: [["Order", "Date", "Payment", "Status", "Total"]],

    body: orders.map((order) => [
      order._id.slice(-6),
      new Date(order.createdAt).toLocaleDateString(),
      order.paymentMethod,
      order.status,
      `$${order.total.toFixed(2)}`,
    ]),
  });

  doc.save("sales-report.pdf");
};
