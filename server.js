import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch"; // make sure node-fetch is installed: npm install node-fetch@3

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ✅ Simple test endpoint
app.get("/ping", async (req, res) => {
  try {
    const response = await fetch("https://api.github.com");
    const data = await response.json();
    res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ Placeholder route for Ticketmaster transactions
app.post("/ticketmaster/transaction", async (req, res) => {
  try {
    const { userId, eventId, paymentMethod } = req.body;
    console.log("Incoming Ticketmaster transaction:", req.body);

    // (Later we'll call Ticketmaster API here)
    res.json({
      success: true,
      message: `Ticket purchase for event ${eventId} using ${paymentMethod} received.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));







