"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: Number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();

  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: "No hay session de usuario",
    };
  }

  try {
    // Obtener productos con el mismo  ID
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds.map((product) => product.productId),
        },
      },
    });

    // Calcular montos - encabezado (maestro detalle)
    const itemsInOrder = productIds.reduce(
      (count, product) => count + Number(product.quantity),
      0
    );

    // Totales de: tax, subtotal, total
    const { subTotal, tax, total } = productIds.reduce(
      (totals, item) => {
        const productQuantity = Number(item.quantity);
        const product = products.find(
          (product) => product.id === item.productId
        );

        if (!product) throw new Error(`${item.productId} no existe -500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;
      },
      { subTotal: 0, tax: 0, total: 0 }
    );

    // Crear la transaccion

    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar stock de los productos
      const updatedProductsPromises = products.map(async (product) => {
        // Acumular valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acum, item) => Number(item.quantity) + acum, 0);

        if (productQuantity <= 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            // inStock: product.inStock - productQuantity - NO HACER (product.inStock) es un valor viejo  o desfasado en el tiempo

            // Basado en el valor actual !!
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar si no hay existencias o estan en negativos
      updatedProducts.forEach((product) => {
        if (product.inStock <= 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`);
        }
      });

      // 2. Crear orden - encabezado - detalle
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subtotal: subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: Number(p.quantity),
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      // Validar  si  el  price es 0, lanzar error

      // 3. Crear la direccion de la orden

      const { country, ...restAddress } = address;

      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: address.country,
          orderId: order.id,
        },
      });

      return { order, orderAddress, updatedProducts };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
