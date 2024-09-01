"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getpaginatedUsers = async () => {
  const session = await auth();

  try {
    if (session?.user.role !== "admin") {
      return {
        ok: false,
        message: "Debe ser un administrador",
      };
    }

    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
    });

    return {
      ok: true,
      users,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Algo salio mal",
    };
  }
};
