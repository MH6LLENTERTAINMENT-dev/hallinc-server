// server.js (CommonJS version for Render deployment)

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Enable CORS for your frontend (Base44 app)
app.use(cors({ origin: "*" }));

// ✅ Parse JSON
app.use(bodyParser.json());

// ✅ Basic health check
app.get("/", (req, res) => {
  res.send("✅ Hall Inc Server is running successfully!");
});

// ✅ Simulate user balances (you can connect a real DB later)
let userBalances = {};

// ✅ Give new users 2000 demo crypto
app.post("/api/register", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  if (!userBalances[userId]) {
    userBalances[userId] = 2000;
  }

  res.json({
    message: "User registered successfully",
    userId,
    balance: userBalances[userId],
  });
});

// ✅ Convert coins to crypto (simple mock conversion)
app.post("/api/convert", (req, res) => {
  const { userId, amount, rate } = req.body;
  if (!userId || !amount || !rate)
    return res.status(400).json({ error: "userId, amount, and rate required" });

  if (!userBalances[userId])
    return res.status(400).json({ error: "user not registered" });

  const cryptoAmount = amount * rate;
  userBalances[userId] += cryptoAmount;

  res.json({
    message: "Conversion successful",
    userId,
    newBalance: userBalances[userId],
    converted: cryptoAmount,
  });
});

// ✅ Mock Coinbase charge (since we can’t call backend commerce without Builder tier)
app.post("/api/coinbase-charge", (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ error: "Missing userId or amount" });
  }

  // Create a fake transaction ID
  const txId = crypto.randomBytes(8).toString("hex");

  res.json({
    success: true,
    message: "Mock Coinbase payment created",
    txId,
    amount,
  });
});

// ✅ Get user balance
app.get("/api/balance/:userId", (req, res) => {
  const userId = req.params.userId;
  const balance = userBalances[userId] || 0;

  res.json({
    userId,
    balance,
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Hall Inc Server running on port ${PORT}`);
});

Replace server.js with working backend (CommonJS)


