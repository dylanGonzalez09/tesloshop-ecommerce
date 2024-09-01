"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { transactionId },
    });

    if (!order) throw new Error();

    return { ok: true, order };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo actualizar la orden",
    };
  }
};
