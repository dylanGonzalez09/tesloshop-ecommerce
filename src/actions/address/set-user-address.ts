"use server";

import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo grabar la direccion",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    const addressToSave = {
      userId: userId,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      address2: address.address2,
      postalCode: address.postalCode,
      city: address.city,
      phone: address.phone,
      countryId: address.country,
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        userId,
      },
      data: addressToSave,
    });

    return updatedAddress;
  } catch (error) {
    throw new Error("No se pudo grabar la direccion");
  }
};
