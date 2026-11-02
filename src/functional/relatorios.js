export const filtrarLivrosPorCategoria = (livros, categoria) =>
  livros.filter((livro) => livro.categoria === categoria)

export const calcularMulta = (diasAtraso, valorDiario = 2) =>
  Math.max(0, diasAtraso) * valorDiario
