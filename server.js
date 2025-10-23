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




