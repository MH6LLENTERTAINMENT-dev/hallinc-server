const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// 🎯 SIMPLE TEST ROUTE
app.get("/", (req, res) => {
  res.json({ 
    message: "🎉 Hall Inc Sports Arena is LIVE!",
    status: "ready for CoinGate, Lasso, Rakuten"
  });
});

// 💰 USER BALANCE
app.get("/api/balance/:userId", (req, res) => {
  res.json({
    userId: req.params.userId,
    coins: 10000,
    BTC: 0.00025
  });
});

// 🎁 REWARD REDEMPTION
app.post("/api/redeem", (req, res) => {
  const { userId, coinAmount, rewardType } = req.body;
  
  res.json({
    success: true,
    message: `Redeemed ${coinAmount} coins for ${rewardType}!`,
    transaction: "tx_" + Date.now()
  });
});

// 🚀 START SERVER
app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});






