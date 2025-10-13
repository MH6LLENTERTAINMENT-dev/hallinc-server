// server.js
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle raw body (Coinbase Commerce requires this)
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// === ROUTES ===

// 1️⃣ Test route to make sure server works
app.get("/", (req, res) => {
  res.send("✅ Hall Inc Server is running!");
});

// 2️⃣ Status route for Render health check
app.get("/status", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// 3️⃣ Coinbase Commerce webhook handler
app.post("/webhook", (req, res) => {
  try {
    const signature = req.headers["x-cc-webhook-signature"];
    const secret = process.env.COINBASE_WEBHOOK_SECRET;

    if (!secret) {
      console.error("❌ Missing COINBASE_WEBHOOK_SECRET environment variable");
      return res.status(500).send("Server misconfigured");
    }

    // Verify Coinbase signature
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    if (hmac !== signature) {
      console.warn("⚠️ Invalid Coinbase signature detected");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;

    // Log and handle events (like payment confirmations)
    console.log("💰 Coinbase event:", event.event.type);

    if (event.event.type === "charge:confirmed") {
      console.log("✅ Payment confirmed!");
      // TODO: Credit user's balance in your database here
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Error processing webhook");
  }
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
