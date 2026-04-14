const express = require('express');
const cors = require('cors');
require('dotenv').config();
// TODO: Replace with your actual Stripe Secret Key (sk_test_...)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create a PaymentIntent with the given amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amounts in cents, so we multiply by 100
      currency: currency || 'usd',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error: ", error.message);
    res.status(500).send({ error: error.message });
  }
});

app.post('/create-refund', async (req, res) => {
  try {
    const { payment_intent } = req.body;
    const refund = await stripe.refunds.create({
      payment_intent: payment_intent,
    });
    res.send({ refund: true });
  } catch (error) {
    console.error("Stripe Refund Error: ", error.message);
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Node Server running on port ${PORT}`));
