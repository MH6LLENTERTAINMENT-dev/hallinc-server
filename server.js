// 🎁 GIFT CARD REDEMPTION (Rakuten API)
app.post("/api/redeem/giftcard", async (req, res) => {
  try {
    const { userId, coinAmount, giftCardType } = req.body;
    
    // Validate input
    if (!userId || !coinAmount || !giftCardType) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing userId, coinAmount, or giftCardType" 
      });
    }
    
    // Your profit calculation (10% spread)
    const usdValue = coinAmount * 0.0009; // User gets 90% value
    const yourProfit = coinAmount * 0.0001; // You keep 10%
    
    // Simulate gift card redemption (replace with real Rakuten API later)
    const giftCard = {
      id: 'gc_' + Math.random().toString(36).substr(2, 9),
      userId: userId,
      coinAmount: coinAmount,
      giftCardType: giftCardType,
      usdValue: usdValue,
      yourProfit: yourProfit,
      code: 'GIFT-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      timestamp: new Date().toISOString(),
      status: 'issued'
    };
    
    console.log('🎁 Gift card redeemed:', giftCard);
    
    res.json({
      success: true,
      message: `Redeemed ${coinAmount} coins for $${usdValue} ${giftCardType} gift card!`,
      giftCard: giftCard
    });
    
  } catch (err) {
    console.error('Gift card redemption error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Gift card redemption failed' 
    });
  }
});

// ₿ CRYPTO REDEMPTION (Coinbase/CoinGate API)
app.post("/api/redeem/crypto", async (req, res) => {
  try {
    const { userId, coinAmount, cryptoType = 'BTC' } = req.body;
    
    if (!userId || !coinAmount) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing userId or coinAmount" 
      });
    }
    
    // Your profit calculation (10% spread)
    const usdValue = coinAmount * 0.0009; // User gets 90% value
    const yourProfit = coinAmount * 0.0001; // You keep 10%
    
    // Simulate crypto conversion (replace with real API later)
    const cryptoAmount = usdValue / 40000; // Example: BTC at $40,000
    
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
    console.error('Crypto conversion error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Crypto conversion failed' 
    });
  }
});

// 🎫 TICKET REDEMPTION (Ticketmaster API)
app.post("/api/redeem/tickets", async (req, res) => {
  try {
    const { userId, coinAmount, eventName } = req.body;
    
    if (!userId || !coinAmount || !eventName) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing userId, coinAmount, or eventName" 
      });
    }
    
    const usdValue = coinAmount * 0.0009; // Your 10% profit built in
    
    const ticket = {
      id: 'tk_' + Math.random().toString(36).substr(2, 9),
      userId: userId,
      coinAmount: coinAmount,
      eventName: eventName,
      usdValue: usdValue,
      ticketCode: 'TKT-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      timestamp: new Date().toISOString(),
      status: 'reserved'
    };
    
    console.log('🎫 Ticket redeemed:', ticket);
    
    res.json({
      success: true,
      message: `Redeemed ${coinAmount} coins for ${eventName} tickets!`,
      ticket: ticket
    });
    
  } catch (err) {
    console.error('Ticket redemption error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Ticket redemption failed' 
    });
  }
});






