"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debe estar autenticado",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    const address = await prisma.orderAddress.findUnique({
      where: {
        orderId: order?.id,
      },
    });

    const products = await prisma.orderItem.findMany({
      where: {
        orderId: order?.id,
      },
      select: {
        quantity: true,
        price: true,
        size: true,
        product: {
          select: {
            title: true,
            slug: true,
            ProductImage: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        },
      },
    });

    if (!order || !address || products.length <= 0)
      throw new Error(`La orden no existe`);

    if (session.user.role === "admin") {
      if (session.user.id !== order.userId) {
        throw new Error(`${id} no es de ese usuario`);
      }
    }

    return { ok: true, order, address, products };
  } catch (error) {
    return {
      ok: false,
      message: `Orden no existe`,
    };
  }
};
