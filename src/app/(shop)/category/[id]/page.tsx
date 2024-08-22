import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

const seedProducts = initialData.products;

interface Props {
  params: {
    id: Category;
  };
}

const page = ({ params }: Props) => {
  const { id } = params;

  const products = seedProducts.filter((product) => product.gender === id);

  const labels: Record<Category, string> = {
    men: "hombres",
    women: "mujeres",
    kid: "niños",
    unisex: "para todos",
  };

  if (!products.length) {
    notFound();
  }

  return (
    <>
      <Title
        title={`Artículos de ${labels[id]}`}
        subtitle="todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />
    </>
  );
};

export default page;
