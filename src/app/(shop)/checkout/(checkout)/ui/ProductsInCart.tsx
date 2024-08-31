"use client";

import { useCartStore } from "@/store";
import { currencyFormatted } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  useEffect(() => {
    if (getTotalItems() <= 0) {
      router.replace("/empty");
      return;
    }

    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div
          key={`${product.slug}-${product.size}`}
          className="flex items-center mb-5"
        >
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            alt={product.title}
            style={{
              width: "100px",
              height: "100px",
            }}
            className="m-5  rounded"
          />

          <div>
            <span>
              <p>
                {product.title} - {product.size} ({product.quantity})
              </p>
            </span>

            <p className="font-bold">
              {currencyFormatted(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
