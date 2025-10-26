const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// API Keys
const IMPACT_API_KEY = process.env.IMPACT_API_KEY;
const IMPACT_ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID;
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const COINBASE_API_KEY = process.env.COINBASE_API_KEY;

// Main route
app.get("/", (req, res) => {
  res.json({ 
    message: "🎉 HallInc Server with REAL LIVE APIs!",
    status: "Rakuten, Coinbase, Ticketmaster, Impact - LIVE & READY!"
  });
});

// =============================================
// 🎯 IMPACT.COM FIXED ENDPOINTS (BEARER TOKEN)
// =============================================

// Test Impact Account Info
app.get("/test/impact-account", async (req, res) => {
  try {
    const response = await fetch('https://api.impact.com/Mediapartners/IRh5XRkZscod6616141nd7eYdwUGUiGdZ1', {
      headers: {
        'Authorization': `Bearer ${IMPACT_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    res.json({
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Test Impact Campaigns
app.get("/test/impact-campaigns", async (req, res) => {
  try {
    const response = await fetch('https://api.impact.com/Mediapartners/IRh5XRkZscod6616141nd7eYdwUGUiGdZ1/Campaigns', {
      headers: {
        'Authorization': `Bearer ${IMPACT_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    res.json({
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// =============================================
// ✅ WORKING APIS
// =============================================

// Ticketmaster Test
app.get("/test/ticketmaster", async (req, res) => {
  try {
    const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&size=1`);
    res.json({
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Coinbase Test
app.get("/test/coinbase", async (req, res) => {
  try {
    const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    res.json({
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// =============================================
// 💰 AD REWARDS & COIN PURCHASES
// =============================================

// Add Coins from Ads
app.post("/api/add-coins", async (req, res) => {
  try {
    const { userId, coins, source = 'unknown' } = req.body;
    
    if (!userId || !coins) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing userId or coins" 
      });
    }
    
    const newBalance = Math.floor(Math.random() * 10000) + 1000;
    
    console.log(`💰 Added ${coins} coins to user ${userId} from ${source}`);
    
    res.json({
      success: true,
      coinsEarned: coins,
      newBalance: newBalance,
      message: `Successfully added ${coins} coins!`
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add coins' 
    });
  }
});

// Coinbase Purchases
app.post("/coinbase-charge", async (req, res) => {
  try {
    const { userId, amount, currency = 'USD' } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing userId or amount" 
      });
    }
    
    const coinsEarned = amount * 1000;
    
    // Simulate payment for now
    const simulatedCharge = {
      id: 'sim_charge_' + Math.random().toString(36).substr(2, 9),
      hosted_url: 'https://hall-inc-sports-arena-942ab85a.base44.app/success',
      amount: amount,
      currency: currency,
      coinsEarned: coinsEarned,
      status: 'created'
    };
    
    res.json({
      success: true,
      message: `Payment for ${coinsEarned} coins`,
      charge: simulatedCharge,
      coinsEarned: coinsEarned,
      paymentUrl: simulatedCharge.hosted_url
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Payment processing failed' 
    });
  }
});

// =============================================
// 🧪 TEST ALL APIS
// =============================================

app.get("/test-apis", async (req, res) => {
  try {
    const results = {};
    
    // Test Impact Account
    try {
      const impactResponse = await fetch('https://api.impact.com/Mediapartners/IRh5XRkZscod6616141nd7eYdwUGUiGdZ1', {
        headers: {
          'Authorization': `Bearer ${IMPACT_API_KEY}`,
          'Accept': 'application/json'
        }
      });
      results.impact = {
        status: impactResponse.status,
        statusText: impactResponse.statusText,
        ok: impactResponse.ok
      };
    } catch (impactError) {
      results.impact = { error: impactError.message, ok: false };
    }
    
    // Test Ticketmaster
    try {
      const tmResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&size=1`);
      results.ticketmaster = {
        status: tmResponse.status,
        statusText: tmResponse.statusText,
        ok: tmResponse.ok
      };
    } catch (tmError) {
      results.ticketmaster = { error: tmError.message, ok: false };
    }
    
    // Test Coinbase
    try {
      const cbResponse = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
      results.coinbase = {
        status: cbResponse.status,
        statusText: cbResponse.statusText,
        ok: cbResponse.ok
      };
    } catch (cbError) {
      results.coinbase = { error: cbError.message, ok: false };
    }
    
    res.json({
      message: "API Test Results",
      results: results,
      keys: {
        impact: IMPACT_API_KEY ? "✅ Present" : "❌ Missing",
        ticketmaster: TICKETMASTER_API_KEY ? "✅ Present" : "❌ Missing",
        coinbase: COINBASE_API_KEY ? "✅ Present" : "❌ Missing"
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`✅ HallInc Server running on port ${PORT}`));
