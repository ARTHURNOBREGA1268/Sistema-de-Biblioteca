export const filtrarLivrosPorCategoria = (livros, categoria) =>
  livros.filter((livro) => livro.categoria === categoria)

const converterData = (data) => {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new Error('Data inválida. Utilize o formato AAAA-MM-DD')
  }

  const [ano, mes, dia] = data.split('-').map(Number)
  const dataEmMilissegundos = Date.UTC(ano, mes - 1, dia)
  const dataConvertida = new Date(dataEmMilissegundos)

  if (dataConvertida.toISOString().slice(0, 10) !== data) {
    throw new Error('Data inválida. Utilize uma data existente no formato AAAA-MM-DD')
  }

  return dataEmMilissegundos
}

export const calcularDiasAtraso = (dataPrevista, dataReferencia) => {
  const diferenca = converterData(dataReferencia) - converterData(dataPrevista)
  return Math.max(0, Math.floor(diferenca / 86400000))
}

export const calcularMulta = (diasAtraso, valorDiario = 2) => {
  if (!Number.isInteger(diasAtraso) || diasAtraso < 0) {
    throw new Error('Os dias de atraso devem ser um inteiro não negativo')
  }

  if (!Number.isFinite(valorDiario) || valorDiario < 0) {
    throw new Error('O valor diário deve ser um número não negativo')
  }

  return Number((diasAtraso * valorDiario).toFixed(2))
}

export const emprestimosAtrasados = (emprestimos, dataReferencia) => {
  converterData(dataReferencia)
  return emprestimos.filter((emprestimo) =>
    emprestimo.ativo && calcularDiasAtraso(emprestimo.dataPrevistaDevolucao, dataReferencia) > 0
  )
}

export const gerarRelatorioMultas = (emprestimos, dataReferencia) => {
  const atrasados = emprestimosAtrasados(emprestimos, dataReferencia)
  const itens = atrasados.map((emprestimo) => {
    const diasAtraso = calcularDiasAtraso(emprestimo.dataPrevistaDevolucao, dataReferencia)
    return {
      emprestimoId: emprestimo.id,
      livro: emprestimo.livro.titulo,
      usuario: emprestimo.usuario.nome,
      diasAtraso,
      multa: calcularMulta(diasAtraso)
    }
  })

  return {
    dataReferencia,
    itens,
    total: itens.reduce((soma, item) => soma + item.multa, 0)
  }
}

export const gerarEstatisticas = (livros, usuarios, emprestimos, dataReferencia) => {
  const porCategoria = livros.reduce((resultado, livro) => ({
    ...resultado,
    [livro.categoria]: (resultado[livro.categoria] ?? 0) + 1
  }), {})

  const emprestimosPorUsuario = emprestimos.reduce((resultado, emprestimo) => ({
    ...resultado,
    [emprestimo.usuario.id]: (resultado[emprestimo.usuario.id] ?? 0) + 1
  }), {})

  const ativos = emprestimos.filter((emprestimo) => emprestimo.ativo)
  const atrasados = emprestimosAtrasados(emprestimos, dataReferencia)
  const totalMultas = gerarRelatorioMultas(emprestimos, dataReferencia).total

  return {
    livrosPorCategoria: porCategoria,
    emprestimosPorUsuario: usuarios.reduce((resultado, usuario) => ({
      ...resultado,
      [usuario.id]: emprestimosPorUsuario[usuario.id] ?? 0
    }), {}),
    emprestimosAtivos: ativos.length,
    emprestimosAtivosAtrasados: atrasados.length,
    totalMultas
  }
}

export const calcularTotalMultasImperativo = (emprestimos, dataReferencia) => {
  converterData(dataReferencia)
  let total = 0

  for (const emprestimo of emprestimos) {
    if (emprestimo.ativo) {
      const diasAtraso = calcularDiasAtraso(emprestimo.dataPrevistaDevolucao, dataReferencia)
      if (diasAtraso > 0) {
        total += calcularMulta(diasAtraso)
      }
    }
  }

  return Number(total.toFixed(2))
}

export const calcularTotalMultasFuncional = (emprestimos, dataReferencia) =>
  gerarRelatorioMultas(emprestimos, dataReferencia).total
