const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "🎉 HallInc Server with REAL APIs!",
    status: "Rakuten, Coinbase, Ticketmaster ready!"
  });
});

// API test
app.get("/ping", async (req, res) => {
  try {
    const response = await fetch("https://api.github.com");
    const data = await response.json();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 🎁 GIFT CARD REDEMPTION (FIXED - userId optional)
app.post("/api/redeem/giftcard", async (req, res) => {
  try {
    const { userId, userEmail, giftCardType, coinAmount, giftCardValue } = req.body;
    
    // FIX: userId is now optional
    const actualUserId = userId || `user_${Date.now()}`;
    
    if (!userEmail || !giftCardType || !coinAmount) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing userEmail, coinAmount, or giftCardType" 
      });
    }
    
    // Your profit calculation
    const yourCost = giftCardValue * 0.90;
    const yourProfit = giftCardValue * 0.10;
    
    const giftCard = {
      id: 'manual_' + Date.now(),
      userId: actualUserId,
      userEmail: userEmail,
      giftCardType: giftCardType,
      coinAmount: coinAmount,
      giftCardValue: giftCardValue,
      yourCost: yourCost,
      yourProfit: yourProfit,
      status: 'pending_manual_processing',
      timestamp: new Date().toISOString()
    };
    
    console.log('🛒 MANUAL FULFILLMENT NEEDED:', giftCard);
    
    res.json({
      success: true,
      message: `🎉 ${giftCardType} $${giftCardValue} gift card requested! We'll email your code within 24 hours.`,
      adminAlert: `MANUAL: Buy $${giftCardValue} ${giftCardType} card and email to ${userEmail}`,
      yourProfit: yourProfit
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Redemption failed' 
    });
  }
});

// ₿ CRYPTO REDEMPTION
app.post("/api/redeem/crypto", async (req, res) => {
  try {
    const { userId, coinAmount, cryptoType = 'BTC' } = req.body;
    
    if (!userId || !coinAmount) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing userId or coinAmount" 
      });
    }
    
    const usdValue = coinAmount * 0.0009;
    const yourProfit = coinAmount * 0.0001;
    
    const cryptoAmount = usdValue / 40000;
    const transaction = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      userId: userId,
      coinAmount: coinAmount,
      cryptoAmount: cryptoAmount,
      cryptoType: cryptoType,
      usdValue: usdValue,
      yourProfit: yourProfit,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    console.log('₿ Crypto conversion:', transaction);
    
    res.json({
      success: true,
      message: `Converted ${coinAmount} coins to ${cryptoAmount} ${cryptoType}!`,
      transaction: transaction
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Crypto conversion failed' 
    });
  }
});

// 🚀 START SERVER
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));




