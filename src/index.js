import { Livro } from './models/Livro.js'
import { Usuario } from './models/Usuario.js'
import { Biblioteca } from './services/Biblioteca.js'
import { gerarEstatisticas, gerarRelatorioMultas } from './functional/relatorios.js'

const biblioteca = new Biblioteca()
biblioteca.cadastrarLivro(new Livro({
  id: 'L1',
  titulo: 'Fundamentos de JavaScript',
  autor: 'Ana Silva',
  categoria: 'Programação'
}))
biblioteca.cadastrarUsuario(new Usuario({ id: 'U1', nome: 'Caio Santos', matricula: '2026001' }))
biblioteca.registrarEmprestimo({
  id: 'E1',
  idLivro: 'L1',
  idUsuario: 'U1',
  dataEmprestimo: '2026-11-01',
  dataPrevistaDevolucao: '2026-11-08'
})

const dataReferencia = '2026-11-11'
const relatorio = gerarRelatorioMultas(biblioteca.consultarEmprestimos(), dataReferencia)
const estatisticas = gerarEstatisticas(
  biblioteca.consultarLivros(),
  biblioteca.consultarUsuarios(),
  biblioteca.consultarEmprestimos(),
  dataReferencia
)

console.log(JSON.stringify({ relatorio, estatisticas }, null, 2))
