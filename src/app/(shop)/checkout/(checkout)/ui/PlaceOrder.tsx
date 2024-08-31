"use client";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormatted } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { itemsInCart, subtotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const address = useAddressStore((state) => state.address);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    // Todo server action
    const resp = await placeOrder(productsToOrder, address);

    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    // Todo salio bien

    // Limpiar carrito
    clearCart();

    // Redireccionar
    router.replace("/orders/" + resp.order!.id);
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>

      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* divider */}
      <div className="w-full  h-0.5 rounded bg-gray-200 mb-10" />

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

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            Al hacer clic en Colocar orden, acepta nuestros{" "}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y las{" "}
            <a href="#" className="underline">
              politicas de privacidad
            </a>
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>

        <button
          onClick={onPlaceOrder}
          // href="/orders/123"
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
