const validarData = (data) => {
  const dataParseada = new Date(`${data}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || Number.isNaN(dataParseada.getTime()) || dataParseada.toISOString().slice(0, 10) !== data) {
    throw new Error('Data inválida. Utilize o formato AAAA-MM-DD')
  }

  return data
}

export class Emprestimo {
  #id
  #livro
  #usuario
  #dataEmprestimo
  #dataPrevistaDevolucao
  #dataEfetivaDevolucao

  constructor({ id, livro, usuario, dataEmprestimo, dataPrevistaDevolucao, dataEfetivaDevolucao = null }) {
    if (!id || !livro || !usuario) {
      throw new Error('Identificador, livro e usuário são obrigatórios')
    }

    this.#id = String(id)
    this.#livro = livro
    this.#usuario = usuario
    this.#dataEmprestimo = validarData(dataEmprestimo)
    this.#dataPrevistaDevolucao = validarData(dataPrevistaDevolucao)
    this.#dataEfetivaDevolucao = dataEfetivaDevolucao === null ? null : validarData(dataEfetivaDevolucao)

    if (this.#dataPrevistaDevolucao < this.#dataEmprestimo) {
      throw new Error('A data prevista de devolução não pode anteceder o empréstimo')
    }

    if (this.#dataEfetivaDevolucao && this.#dataEfetivaDevolucao < this.#dataEmprestimo) {
      throw new Error('A data efetiva de devolução não pode anteceder o empréstimo')
    }

    Object.freeze(this)
  }

  get id() {
    return this.#id
  }

  get livro() {
    return this.#livro
  }

  get usuario() {
    return this.#usuario
  }

  get dataEmprestimo() {
    return this.#dataEmprestimo
  }

  get dataPrevistaDevolucao() {
    return this.#dataPrevistaDevolucao
  }

  get dataEfetivaDevolucao() {
    return this.#dataEfetivaDevolucao
  }

  get ativo() {
    return this.#dataEfetivaDevolucao === null
  }

  devolver(data) {
    if (!this.ativo) {
      throw new Error('Este empréstimo já foi devolvido')
    }

    const dataValidada = validarData(data)
    if (dataValidada < this.#dataEmprestimo) {
      throw new Error('A data de devolução não pode anteceder o empréstimo')
    }

    return new Emprestimo({
      id: this.#id,
      livro: this.#livro,
      usuario: this.#usuario,
      dataEmprestimo: this.#dataEmprestimo,
      dataPrevistaDevolucao: this.#dataPrevistaDevolucao,
      dataEfetivaDevolucao: dataValidada
    })
  }
}
