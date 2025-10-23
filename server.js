const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Example route to test if server works
app.get("/", (req, res) => {
  res.json({ message: "HallInc Server is running 🚀" });
});

// Example external API test - FIXED
app.get("/ping", async (req, res) => {
  try {
    // Node.js 18+ has built-in fetch - no import needed!
    const response = await fetch("https://api.github.com");
    const data = await response.json();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));






