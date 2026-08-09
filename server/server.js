import helmet from "helmet";
import http from "http";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import { Server } from "socket.io";
import { initializeSocket } from "./services/socketService.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import "./config/validateEnv.js";
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
import storeRoutes from "./routes/store.js";
import notificationRoutes from "./routes/notifications.js";
import reviewRoutes from "./routes/review.js";
import receiptRoutes from "./routes/receipts.js";
import newsletterRoutes from "./routes/newsletter.js";

import stripeRoutes from "./routes/stripe.js";

connectDB();

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  },
});

initializeSocket(io);

io.on("connection", (socket) => {
  // console.log(`🟢 Admin Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    // console.log(`🔴 Admin Disconnected: ${socket.id}`);
  });
});

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],

    credentials: true,
  }),
);
// Stripe webhook MUST receive the raw request body
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeRoutes,
);

// Shipping webhook logging
app.use((req, res, next) => {
  if (req.path.includes("/shipping/webhook")) {
  }

  next();
});

app.use(express.json());

// app.use(mongoSanitize());
// app.use(xss());
app.use(compression());

app.use("/api", apiLimiter);

app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/newsletter", newsletterRoutes);

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
  // console.log(`Server running on ${PORT}`);
});
