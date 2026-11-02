import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { Livro } from '../src/models/Livro.js'
import { Usuario } from '../src/models/Usuario.js'
import { Biblioteca } from '../src/services/Biblioteca.js'
import {
  calcularDiasAtraso,
  calcularMulta,
  calcularTotalMultasFuncional,
  calcularTotalMultasImperativo,
  emprestimosAtrasados,
  filtrarLivrosPorCategoria,
  gerarEstatisticas,
  gerarRelatorioMultas
} from '../src/functional/relatorios.js'

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

test('permite emprestar novamente o livro depois da devolução', () => {
  const biblioteca = criarBiblioteca()
  biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-01',
    dataPrevistaDevolucao: '2026-11-08'
  })
  biblioteca.registrarDevolucao('E1', '2026-11-07')

  const novoEmprestimo = biblioteca.registrarEmprestimo({
    id: 'E2',
    idLivro: 'L1',
    idUsuario: 'U2',
    dataEmprestimo: '2026-11-08',
    dataPrevistaDevolucao: '2026-11-15'
  })

  assert.equal(novoEmprestimo.id, 'E2')
  assert.equal(novoEmprestimo.usuario.id, 'U2')
  assert.equal(biblioteca.livroDisponivel('L1'), false)
  assert.equal(biblioteca.consultarEmprestimos().length, 2)
})

test('recusa empréstimo duplicado e devolução inválida', () => {
  const biblioteca = criarBiblioteca()
  biblioteca.cadastrarLivro(new Livro({ id: 'L2', titulo: 'Estruturas', autor: 'Bia', categoria: 'Computação' }))
  biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L1',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-01',
    dataPrevistaDevolucao: '2026-11-08'
  })

  assert.throws(() => biblioteca.registrarEmprestimo({
    id: 'E1',
    idLivro: 'L2',
    idUsuario: 'U1',
    dataEmprestimo: '2026-11-01',
    dataPrevistaDevolucao: '2026-11-08'
  }), /identificador/)
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

test('calcula dias de atraso e multa sem gerar cobrança antes do atraso', () => {
  assert.equal(calcularDiasAtraso('2026-11-08', '2026-11-08'), 0)
  assert.equal(calcularDiasAtraso('2026-11-08', '2026-11-09'), 1)
  assert.equal(calcularDiasAtraso('2026-11-08', '2026-11-11'), 3)
  assert.equal(calcularMulta(3), 6)
  assert.equal(calcularMulta(0), 0)
  assert.throws(() => calcularMulta(-1), /inteiro não negativo/)
})

test('filtra livros por categoria sem alterar a coleção original', () => {
  const livros = [
    new Livro({ id: 'L1', titulo: 'Algoritmos', autor: 'Ana', categoria: 'Computação' }),
    new Livro({ id: 'L2', titulo: 'Contos', autor: 'Bia', categoria: 'Ficção' }),
    new Livro({ id: 'L3', titulo: 'Redes', autor: 'Caio', categoria: 'Computação' })
  ]
  const resultado = filtrarLivrosPorCategoria(livros, 'Computação')

  assert.deepEqual(resultado.map((livro) => livro.id), ['L1', 'L3'])
  assert.equal(livros.length, 3)
  assert.notEqual(resultado, livros)
})

test('consultas retornam coleções independentes e cálculos puros são repetíveis', () => {
  const biblioteca = criarBiblioteca()
  const livrosConsultados = biblioteca.consultarLivros()
  livrosConsultados.pop()

  assert.equal(biblioteca.consultarLivros().length, 1)
  assert.equal(calcularMulta(4), calcularMulta(4))
  assert.equal(calcularDiasAtraso('2026-11-08', '2026-11-12'), calcularDiasAtraso('2026-11-08', '2026-11-12'))
})

