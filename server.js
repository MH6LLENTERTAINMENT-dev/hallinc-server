// =========================================
// 🌍 HallInc Sports Arena + API-Sports Server
// =========================================

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ================================
// 🔐 API KEYS
// ================================
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
const IMPACT_API_KEY = process.env.IMPACT_API_KEY;
const IMPACT_ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const API_SPORTS_KEY = process.env.API_SPORTS_KEY;

// ================================
// 💰 COIN SYSTEM SETTINGS
// ================================
const COIN_RATE = 1000; // 1000 coins = $1 USD
const PLATFORM_FEE = 0.1; // 10% platform fee

function calculateCoinsNeeded(usdAmount) {
  return Math.ceil(usdAmount * COIN_RATE * (1 + PLATFORM_FEE));
}

function calculateUSDValue(coins) {
  return (coins / COIN_RATE).toFixed(2);
}

// ================================
// 🌍 MAIN ROUTE
// ================================
app.get("/", (req, res) => {
  res.json({
    message: "🎉 HallInc Server Live!",
    integrations: {
      coinbase: !!COINBASE_API_KEY,
      paypal: !!PAYPAL_CLIENT_ID,
      ticketmaster: !!TICKETMASTER_API_KEY,
      impact: !!IMPACT_API_KEY,
      apisports: !!API_SPORTS_KEY,
    },
    pricing: "1000 coins = $1 USD",
    status: "🟢 Running on Render",
  });
});

// ================================
// 🏥 HEALTH CHECK
// ================================
app.get("/health", (req, res) => {
  res.json({
    status: "🟢 Healthy",
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || "development"
  });
});

// ================================
// 🧪 TEST ENDPOINTS
// ================================
app.get("/test/ticketmaster", async (req, res) => {
  if (!TICKETMASTER_API_KEY) {
    return res.status(400).json({ error: "Ticketmaster API key not configured" });
  }
  
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&size=1`
    );
    const data = await response.json();
    res.json({ 
      ok: response.ok, 
      status: response.status,
      events: data._embedded?.events || [] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/test/coinbase", async (req, res) => {
  try {
    const response = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot");
    const data = await response.json();
    res.json({ 
      ok: response.ok, 
      status: response.status,
      data: data 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// 💳 PAYPAL PAYMENT ENDPOINT
// ================================
app.post("/paypal/create-order", async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: "Missing amount" });

  // Check if PayPal credentials are configured
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return res.status(500).json({ error: "PayPal credentials not configured" });
  }

  try {
    // 1️⃣ Get OAuth access token
    const tokenResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`PayPal auth failed: ${tokenResponse.status}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2️⃣ Create PayPal order
    const orderResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: amount.toString() },
          },
        ],
      }),
    });

    const orderData = await orderResponse.json();
    
    if (!orderResponse.ok) {
      throw new Error(`PayPal order failed: ${JSON.stringify(orderData)}`);
    }
    
    res.json({
      success: true,
      orderId: orderData.id,
      approvalUrl: orderData.links?.find((link) => link.rel === "approve")?.href,
    });
  } catch (err) {
    console.error("PayPal Error:", err);
    res.status(500).json({ error: "PayPal order creation failed: " + err.message });
  }
});

// ================================
// 💰 COIN PURCHASES (COINBASE SIM)
// ================================
app.post("/coinbase-charge", async (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) {
    return res.status(400).json({ error: "Missing userId or amount" });
  }

  const coinsEarned = amount * COIN_RATE;
  res.json({
    success: true,
    message: `Purchase ${coinsEarned.toLocaleString()} coins for $${amount}`,
    coinsEarned,
    paymentUrl: "https://www.coinbase.com/checkout",
    timestamp: new Date().toISOString()
  });
});

// ================================
// 🎟️ TICKETMASTER REDEMPTION
// ================================
app.post("/api/redeem/tickets", async (req, res) => {
  const { userEmail, eventId, eventName, ticketPrice = 50 } = req.body;
  if (!userEmail || !eventId) {
    return res.status(400).json({ error: "Missing userEmail or eventId" });
  }

  const coinsNeeded = calculateCoinsNeeded(ticketPrice);
  res.json({
    success: true,
    message: `🎟️ Reserved ${eventName} ticket for ${coinsNeeded} coins!`,
    ticket: {
      id: "tkt_" + Math.random().toString(36).substring(2, 11),
      eventName,
      ticketPrice,
      coinsNeeded,
      userEmail,
    },
  });
});

