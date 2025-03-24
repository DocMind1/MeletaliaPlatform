import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import moment from "moment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as const,
});

// Tipo mejorado con verificación segura
interface PaymentIntentWithCharges extends Stripe.PaymentIntent {
  charges: Stripe.ApiList<Stripe.Charge>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const reservasResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas?filters[estado][$eq]=pendiente&populate=propiedad.users_permissions_user`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}` } }
    );

    if (!reservasResponse.ok) throw new Error("Error al obtener reservas");

    const reservas = (await reservasResponse.json()).data;

    for (const reserva of reservas) {
      const createdAt = moment(reserva.attributes.createdAt);
      const hoursDiff = moment().diff(createdAt, "hours");

      if (hoursDiff > 48 && reserva.attributes.paymentIntentId) {
        const ownerId = reserva.attributes.propiedad.data.attributes.users_permissions_user.data.attributes.stripeAccountId;
        const amount = reserva.attributes.total * (1 - 0.15);

        // Solución definitiva para el casting:
        const paymentIntent = await stripe.paymentIntents.retrieve(
          reserva.attributes.paymentIntentId,
          { expand: ["charges"] }
        ) as unknown as PaymentIntentWithCharges;

        if (!paymentIntent.charges?.data?.length) {
          throw new Error("No se encontraron cargos válidos");
        }

        await stripe.transfers.create({
          amount: Math.round(amount * 100),
          currency: "eur",
          destination: ownerId,
          source_transaction: paymentIntent.charges.data[0].id,
        });

        await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas/${reserva.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
          },
          body: JSON.stringify({ data: { estado: "confirmada" } }),
        });
      }
    }

    res.status(200).json({ message: "Transferencias procesadas" });
  } catch (error: any) {
    console.error("Error en check-transfers:", error);
    res.status(500).json({ error: error.message || "Error al procesar transferencias" });
  }
}