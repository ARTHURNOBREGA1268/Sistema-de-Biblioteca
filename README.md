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

Os dados são mantidos em memória e são apagados ao encerrar o programa.

## Integrantes

- Preencher com os nomes completos dos integrantes.
