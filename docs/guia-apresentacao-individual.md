# Guia de ensaio — apresentação individual

O professor fará uma pergunta individual sobre o projeto. Use este material para praticar explicações com suas próprias palavras, apontando arquivos e comportamentos reais. Não é necessário decorar respostas; cada integrante deve entender o sistema completo.

## Perguntas para praticar

### 1. Como o sistema impede que um livro tenha dois empréstimos ativos?

Mostre `Biblioteca.livroDisponivel` e `Biblioteca.registrarEmprestimo` em `src/services/Biblioteca.js`. A disponibilidade é falsa se já existir um empréstimo ativo para o mesmo livro. A operação também verifica se o livro e o usuário existem antes de criar o empréstimo.

### 2. Como a devolução libera o livro sem alterar o objeto de empréstimo original?

Em `Emprestimo.devolver`, a data é validada e uma nova instância é retornada com `dataEfetivaDevolucao`. `Biblioteca.registrarDevolucao` substitui a referência armazenada no mapa. O objeto antigo continua representando o estado que tinha antes da devolução.

### 3. Onde estão `filter`, `map` e `reduce` no relatório de multas?

Em `src/functional/relatorios.js`, `emprestimosAtrasados` usa `filter` para manter somente empréstimos ativos vencidos. `gerarRelatorioMultas` usa `map` para criar os itens detalhados e `reduce` para somar as multas.

### 4. Como são calculados os dias e o valor da multa?

`calcularDiasAtraso` compara as datas no formato `AAAA-MM-DD` e retorna zero quando a data de referência não ultrapassa o vencimento. `calcularMulta` multiplica dias por valor diário, cujo padrão é R$ 2,00. O relatório considera apenas empréstimos ainda ativos.

### 5. Dê um exemplo de função pura e de operação impura.

`calcularMulta` é pura porque usa seus parâmetros, retorna um valor e não altera o estado da biblioteca. `Biblioteca.registrarEmprestimo` altera o mapa privado de empréstimos e, portanto, modifica o estado do sistema.

### 6. Como a imutabilidade aparece no projeto?

Os modelos usam atributos privados e congelam as instâncias; a devolução produz outro objeto; as consultas retornam novos arrays; e as funções de relatório criam novas coleções e objetos sem modificar os dados de entrada. A `Biblioteca` ainda precisa alterar seus mapas para executar cadastro e gerenciamento.

### 7. Como comparar as versões imperativa e funcional?

`calcularTotalMultasImperativo` percorre os empréstimos com `for`, usa condicionais e acumula o total. `calcularTotalMultasFuncional` obtém o total pelo fluxo do relatório funcional. Os testes verificam que os resultados coincidem para as mesmas entradas.

### 8. O que ocorre se dois usuários tentarem retirar o mesmo livro?

Na implementação atual, a verificação e a gravação são feitas numa chamada síncrona no mesmo processo Node.js; uma chamada termina antes de outra começar. Assim, a próxima chamada deve encontrar o livro indisponível. Funções puras e imutabilidade não substituem uma transação ou exclusão mútua se o sistema passar a operar com múltiplos processos ou serviço concorrente.

### 9. Como executar e testar o projeto?

Na raiz do repositório, `npm start` inicia o menu do terminal e `npm test` executa os testes nativos de `node:test`. Os dados são mantidos em memória e se perdem quando o programa termina.

## Exercício de ensaio

Cada integrante deve escolher perguntas diferentes, explicar a resposta em voz alta sem ler este texto e depois localizar no código a classe, função ou teste que confirma a explicação. Se não conseguir apontar o trecho ou descrever a regra com um exemplo, revise esse tópico antes da apresentação.
