"use server";

import prisma from "@/lib/prisma";

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    const stock = await prisma.product.findFirst({
      select: {
        inStock: true,
      },
      where: { slug },
    });

    return stock?.inStock ?? 0;
  } catch (error) {
    return 0;
  }
};
