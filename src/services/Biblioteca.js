import { Emprestimo } from '../models/Emprestimo.js'

export class Biblioteca {
  #livros = new Map()
  #usuarios = new Map()
  #emprestimos = new Map()

  cadastrarLivro(livro) {
    if (this.#livros.has(livro.id)) {
      throw new Error(`Já existe um livro com o identificador ${livro.id}`)
    }

    this.#livros.set(livro.id, livro)
    return livro
  }

  cadastrarUsuario(usuario) {
    if (this.#usuarios.has(usuario.id)) {
      throw new Error(`Já existe um usuário com o identificador ${usuario.id}`)
    }

    this.#usuarios.set(usuario.id, usuario)
    return usuario
  }

  consultarLivro(id) {
    return this.#livros.get(String(id)) ?? null
  }

  consultarUsuario(id) {
    return this.#usuarios.get(String(id)) ?? null
  }

  consultarLivros() {
    return [...this.#livros.values()]
  }

  consultarUsuarios() {
    return [...this.#usuarios.values()]
  }

  consultarEmprestimos() {
    return [...this.#emprestimos.values()]
  }

  consultarEmprestimo(id) {
    return this.#emprestimos.get(String(id)) ?? null
  }

  livroDisponivel(idLivro) {
    const livroId = String(idLivro)
    return this.#livros.has(livroId) && ![...this.#emprestimos.values()].some(
      (emprestimo) => emprestimo.livro.id === livroId && emprestimo.ativo
    )
  }

  registrarEmprestimo({ id, idLivro, idUsuario, dataEmprestimo, dataPrevistaDevolucao }) {
    const livro = this.consultarLivro(idLivro)
    const usuario = this.consultarUsuario(idUsuario)

    if (!livro) {
      throw new Error(`Livro não encontrado: ${idLivro}`)
    }

    if (!usuario) {
      throw new Error(`Usuário não encontrado: ${idUsuario}`)
    }

    if (!this.livroDisponivel(livro.id)) {
      throw new Error(`Livro indisponível: ${livro.id}`)
    }

    if (this.#emprestimos.has(String(id))) {
      throw new Error(`Já existe um empréstimo com o identificador ${id}`)
    }

    const emprestimo = new Emprestimo({
      id,
      livro,
      usuario,
      dataEmprestimo,
      dataPrevistaDevolucao
    })

    this.#emprestimos.set(emprestimo.id, emprestimo)
    return emprestimo
  }

  registrarDevolucao(idEmprestimo, dataDevolucao) {
    const emprestimo = this.consultarEmprestimo(idEmprestimo)

    if (!emprestimo) {
      throw new Error(`Empréstimo não encontrado: ${idEmprestimo}`)
    }

    const emprestimoDevolvido = emprestimo.devolver(dataDevolucao)
    this.#emprestimos.set(emprestimoDevolvido.id, emprestimoDevolvido)
    return emprestimoDevolvido
  }
}
