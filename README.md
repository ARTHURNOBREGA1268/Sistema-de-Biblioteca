# Sistema de Biblioteca

Projeto acadêmico em JavaScript com Node.js para gerenciamento de livros, usuários, empréstimos, devoluções, multas e relatórios. Os dados serão mantidos em memória.

## Requisitos

- Node.js 18 ou superior

## Executar

```bash
npm start
```

## Testar

```bash
npm test
```

## Estrutura

- `src/models`: entidades Livro, Usuario e Emprestimo.
- `src/services/Biblioteca.js`: cadastro, consulta, empréstimos, devoluções e disponibilidade.
- `src/functional/relatorios.js`: cálculos puros, filtragem, transformação e agregação de relatórios.
- `src/index.js`: ponto de entrada do programa.
- `test`: testes automatizados com `node:test`.

As operações que alteram o estado ficam na classe `Biblioteca`. Os modelos encapsulam seus atributos; devoluções substituem o empréstimo por uma nova instância. Cálculos e relatórios recebem seus dados e a data de referência como parâmetros, sem alterar as coleções originais.

## Funcionalidades implementadas

- Cadastro e consulta de livros e usuários.
- Registro de empréstimos com validação de disponibilidade e usuário cadastrado.
- Devolução com registro da data efetiva e liberação do livro.
- Validação de identificadores e datas.
- Datas informadas no formato `AAAA-MM-DD`.
- Modelos com atributos encapsulados; a devolução cria uma nova instância de empréstimo.
- Relatório de multas de empréstimos ativos atrasados com `filter`, `map` e `reduce`.
- Estatísticas de livros por categoria, empréstimos por usuário, empréstimos ativos, atrasados e multas totais.
- Comparação do total de multas nas versões imperativa e funcional.

Os dados são mantidos em memória e são apagados ao encerrar o programa.

## Regras de atraso

A data de referência deve estar no formato `AAAA-MM-DD`. Não há atraso na data prevista; a multa de R$ 2,00 por dia começa a contar no dia seguinte. O relatório considera apenas empréstimos ainda ativos.

## Demonstração

`npm start` abre um menu de terminal para cadastrar e consultar livros e usuários, registrar empréstimos e devoluções e gerar relatórios. Os identificadores são gerados automaticamente e exibidos após o cadastro. Os dados existem apenas durante a execução: ao sair, serão perdidos.

## Operações de relatório

- `filtrarLivrosPorCategoria(livros, categoria)` retorna uma nova coleção filtrada.
- `calcularDiasAtraso(dataPrevista, dataReferencia)` calcula os dias completos após o vencimento.
- `calcularMulta(diasAtraso, valorDiario)` calcula a multa sem efeitos colaterais; o valor diário padrão é R$ 2,00.
- `emprestimosAtrasados(emprestimos, dataReferencia)` seleciona empréstimos ativos vencidos.
- `gerarRelatorioMultas(emprestimos, dataReferencia)` retorna detalhamento e total, usando `filter`, `map` e `reduce`.
- `gerarEstatisticas(livros, usuarios, emprestimos, dataReferencia)` agrega as estatísticas exigidas.
- `calcularTotalMultasImperativo` e `calcularTotalMultasFuncional` permitem comparar os paradigmas.

## Integrantes

Integrantes do grupo:

- Arthur Nobrega Martins
- Hygor Gabriel Alves Montenegro

## Entrega individual manuscrita

O arquivo [`docs/guia-entrega-individual.md`](docs/guia-entrega-individual.md) resume os elementos do diagrama UML, o fluxo funcional do relatório e pontos para estudar as cinco questões. Ele é apenas uma referência: os diagramas e as respostas devem ser feitos individualmente à mão, conforme o enunciado.
