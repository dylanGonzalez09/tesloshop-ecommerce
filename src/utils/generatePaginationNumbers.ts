export const generatePaginationNumbers = (
  currentPage: number,
  totalPage: number
) => {
  // si el # total de pag es <= 7, mostrar todas las pag sin ...
  if (totalPage <= 7) {
    return Array.from({ length: totalPage }, (_, i) => i + 1)
  }

  // Si la pag esta entre las primeras 3 pag, mostrar las primeras 3, ..., y las ultimas 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPage - 1, totalPage]
  }

  // Si la pag actual esta entre las ultimas, mostrar las primeras 2, ..., y las ultimas 3
  if (currentPage >= totalPage - 2) {
    return [1, 2, "...", totalPage - 2, totalPage - 1, totalPage]
  }

  // Si la pag actual esta en otro lugar medio, mostrar la primera pag, ..., pagina actual
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPage,
  ]
}
