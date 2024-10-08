import { create } from "zustand";
import { CartProduct } from "@/interfaces";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getTotalItems: () => number;
  getSummaryInformation: () => {
    subtotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };

  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;

  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      //   methods
      getTotalItems: () => {
        const { cart } = get();

        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      getSummaryInformation: () => {
        const { cart } = get();

        const subtotal = cart.reduce(
          // prettier-ignore
          (subtotal, product) => (product.quantity * product.price) + subtotal,
          0
        );

        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return { subtotal, tax, total, itemsInCart };
      },
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // revisar si el producto existe en el carrito con la talla seleccionada
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // 2. el producto existe por talla, incrementar
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },
      removeProduct: (product: CartProduct) => {
        const { cart } = get();

        const removedProducts = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );

        set({ cart: removedProducts });
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
