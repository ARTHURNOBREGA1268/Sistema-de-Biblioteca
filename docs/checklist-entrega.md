# Checklist final — Sistema de Biblioteca

Use esta lista antes da entrega. Os itens marcados como individuais precisam ser conferidos e realizados por cada integrante.

## Entrega coletiva — projeto

- [x] Repositório GitHub criado e atualizado: `ARTHURNOBREGA1268/Sistema-de-Biblioteca`.
- [x] Código implementado em JavaScript com Node.js, sem banco de dados.
- [x] Classes `Livro`, `Usuario`, `Emprestimo` e `Biblioteca`.
- [x] Cadastro e consulta de livros e usuários.
- [x] Empréstimo com validação de registros e disponibilidade.
- [x] Devolução com registro de data e liberação do exemplar.
- [x] Reempréstimo permitido após a devolução.
- [x] Multa de R$ 2,00 por dia de atraso; relatório considera somente empréstimos ativos atrasados.
- [x] Funções puras de cálculo e operações de relatório sem alteração das coleções originais.
- [x] Uso de `filter`, `map` e `reduce` no relatório de multas.
- [x] Estatísticas agregadas com `reduce`.
- [x] Uma funcionalidade comparada nas versões imperativa e funcional.
- [x] Testes automatizados com `node:test`.
- [x] Os 17 testes passam com `npm test`.
- [x] Código-fonte sem comentários.
- [x] README contém linguagem, comandos, funcionalidades e os dois integrantes informados.
- [x] Menu de terminal executável com `npm start`.

## Entrega individual — fazer por cada aluno

- [ ] Fazer à mão o diagrama UML de classes em papel A4 branco sem pauta ou quadriculado.
- [ ] Fazer à mão o diagrama de fluxo funcional do relatório de multas, mostrando entradas, validação, `filter`, `map`, `reduce` e saída.
- [ ] Responder à mão às cinco questões A–E, individualmente, em papel A4 branco sem pauta ou quadriculado.
- [ ] Escrever o nome completo nas folhas.
- [ ] Conferir que os diagramas correspondem às classes e operações realmente implementadas.
- [ ] Responder com as próprias palavras e saber explicar o código na apresentação.

Consulte [`guia-entrega-individual.md`](guia-entrega-individual.md) para conferir os elementos dos diagramas e estudar as perguntas. O guia é referência; não substitui os manuscritos.

## Antes de apresentar

- [ ] Cada integrante executou `npm test` e sabe interpretar os testes.
- [ ] Cada integrante consegue executar `npm start` e demonstrar cadastro, empréstimo, devolução e relatórios.
- [ ] Cada integrante consegue explicar uma função pura, uma operação impura e o fluxo `filter`–`map`–`reduce`.
- [ ] Cada integrante consegue explicar as regras de disponibilidade, atraso e multa.
- [ ] Cada integrante consegue distinguir o comportamento síncrono atual de um cenário futuro com concorrência entre processos.

## Executar localmente

```bash
npm test
npm start
```

Os dados são mantidos somente durante a execução do programa; ao sair, são perdidos.