// ================================
// 🎁 LASSO / GIFT CARD REWARDS
// ================================
app.post("/api/redeem/lasso", (req, res) => {
  const { userEmail, brand, giftCardAmount } = req.body;
  if (!userEmail || !brand || !giftCardAmount) {
    return res.status(400).json({ error: "Missing userEmail, brand, or amount" });
  }

  const coinsNeeded = calculateCoinsNeeded(giftCardAmount);
  res.json({
    success: true,
    message: `🎁 Ordered $${giftCardAmount} ${brand} card for ${coinsNeeded} coins.`,
    reward: {
      id: "lasso_" + Date.now(),
      brand,
      giftCardAmount,
      coinsNeeded,
      userEmail,
      status: "processing",
    },
  });
});

// ================================
// 🏈 API-SPORTS INTEGRATION (USING NATIVE FETCH)
// ================================

// Base URLs for each sport
const leagueMap = {
  nfl: "https://v1.american-football.api-sports.io/games",
  ncaaf: "https://v1.american-football.api-sports.io/games",
  nba: "https://v1.basketball.api-sports.io/games",
  wnba: "https://v1.basketball.api-sports.io/games",
  ncaaw: "https://v1.basketball.api-sports.io/games",
  mlb: "https://v1.baseball.api-sports.io/games",
  nhl: "https://v1.hockey.api-sports.io/games",
};

// Unified sports endpoint
app.get("/sports/:league/:date", async (req, res) => {
  const { league, date } = req.params;
  const apiUrl = leagueMap[league.toLowerCase()];

  if (!apiUrl) return res.status(400).json({ error: "Unsupported league" });

  try {
    // Using native fetch instead of axios
    const response = await fetch(`${apiUrl}?date=${date}`, {
      headers: { "x-apisports-key": API_SPORTS_KEY },
    });

    if (!response.ok) {
      throw new Error(`API-Sports error: ${response.status}`);
    }

    const data = await response.json();

    const games = data.response?.map((game) => ({
      id: game.id || game.game?.id,
      date: game.date || game.datetime,
      league: league.toUpperCase(),
      status: game.status?.long || game.status?.description || "Scheduled",
      home: {
        name: game.teams?.home?.name || "TBD",
        logo: game.teams?.home?.logo || null,
        score: game.scores?.home?.total ?? "-",
      },
      away: {
        name: game.teams?.away?.name || "TBD",
        logo: game.teams?.away?.logo || null,
        score: game.scores?.away?.total ?? "-",
      },
    }));

    res.json({ league, date, games });
  } catch (err) {
    console.error("API-Sports Error:", err.message);
    res.status(500).json({ error: "Failed to fetch data from API-Sports" });
  }
});

// ================================
// 🎬 AD REWARDS SYSTEM
// ================================
let userBalances = {}; // In production, use database

app.post("/api/reward-ad", async (req, res) => {
  const { userId, adType = "video" } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: "User ID required" });
  }

  // Coin rewards based on ad type
  const rewards = {
    video: 1000,
    banner: 100,
    interstitial: 500
  };

  const coinsEarned = rewards[adType] || 500;
  
  // Initialize user balance if doesn't exist
  if (!userBalances[userId]) {
    userBalances[userId] = 0;
  }

  // Update balance
  userBalances[userId] += coinsEarned;

  res.json({
    success: true,
    coinsEarned,
    newBalance: userBalances[userId],
    message: `🎉 Earned ${coinsEarned} coins from watching ad!`,
    adType
  });
});

app.get("/api/user-balance/:userId", (req, res) => {
  const { userId } = req.params;
  const balance = userBalances[userId] || 0;
  
  res.json({ userId, balance });
});

// ================================
// ✅ SERVER START - CRITICAL FOR RENDER
// ================================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ HallInc Server running on port ${PORT}`);
  console.log(`📍 Host: 0.0.0.0`);
  console.log(`🔗 Health endpoint: /health`);
  console.log(`🕒 Started at: ${new Date().toISOString()}`);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
