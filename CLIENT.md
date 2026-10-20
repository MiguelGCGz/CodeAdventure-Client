.
# CodeAdventure: Aventura pela Programacao — Client

## Objetivo

Aplicacao web educativa para criancas aprenderem logica e programacao atraves de desafios visuais, mundos e progressao por niveis. Este repositorio contem apenas o frontend; dados de conta e progresso persistente devem ser obtidos atraves da API do repositorio Server.

## Responsabilidades do Client

- Construir uma interface clara, acolhedora e adequada a criancas.
- Implementar as paginas de apresentacao, registo/login, dashboard, selecao de mundos, jogo e perfil.
- Apresentar mundos e niveis desbloqueados, objetivos, instrucoes e feedback de cada desafio.
- Implementar as interacoes de jogo: sequencias/padroes e labirintos; comandos de movimento; condicoes; repeticoes; organizacao de blocos; e, por fim, uma introducao a codigo JavaScript.
- Mostrar XP, estrelas, niveis concluidos, medalhas e percentagem de progresso devolvidos pela API.
- Comunicar com o Server para autenticacao, catalogo de niveis e registo/consulta de progresso. O Client nao acede diretamente a SQLite.
- Ser mobile-first e responsivo em computadores, tablets e telemoveis.

## Estrutura pedagogica prevista

1. **Mundo 1 — Pensamento Logico:** sequencias, padroes, associacao de imagens e labirintos simples.
2. **Mundo 2 — Algoritmos:** ordenar instrucoes de movimento para atingir um objetivo.
3. **Mundo 3 — Decisoes:** desafios visuais com `se`/`senao`, inicialmente sem codigo textual.
4. **Mundo 4 — Repeticoes:** simplificar sequencias usando repeticoes.
5. **Mundo 5 — Programacao por Blocos:** organizar comandos como mover, virar, repetir, se e senao.
6. **Mundo 6 — Introducao ao Codigo:** relacionar os blocos com exemplos de JavaScript.

Os desafios devem progredir gradualmente e explicar o objetivo em linguagem simples. A validacao de cada desafio deve produzir feedback compreensivel; a pontuacao e o resultado persistente devem ser sincronizados com a API.

## Paginas e experiencia

- **Inicio:** apresentacao do projeto e acesso para comecar.
- **Registo e login:** formularios para nome de utilizador e palavra-passe, com erros claros.
- **Dashboard:** XP, progresso, medalhas e proximo desafio.
- **Selecao de mundos:** mapa com mundos e niveis desbloqueados, concluidos ou bloqueados.
- **Jogo:** objetivo, area interativa, comandos/blocos disponiveis, executar/reiniciar, e resultado.
- **Perfil:** estatisticas e progresso do jogador.

## Roteiro de implementacao

O trabalho sera feito em incrementos pequenos, com uma pausa para revisao antes de avancar para a funcionalidade seguinte:

1. **Base do frontend:** estrutura React, navegacao, estilos base e layout responsivo.
2. **Autenticacao e entrada:** paginas de registo/login e ligacao aos endpoints do Server.
3. **Dashboard, perfil e mapa:** apresentacao do estado real da conta, progresso e desbloqueios.
4. **Mundos 1 e 2:** desafios de logica e sequencias de instrucoes.
5. **Mundos 3 e 4:** desafios de condicoes e repeticoes.
6. **Mundo 5:** editor/interacao de programacao por blocos.
7. **Mundo 6:** introducao ao codigo e relacao com os blocos.
8. **Integracao final:** validar fluxos completos, erros de API, acessibilidade basica e responsividade.

Cada incremento deve ter uma branch e commit proprios, testes/verificacoes adequados e revisao antes de iniciar o seguinte. Os commits ficam locais; nao fazer push para `main`.

## Fora do ambito inicial

Ranking, modo professor, graficos/analitica avancada, sons e animacoes adicionais ficam explicitamente adiados. O foco inicial e cumprir as funcionalidades principais descritas nesta proposta.

## Criterios de qualidade

- Componentes e paginas consistentes com os padroes existentes no projeto.
- Estados de carregamento, sucesso e erro visiveis; nao esconder falhas da API.
- Layout utilizavel em ecras pequenos, sem depender de Bootstrap.
- Testes para fluxos e interacoes importantes, conforme a estrutura de testes adotada.