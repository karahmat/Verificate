require('dotenv').config()
const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/charge', async(req,res) => {
    try {
        const { amount, source, receipt_email } = req.body;
    
        const charge = await stripe.charges.create({
          amount,
          currency: 'usd',
          source,
          receipt_email
        })
    
        if (!charge) throw new Error('charge unsuccessful')
    
        res.status(200).json({
          charge,
          message: 'charge posted successfully'
        })
    } catch (error) {
        res.status(500).json({
          message: error.message
        })
    }
});

router.all('*', (_, res) =>
  res.json({ message: 'please make a POST request to /stripe/charge' })
);

module.exports = router;

