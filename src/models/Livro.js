export class Livro {
  #id
  #titulo
  #autor
  #categoria

  constructor({ id, titulo, autor, categoria }) {
    if (!id || !titulo || !autor || !categoria) {
      throw new Error('Identificador, título, autor e categoria são obrigatórios')
    }

    this.#id = String(id)
    this.#titulo = String(titulo)
    this.#autor = String(autor)
    this.#categoria = String(categoria)
    Object.freeze(this)
  }

  get id() {
    return this.#id
  }

  get titulo() {
    return this.#titulo
  }

  get autor() {
    return this.#autor
  }

  get categoria() {
    return this.#categoria
  }
}
