# Guia para a entrega individual manuscrita

Este guia serve para conferir os elementos dos diagramas e relacionar as questões ao projeto implementado. Não substitui a entrega: cada integrante deve desenhar os dois diagramas e escrever as cinco respostas individualmente, à mão, em papel A4 branco, sem pauta ou quadriculado, identificando cada folha com o nome completo.

## Diagrama 1 — Classes UML

Desenhe quatro caixas com o nome da classe, atributos e métodos relevantes. Use `-` para indicar atributos privados e `+` para indicar operações públicas.

### `Livro`

Atributos privados: `id`, `titulo`, `autor`, `categoria`.

Operações públicas: `constructor({ id, titulo, autor, categoria })` e os getters `id`, `titulo`, `autor`, `categoria`.

### `Usuario`

Atributos privados: `id`, `nome`, `matricula`.

Operações públicas: `constructor({ id, nome, matricula })` e os getters `id`, `nome`, `matricula`.

### `Emprestimo`

Atributos privados: `id`, `livro`, `usuario`, `dataEmprestimo`, `dataPrevistaDevolucao`, `dataEfetivaDevolucao`.

Operações públicas: construtor, getters desses dados, getter `ativo` e método `devolver(data)`, que retorna uma nova instância com a data efetiva de devolução.

### `Biblioteca`

Atributos privados: coleção de livros, coleção de usuários e coleção de empréstimos.

Operações públicas: `cadastrarLivro`, `cadastrarUsuario`, `consultarLivro`, `consultarUsuario`, `consultarLivros`, `consultarUsuarios`, `consultarEmprestimo`, `consultarEmprestimos`, `livroDisponivel`, `registrarEmprestimo` e `registrarDevolucao`.

### Relações e multiplicidades

- `Biblioteca` mantém zero ou muitos `Livro` (0..*), zero ou muitos `Usuario` (0..*) e zero ou muitos `Emprestimo` (0..*).
- Cada `Emprestimo` referencia exatamente um `Livro` (1) e exatamente um `Usuario` (1).
- Um `Usuario` pode estar associado a zero ou muitos `Emprestimo` ao longo do tempo (0..*).
- Um `Livro` pode aparecer em zero ou muitos empréstimos históricos (0..*), mas só pode estar associado a um empréstimo ativo por vez.

Mostre as associações com linhas e multiplicidades. Não desenhe `Relatorios` como uma quinta classe: os relatórios deste projeto são funções exportadas do módulo `src/functional/relatorios.js`.

## Diagrama 2 — Fluxo funcional do relatório de multas

Desenhe o fluxo da esquerda para a direita ou de cima para baixo, indicando as entradas, cada transformação e a saída. O fluxo implementado é:

1. **Entrada** — dados: coleção de empréstimos consultada na `Biblioteca` e data de referência no formato `AAAA-MM-DD`.
2. **Validação da data** — função auxiliar interna `converterData`; rejeita formato ou data inexistente. Não altera estado.
3. **Filtragem — `emprestimosAtrasados` / `filter`** — recebe os empréstimos e a data de referência; conserva somente empréstimos ativos cuja data prevista já passou; retorna uma nova coleção.
4. **Transformação — `map` em `gerarRelatorioMultas`** — para cada empréstimo atrasado, calcula dias de atraso e multa e cria um objeto com identificador, título do livro, nome do usuário, dias e multa.
5. **Agregação — `reduce` em `gerarRelatorioMultas`** — soma as multas dos itens transformados; retorna o total numérico.
6. **Saída** — objeto com data de referência, lista detalhada e total das multas.

Ao lado de cada bloco, anote: função/operação, dados recebidos, resultado e classificação. As etapas `filter`, `map` e `reduce` são funcionais e não alteram a coleção original. A consulta à `Biblioteca` obtém os dados do estado mantido em memória; o cálculo do relatório não modifica esse estado.

## Roteiro individual para as cinco questões

As respostas abaixo são orientações para estudar o próprio código, não respostas para copiar. Cada aluno deve explicar com suas palavras e citar nomes de funções ou classes reais.

### A) Função pura e transparência referencial

Escolha, por exemplo, `calcularMulta(diasAtraso, valorDiario)`. Explique quais são suas entradas e saída, que ela não consulta nem altera estado externo e por que as mesmas entradas dão o mesmo resultado. Também pode usar `calcularDiasAtraso`, que recebe as duas datas como parâmetros.

### B) Operação impura

Escolha uma operação que altere o estado, como `Biblioteca.registrarEmprestimo` ou `registrarDevolucao`. Identifique a coleção privada que ela modifica e explique por que a operação não é pura. Não confunda a mudança legítima do estado de gerenciamento com os cálculos puros do relatório.

### C) Imutabilidade

Considere os atributos privados dos modelos, o congelamento dos objetos e o fato de `Emprestimo.devolver` retornar outra instância. Explique também que os métodos de consulta de coleções retornam novos arrays e que os relatórios produzem novos resultados sem alterar os dados recebidos.

### D) Comparação imperativa e funcional

Compare `calcularTotalMultasImperativo` (laço, condicionais e acumulador) com `calcularTotalMultasFuncional` (relatório com `filter`, `map` e `reduce`). Comente legibilidade, manutenção, mutabilidade do acumulador e efeitos colaterais, usando as implementações reais.

### E) Dois usuários tentando retirar o mesmo livro

Explique que ambos poderiam observar o livro disponível antes de qualquer registro e tentar emprestá-lo. Neste programa, as chamadas síncronas na mesma instância JavaScript são executadas uma por vez, e a validação de disponibilidade ocorre antes do registro. Funções puras e imutabilidade ajudam a reduzir alterações inesperadas, mas, por si sós, não garantem exclusão mútua em uma versão concorrente, distribuída ou com vários processos. Nessa situação, seria necessário proteger a verificação e a gravação como uma operação atômica, por exemplo com transação ou mecanismo de bloqueio apropriado.

## Conferência antes de entregar

- Diagrama de classes coerente com `src/models` e `src/services/Biblioteca.js`.
- Fluxo do relatório com entrada, validação, `filter`, `map`, `reduce` e saída.
- Cinco respostas individuais escritas à mão, em papel A4 branco sem pauta.
- Nome completo visível nas folhas.
- Nenhum desenho impresso ou resposta digitada entregue como substituto dos manuscritos.
