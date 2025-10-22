require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = (...args) => import fetch from "node-fetch";
.then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ✅ CoinGate API base
const COINGATE_API_KEY = process.env.COINGATE_API_KEY;
const COINGATE_BASE_URL = "https://api.coingate.com/v2";

// ✅ Test route to verify your server
app.get("/", (req, res) => {
  res.send("✅ HallInc Giftbit Server is running and ready for CoinGate integration.");
});

// ✅ Ping CoinGate (tests your API key)
app.get("/test-coingate", async (req, res) => {
  try {
    const response = await fetch(`${COINGATE_BASE_URL}/orders`, {
      headers: {
        "Authorization": `Token ${COINGATE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // Try to parse JSON safely
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      return res.status(500).json({ ok: false, error: "Invalid JSON response", raw: text });
    }

    res.json({ ok: true, data });
  } catch (err) {
    console.error("Error connecting to CoinGate:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






