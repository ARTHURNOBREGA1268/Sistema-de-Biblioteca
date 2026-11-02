import { Livro } from './models/Livro.js'
import { Usuario } from './models/Usuario.js'
import { Biblioteca } from './services/Biblioteca.js'
import { randomUUID } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { createInterface } from 'node:readline/promises'
import {
  filtrarLivrosPorCategoria,
  gerarEstatisticas,
  gerarRelatorioMultas
} from './functional/relatorios.js'

const exibirLista = (itens) => {
  if (itens.length === 0) {
    console.log('Nenhum registro encontrado.')
    return
  }

  console.log(JSON.stringify(itens, null, 2))
}

export const iniciarInterface = async () => {
  const biblioteca = new Biblioteca()
  const terminal = createInterface({ input: process.stdin, output: process.stdout })
  let executando = true

  try {
    while (executando) {
      console.log('\nSistema de Biblioteca')
      console.log('1. Cadastrar livro')
      console.log('2. Cadastrar usuário')
      console.log('3. Listar livros')
      console.log('4. Listar usuários')
      console.log('5. Registrar empréstimo')
      console.log('6. Registrar devolução')
      console.log('7. Listar empréstimos')
      console.log('8. Relatório de multas')
      console.log('9. Estatísticas')
      console.log('10. Filtrar livros por categoria')
      console.log('0. Sair')

      const opcao = (await terminal.question('Escolha uma opção: ')).trim()

      try {
        if (opcao === '1') {
          const livro = new Livro({
            id: randomUUID(),
            titulo: await terminal.question('Título: '),
            autor: await terminal.question('Autor: '),
            categoria: await terminal.question('Categoria: ')
          })
          biblioteca.cadastrarLivro(livro)
          console.log(`Livro cadastrado com identificador ${livro.id}`)
        } else if (opcao === '2') {
          const usuario = new Usuario({
            id: randomUUID(),
            nome: await terminal.question('Nome: '),
            matricula: await terminal.question('Matrícula: ')
          })
          biblioteca.cadastrarUsuario(usuario)
          console.log(`Usuário cadastrado com identificador ${usuario.id}`)
        } else if (opcao === '3') {
          exibirLista(biblioteca.consultarLivros().map((livro) => ({
            id: livro.id,
            titulo: livro.titulo,
            autor: livro.autor,
            categoria: livro.categoria,
            disponivel: biblioteca.livroDisponivel(livro.id)
          })))
        } else if (opcao === '4') {
          exibirLista(biblioteca.consultarUsuarios().map((usuario) => ({
            id: usuario.id,
            nome: usuario.nome,
            matricula: usuario.matricula
          })))
        } else if (opcao === '5') {
          const emprestimo = biblioteca.registrarEmprestimo({
            id: randomUUID(),
            idLivro: await terminal.question('Identificador do livro: '),
            idUsuario: await terminal.question('Identificador do usuário: '),
            dataEmprestimo: await terminal.question('Data do empréstimo (AAAA-MM-DD): '),
            dataPrevistaDevolucao: await terminal.question('Data prevista de devolução (AAAA-MM-DD): ')
          })
          console.log(`Empréstimo registrado com identificador ${emprestimo.id}`)
        } else if (opcao === '6') {
          const emprestimo = biblioteca.registrarDevolucao(
            await terminal.question('Identificador do empréstimo: '),
            await terminal.question('Data da devolução (AAAA-MM-DD): ')
          )
          console.log(`Devolução registrada em ${emprestimo.dataEfetivaDevolucao}`)
        } else if (opcao === '7') {
          exibirLista(biblioteca.consultarEmprestimos().map((emprestimo) => ({
            id: emprestimo.id,
            livro: emprestimo.livro.titulo,
            usuario: emprestimo.usuario.nome,
            dataEmprestimo: emprestimo.dataEmprestimo,
            dataPrevistaDevolucao: emprestimo.dataPrevistaDevolucao,
            dataEfetivaDevolucao: emprestimo.dataEfetivaDevolucao,
            ativo: emprestimo.ativo
          })))
        } else if (opcao === '8') {
          const dataReferencia = await terminal.question('Data de referência (AAAA-MM-DD): ')
          exibirLista([gerarRelatorioMultas(biblioteca.consultarEmprestimos(), dataReferencia)])
        } else if (opcao === '9') {
          const dataReferencia = await terminal.question('Data de referência (AAAA-MM-DD): ')
          console.log(JSON.stringify(gerarEstatisticas(
            biblioteca.consultarLivros(),
            biblioteca.consultarUsuarios(),
            biblioteca.consultarEmprestimos(),
            dataReferencia
          ), null, 2))
        } else if (opcao === '10') {
          const categoria = await terminal.question('Categoria: ')
          exibirLista(filtrarLivrosPorCategoria(biblioteca.consultarLivros(), categoria).map((livro) => ({
            id: livro.id,
            titulo: livro.titulo,
            autor: livro.autor,
            categoria: livro.categoria
          })))
        } else if (opcao === '0') {
          executando = false
        } else {
          console.log('Opção inválida.')
        }
      } catch (erro) {
        console.log(`Erro: ${erro.message}`)
      }
    }
  } finally {
    terminal.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await iniciarInterface()
}
