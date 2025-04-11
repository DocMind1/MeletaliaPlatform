"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ReservationFormProps {
  propertyId: string;
  availableFrom: string;
  availableUntil: string;
  pricePerNight: number;
  ownerStripeId: string | null;
  isOwner: boolean;
  onClose: () => void;
  onSuccess: () => void;
  occupiedDates: Date[];
}

interface AuthUser {
  id: number;
  jwt: string;
  username: string;
  email: string;
}

interface PropertyOwner {
  data: {
    id: number;
    attributes: {
      stripeAccountId?: string;
    };
  };
}

interface Property {
  id: number;
  attributes: {
    users_permissions_user?: PropertyOwner;
    // Otras propiedades de la propiedad...
  };
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  propertyId,
  availableFrom,
  availableUntil,
  pricePerNight,
  ownerStripeId,
  isOwner,
  onClose,
  onSuccess,
  occupiedDates = []
}) => {
  const { user } = useAuth() as { user: AuthUser | null };
  const stripe = useStripe();
  const elements = useElements();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

  useEffect(() => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      const nights = end.diff(start, "days");
      setTotal(nights * pricePerNight);
    } else {
      setTotal(0);
    }
  }, [startDate, endDate, pricePerNight]);

  const isDateOccupied = (date: moment.Moment) => {
    return occupiedDates.some(occupiedDate => 
      moment(occupiedDate).isSame(date, 'day')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!user) {
      setError("Debes iniciar sesión para hacer una reserva.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Por favor selecciona las fechas de inicio y fin.");
      return;
    }

    if (isOwner) {
      setError("No puedes reservar tu propia propiedad.");
      return;
    }

    // Validación de fechas
    const start = moment(startDate);
    const end = moment(endDate);
    const availableFromDate = moment(availableFrom);
    const availableUntilDate = moment(availableUntil);

    if (start.isBefore(availableFromDate)) {
      setError(`La fecha de inicio no puede ser anterior a ${availableFromDate.format('DD/MM/YYYY')}`);
      return;
    }

    if (end.isAfter(availableUntilDate)) {
      setError(`La fecha de fin no puede ser posterior a ${availableUntilDate.format('DD/MM/YYYY')}`);
      return;
    }

    if (end.isSameOrBefore(start)) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }

    // Verificar fechas ocupadas
    let currentDate = start.clone();
    while (currentDate.isSameOrBefore(end)) {
      if (isDateOccupied(currentDate)) {
        setError("Las fechas seleccionadas incluyen días ya reservados.");
        return;
      }
      currentDate.add(1, 'day');
    }

    if (!stripe || !elements) {
      setError("Error al cargar el sistema de pagos. Por favor, recarga la página.");
      return;
    }

    setPaymentLoading(true);

    try {
      // Crear PaymentIntent
      const paymentResponse = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          propertyId,
          ownerId: ownerStripeId || undefined,
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Error al crear el pago");
      }

      const paymentData = await paymentResponse.json();

      // Confirmar pago
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: user.username,
              email: user.email,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Crear reserva en Strapi
      const reservaResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          data: {
            propiedad: propertyId,
            fechaInicio: start.format("YYYY-MM-DD"),
            fechaFin: end.format("YYYY-MM-DD"),
            usuario: user.id,
            estado: "pendiente",
            paymentIntentId: paymentIntent?.id,
            total,
          },
        }),
      });

      if (!reservaResponse.ok) {
        const errorData = await reservaResponse.json();
        throw new Error(errorData.error?.message || "Error al crear la reserva");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al procesar la reserva";
      setError(errorMessage);
      console.error("Error en reserva:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-black">Reservar Propiedad</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={availableFrom}
              max={availableUntil}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || availableFrom}
              max={availableUntil}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">
              Precio por noche: {pricePerNight} EUR
            </p>
            <p className="text-lg font-bold text-gray-900">
              Total: {total} EUR ({moment(endDate).diff(moment(startDate), 'days')} noches)
            </p>
            <p className="text-xs text-gray-500">
              Cancelación gratuita en 48 horas
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tarjeta</label>
            <CardElement
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
                hidePostalCode: true
              }}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={paymentLoading || !stripe || !elements}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {paymentLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : "Pagar y Reservar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function WrappedReservationForm(props: ReservationFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <ReservationForm {...props} />
    </Elements>
  );
}