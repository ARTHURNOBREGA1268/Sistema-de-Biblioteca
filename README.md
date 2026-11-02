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
- `src/services`: gerenciamento e regras de negócio da Biblioteca.
- `src/functional`: funções puras e relatórios com operações funcionais.
- `src/index.js`: ponto de entrada do programa.
- `test`: testes automatizados com `node:test`.

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

`npm start` executa um exemplo e imprime o relatório de multas e as estatísticas em JSON.

## Integrantes

- Preencher com os nomes completos dos integrantes.