test('relatório usa empréstimos ativos atrasados e calcula multas com filter, map e reduce', () => {
  const biblioteca = criarBiblioteca()
  biblioteca.cadastrarLivro(new Livro({ id: 'L2', titulo: 'Estruturas', autor: 'Bia', categoria: 'Computação' }))
  biblioteca.cadastrarLivro(new Livro({ id: 'L3', titulo: 'Poesia', autor: 'Duda', categoria: 'Literatura' }))
  biblioteca.registrarEmprestimo({
    id: 'E1', idLivro: 'L1', idUsuario: 'U1', dataEmprestimo: '2026-11-01', dataPrevistaDevolucao: '2026-11-08'
  })
  biblioteca.registrarEmprestimo({
    id: 'E2', idLivro: 'L2', idUsuario: 'U2', dataEmprestimo: '2026-11-02', dataPrevistaDevolucao: '2026-11-10'
  })
  biblioteca.registrarEmprestimo({
    id: 'E3', idLivro: 'L3', idUsuario: 'U1', dataEmprestimo: '2026-11-03', dataPrevistaDevolucao: '2026-11-04'
  })
  biblioteca.registrarDevolucao('E3', '2026-11-05')
  const emprestimos = biblioteca.consultarEmprestimos()
  const copiaAntes = [...emprestimos]
  const atrasados = emprestimosAtrasados(emprestimos, '2026-11-11')
  const relatorio = gerarRelatorioMultas(emprestimos, '2026-11-11')

  assert.deepEqual(atrasados.map((emprestimo) => emprestimo.id), ['E1', 'E2'])
  assert.deepEqual(relatorio.itens.map((item) => item.multa), [6, 2])
  assert.equal(relatorio.total, 8)
  assert.deepEqual(emprestimos, copiaAntes)
})

test('não multa empréstimo na data prevista e exclui devolvido após o vencimento', () => {
  const biblioteca = criarBiblioteca()
  biblioteca.cadastrarLivro(new Livro({ id: 'L2', titulo: 'Estruturas', autor: 'Bia', categoria: 'Computação' }))
  biblioteca.registrarEmprestimo({
    id: 'E1', idLivro: 'L1', idUsuario: 'U1', dataEmprestimo: '2026-11-01', dataPrevistaDevolucao: '2026-11-11'
  })
  biblioteca.registrarEmprestimo({
    id: 'E2', idLivro: 'L2', idUsuario: 'U2', dataEmprestimo: '2026-11-01', dataPrevistaDevolucao: '2026-11-08'
  })
  biblioteca.registrarDevolucao('E2', '2026-11-10')

  const relatorio = gerarRelatorioMultas(biblioteca.consultarEmprestimos(), '2026-11-11')

  assert.deepEqual(relatorio.itens, [])
  assert.equal(relatorio.total, 0)
})

test('estatísticas agregam categorias, usuários, empréstimos e multas', () => {
  const biblioteca = criarBiblioteca()
  biblioteca.cadastrarLivro(new Livro({ id: 'L2', titulo: 'Estruturas', autor: 'Bia', categoria: 'Computação' }))
  biblioteca.registrarEmprestimo({
    id: 'E1', idLivro: 'L1', idUsuario: 'U1', dataEmprestimo: '2026-11-01', dataPrevistaDevolucao: '2026-11-08'
  })
  biblioteca.registrarEmprestimo({
    id: 'E2', idLivro: 'L2', idUsuario: 'U2', dataEmprestimo: '2026-11-02', dataPrevistaDevolucao: '2026-11-10'
  })

  const estatisticas = gerarEstatisticas(
    biblioteca.consultarLivros(),
    biblioteca.consultarUsuarios(),
    biblioteca.consultarEmprestimos(),
    '2026-11-11'
  )

  assert.deepEqual(estatisticas.livrosPorCategoria, { 'Computação': 2 })
  assert.deepEqual(estatisticas.emprestimosPorUsuario, { U1: 1, U2: 1 })
  assert.equal(estatisticas.emprestimosAtivos, 2)
  assert.equal(estatisticas.emprestimosAtivosAtrasados, 2)
  assert.equal(estatisticas.totalMultas, 8)
})

test('versões imperativa e funcional calculam totais equivalentes', () => {
  const biblioteca = criarBiblioteca()
  biblioteca.registrarEmprestimo({
    id: 'E1', idLivro: 'L1', idUsuario: 'U1', dataEmprestimo: '2026-11-01', dataPrevistaDevolucao: '2026-11-08'
  })
  const emprestimos = biblioteca.consultarEmprestimos()

  assert.equal(calcularTotalMultasImperativo(emprestimos, '2026-11-11'), 6)
  assert.equal(calcularTotalMultasFuncional(emprestimos, '2026-11-11'), 6)
})

test('relatórios rejeitam datas de referência inválidas', () => {
  assert.throws(() => emprestimosAtrasados([], '2026-02-30'), /Data inválida/)
  assert.throws(() => gerarRelatorioMultas([], '11-11-2026'), /Data inválida/)
})

test('interface de terminal exibe o menu e encerra pela opção de saída', () => {
  const processo = spawnSync(process.execPath, ['src/index.js'], {
    input: '0\n',
    encoding: 'utf8'
  })

  assert.equal(processo.status, 0, processo.stderr)
  assert.match(processo.stdout, /Sistema de Biblioteca/)
  assert.match(processo.stdout, /10\. Filtrar livros por categoria/)
})
