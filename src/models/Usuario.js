export class Usuario {
  #id
  #nome
  #matricula

  constructor({ id, nome, matricula }) {
    if (!id || !nome || !matricula) {
      throw new Error('Identificador, nome e matrícula são obrigatórios')
    }

    this.#id = String(id)
    this.#nome = String(nome)
    this.#matricula = String(matricula)
    Object.freeze(this)
  }

  get id() {
    return this.#id
  }

  get nome() {
    return this.#nome
  }

  get matricula() {
    return this.#matricula
  }
}
