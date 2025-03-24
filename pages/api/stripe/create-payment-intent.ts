import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", // Versión específica que requiere tu cuenta
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, propertyId, ownerId } = req.body;

    if (!amount || !propertyId) {
      return res.status(400).json({ error: "Amount and propertyId are required" });
    }

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount * 100),
      currency: "eur",
      metadata: { propertyId },
      ...(ownerId && ownerId !== "undefined" && { 
        transfer_data: { 
          destination: ownerId 
        },
        application_fee_amount: Math.round(amount * 100 * 0.15)
      })
    };

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({ 
      error: error.message || "Error creating payment intent" 
    });
  }
}