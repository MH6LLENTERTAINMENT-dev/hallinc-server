app.post("/api/redeem/giftcard", async (req, res) => {
  try {
    const { userEmail, giftCardType, coinAmount, giftCardValue } = req.body;
    
    // Your profit calculation
    const yourCost = giftCardValue * 0.90; // Buy at 10% discount
    const yourProfit = giftCardValue * 0.10; // Keep 10% profit
    
    // Simulate processing (you'll manually fulfill)
    const giftCard = {
      id: 'manual_' + Date.now(),
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




