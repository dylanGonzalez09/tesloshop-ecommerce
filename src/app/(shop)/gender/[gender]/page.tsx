export const revalidate = 60

import { getPaginatedProductWithImages } from "@/actions"
import { Pagination, ProductGrid, Title } from "@/components"
import { Gender } from "@prisma/client"
import { redirect } from "next/navigation"

interface Props {
  params: {
    gender: string
  }
  searchParams: {
    page?: string
  }
}

const page = async ({ params, searchParams }: Props) => {
  const { gender } = params

  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const { products, currentPage, totalPages } =
    await getPaginatedProductWithImages({
      page,
      gender: gender as Gender,
    })

  if (!products.length) {
    redirect(`/gender/${gender}`)
  }

  const labels: Record<string, string> = {
    men: "hombres",
    women: "mujeres",
    kid: "niños",
    unisex: "para todos",
  }

  return (
    <>
      <Title
        title={`Artículos de ${labels[gender]}`}
        subtitle="todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  )
}

export default page
