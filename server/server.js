import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./services/socketService.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

import productRoutes from "./routes/products.js";
import customerRoutes from "./routes/customers.js";
import orderRoutes from "./routes/orders.js";
import inventoryRoutes from "./routes/inventory.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportRoutes from "./routes/reports.js";
import settingsRoutes from "./routes/settings.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import refundRoutes from "./routes/refund.js";
import shippingRoutes from "./routes/shipping.js";
import paymentRoutes from "./routes/payment.js";

import stripeRoutes from "./routes/stripe.js";

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

initializeSocket(io);

io.on("connection", (socket) => {
  console.log(`🟢 Admin Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔴 Admin Disconnected: ${socket.id}`);
  });
});

app.use(cors());

// Stripe webhook MUST receive the raw request body
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeRoutes,
);

// Everything else uses JSON
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/refunds", refundRoutes);

// app.post("/test", (req, res) => {
//   console.log("TEST BODY:", req.body);

//   res.json({
//     body: req.body,
//   });
// });

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Apparel POS API Running",
  });
});

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
