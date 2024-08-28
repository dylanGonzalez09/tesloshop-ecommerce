"use client";

import { useCartStore } from "@/store";
import { currencyFormatted } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export const OrderSummary = () => {
  const { itemsInCart, subtotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 articulo" : `${itemsInCart} articulos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormatted(subtotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormatted(tax)}</span>

        <span className="text-2xl mt-5">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormatted(total)}
        </span>
      </div>

      <div className=" mt-5 mb-2 w-full">
        <Link
          href="/checkout/address"
          className="flex btn-primary justify-center"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};
