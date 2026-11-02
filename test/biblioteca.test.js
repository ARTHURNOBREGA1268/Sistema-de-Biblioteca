import test from 'node:test'
import assert from 'node:assert/strict'
import { Livro } from '../src/models/Livro.js'
import { Usuario } from '../src/models/Usuario.js'
import { Biblioteca } from '../src/services/Biblioteca.js'

const criarBiblioteca = () => {
  const biblioteca = new Biblioteca()
  biblioteca.cadastrarLivro(new Livro({ id: 'L1', titulo: 'Algoritmos', autor: 'Ana', categoria: 'Computação' }))
  biblioteca.cadastrarUsuario(new Usuario({ id: 'U1', nome: 'Caio', matricula: '2026001' }))
  biblioteca.cadastrarUsuario(new Usuario({ id: 'U2', nome: 'Bia', matricula: '2026002' }))
  return biblioteca
}

test('cadastra e consulta livros e usuários', () => {
  const biblioteca = criarBiblioteca()

  assert.equal(biblioteca.consultarLivro('L1').titulo, 'Algoritmos')
  assert.equal(biblioteca.consultarUsuario('U1').nome, 'Caio')
  assert.equal(biblioteca.consultarLivro('inexistente'), null)
})

test('recusa cadastros com identificador duplicado', () => {
  const biblioteca = criarBiblioteca()

  assert.throws(
    () => biblioteca.cadastrarLivro(new Livro({ id: 'L1', titulo: 'Outro', autor: 'Bia', categoria: 'Ficção' })),
    /Já existe um livro/
  )
  assert.throws(
    () => biblioteca.cadastrarUsuario(new Usuario({ id: 'U1', nome: 'Outro', matricula: '2026999' })),
    /Já existe um usuário/
  )
})

test('registra empréstimo e marca livro como indisponível', () => {
  const biblioteca = criarBiblioteca()
  const emprestimo = biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-01',
    dataPrevistaDevolucao: '2026-11-08'
  })

  assert.equal(emprestimo.ativo, true)
  assert.equal(biblioteca.livroDisponivel('L1'), false)
  assert.equal(biblioteca.consultarEmprestimos().length, 1)
})

test('recusa livro já emprestado e referências inexistentes', () => {
  const biblioteca = criarBiblioteca()
  const dados = {
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-01',
    dataPrevistaDevolucao: '2026-11-08'
  }

  biblioteca.registrarEmprestimo({ id: 'E1', ...dados })
  assert.throws(() => biblioteca.registrarEmprestimo({ id: 'E2', ...dados }), /Livro indisponível/)
  assert.throws(() => biblioteca.registrarEmprestimo({ id: 'E3', ...dados, idLivro: 'L9' }), /Livro não encontrado/)
  assert.throws(() => biblioteca.registrarEmprestimo({ id: 'E4', ...dados, idUsuario: 'U9' }), /Usuário não encontrado/)
})

test('devolução cria um novo empréstimo devolvido e libera o livro', () => {
  const biblioteca = criarBiblioteca()
  const emprestimoOriginal = biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-01',
    dataPrevistaDevolucao: '2026-11-08'
  })

  const emprestimoDevolvido = biblioteca.registrarDevolucao('E1', '2026-11-07')

  assert.equal(emprestimoOriginal.ativo, true)
  assert.equal(emprestimoDevolvido.ativo, false)
  assert.equal(emprestimoDevolvido.dataEfetivaDevolucao, '2026-11-07')
  assert.equal(biblioteca.livroDisponivel('L1'), true)
})

test('recusa empréstimo duplicado e devolução inválida', () => {
  const biblioteca = criarBiblioteca()
  biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-01',
    dataPrevistaDevolucao: '2026-11-08'
  })

  assert.throws(() => biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-01',
    dataPrevistaDevolucao: '2026-11-08'
  }), /Livro indisponível|identificador/)
  assert.throws(() => biblioteca.registrarDevolucao('E9', '2026-11-07'), /Empréstimo não encontrado/)
})

test('modelos rejeitam atributos e datas inválidas', () => {
  assert.throws(() => new Livro({ id: 'L2', titulo: '', autor: 'Ana', categoria: 'Ficção' }), /obrigatórios/)
  assert.throws(() => new Usuario({ id: 'U2', nome: 'Bia', matricula: '' }), /obrigatórios/)

  const biblioteca = criarBiblioteca()
  assert.throws(() => biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-02-30',
    dataPrevistaDevolucao: '2026-03-08'
  }), /Data inválida/)
  assert.throws(() => biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-10',
    dataPrevistaDevolucao: '2026-11-08'
  }), /não pode anteceder/)
})
