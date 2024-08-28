import { QuantitySelector, SizeSelector } from "@/components"
import { Product } from "@/interfaces"

interface Props {
  product: Product
}

export const AddToCart = ({ product }: Props) => {
  return (
    <>
      {/* Selector de Tallas */}
      <SizeSelector
        selectedSize={product.sizes[1]}
        availableSizes={product.sizes}
      />

      {/* Selector de Cantidad */}
      <QuantitySelector quantity={2} />

      {/* Button */}
      <button className="btn-primary my-5">Agregar al carrito</button>
    </>
  )
}
