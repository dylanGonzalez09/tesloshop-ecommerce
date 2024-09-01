"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  orderId: string;
  ammount: number;
}

export const PaypalButton = ({ orderId, ammount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmmount = Math.round(ammount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 rounded" />
        <div className="h-10 mt-2 bg-gray-300 rounded" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: "USD",
            value: `${roundedAmmount}`,
          },
        },
      ],
      intent: "CAPTURE",
    });

    // guardar el id en la orden de la bd  - setTransactionId
    const resp = await setTransactionId(orderId, transactionId);

    if (!resp.ok) console.log({ resp });

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();

    if (!details) return;

    await paypalCheckPayment(details.id!);
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
