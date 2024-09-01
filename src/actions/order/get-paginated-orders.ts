"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedOrders = async () => {
  try {
    const session = await auth();

    if (session?.user.role !== "admin")
      return { ok: false, message: "Debe autenticarse" };

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      orders,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Algo salio mal",
    };
  }
};
