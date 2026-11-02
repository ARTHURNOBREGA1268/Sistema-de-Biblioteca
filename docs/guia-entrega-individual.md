# Guia para a entrega individual manuscrita

Este guia serve para conferir os elementos dos diagramas e relacionar as questões ao projeto implementado. Não substitui a entrega: cada integrante deve desenhar os dois diagramas e escrever as cinco respostas individualmente, à mão, em papel A4 branco, sem pauta ou quadriculado, identificando cada folha com o nome completo.

Há duas imagens de referência no projeto para ajudar a visualizar as relações e o fluxo: [`diagrama-classes.png`](referencias-visuais/diagrama-classes.png) e [`fluxo-relatorio-multas.png`](referencias-visuais/fluxo-relatorio-multas.png). Use-as somente para estudar e redesenhar os diagramas à mão; não as imprima para entregar.

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

No programa atual, `registrarEmprestimo` verifica a disponibilidade e registra o empréstimo em uma chamada síncrona, sem ceder o controle no meio. Na mesma instância e processo Node.js, uma chamada termina antes de outra começar: a primeira pode ser aceita e a seguinte deve encontrar o livro indisponível. Funções puras e imutabilidade, sozinhas, não garantem exclusão mútua em uma futura implementação concorrente, distribuída ou com estado compartilhado entre processos. Nesse cenário, a verificação e a gravação precisariam ser protegidas como uma operação atômica, por exemplo por transação ou mecanismo de bloqueio apropriado.

## Pontos para formular as respostas com suas próprias palavras

Use estes pontos para estudar; cada integrante deve construir sua própria resposta manuscrita, citando o código e demonstrando que o compreende.

- **A:** `calcularMulta(3)` retorna sempre `6` com o valor diário padrão de `2`. A função depende dos parâmetros, não altera coleções nem consulta estado global; por isso, o resultado pode substituir a chamada para aquelas entradas.
- **B:** `Biblioteca.registrarEmprestimo` consulta os dados e, quando válido, grava o objeto no mapa privado `#emprestimos`. O estado observável da biblioteca muda; chamadas posteriores podem ter outro resultado para o mesmo livro.
- **C:** os modelos guardam seus campos em propriedades privadas e congelam a instância; a devolução cria outro `Emprestimo`. Consultas retornam novos arrays e relatórios produzem novos objetos. A `Biblioteca`, por outro lado, precisa atualizar seus mapas nas operações de gerenciamento: a imutabilidade foi aplicada sobretudo aos modelos e ao processamento funcional, não significa que toda a aplicação seja imutável.
- **D:** a versão imperativa acumula o total em uma variável e controla as etapas com `for` e `if`; a versão funcional descreve a seleção, transformação e soma com `filter`, `map` e `reduce`. Ambas calculam o mesmo total, confirmado pelos testes. Compare a clareza para esse caso e o custo de localizar erros em cada abordagem.
- **E:** no fluxo síncrono atual, as chamadas não intercalam a verificação e a gravação na mesma instância: uma retirada deve ser registrada antes da próxima ser avaliada. Se o sistema passar a operar com processos ou serviços concorrentes compartilhando os dados, funções puras e imutabilidade não substituem uma transação ou bloqueio atômico.

## Conferência antes de entregar

- Diagrama de classes coerente com `src/models` e `src/services/Biblioteca.js`.
- Fluxo do relatório com entrada, validação, `filter`, `map`, `reduce` e saída.
- Cinco respostas individuais escritas à mão, em papel A4 branco sem pauta.
- Nome completo visível nas folhas.
- Nenhum desenho impresso ou resposta digitada entregue como substituto dos manuscritos.
