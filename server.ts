import express from "express";
import path from "path";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Razorpay initialization
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/payments/order", async (req, res) => {
    const { amount, currency = "INR", receipt } = req.body;
    try {
      const order = await razorpay.orders.create({
        amount: amount * 100, // amount in paise
        currency,
        receipt,
      });
      res.json(order);
    } catch (error) {
      console.error("Razorpay Order Error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.post("/api/payments/verify", async (req, res) => {
    // In a real app, you'd verify the signature here
    // For this demo, we'll assume success if the payment_id is present
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    res.json({ status: "success", message: "Payment verified" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
