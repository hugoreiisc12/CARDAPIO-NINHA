# agent-tasks — protocolo de handoff Claude ↔ opencode

Esta pasta é o canal de coordenação entre os dois agentes de IA que trabalham neste
repositório em paralelo: **Claude Code** (tech lead — analisa, define tasks, revisa
e aprova) e **opencode** (executor — implementa o que está descrito em cada task).

Não faz parte do app (não é importado por nada em `src/`), é só coordenação de trabalho.

## Fluxo

0. **Antes de criar OU implementar qualquer task, consultar `SPEC/`.** Ver seção
   "SPEC obrigatório" abaixo — vale tanto para o Claude planejando quanto para o
   opencode implementando.
1. **Claude** cria um arquivo em `tasks/NNN-slug.md` descrevendo a task (contexto,
   arquivos, o que fazer, critério de aceite, e quais docs de `SPEC/` se aplicam).
   Status inicial: `pending`.
2. **opencode** implementa (consultando os docs de `SPEC/` indicados na task, ou
   outros que se apliquem). Ao terminar, edita o próprio arquivo da task:
   - muda `status` para `done` (ou `blocked` se não conseguir, com o motivo)
   - preenche a seção `## Implementação` com o que foi feito e quais arquivos tocou
   - adiciona uma linha em `STATUS.md` com data/hora, id da task e resumo de uma linha
3. **Claude** revisa (via `git diff` + o que está escrito na task) e registra o veredito
   na própria task, em `## Revisão`: `aprovado` ou lista do que falta ajustar.
4. Se `aprovado`, a task fica pronta para commit. Se não, volta pro opencode com o
   que falta, no mesmo arquivo.

## Convenções

- Um arquivo = uma task independente. Não empacotar várias tasks não relacionadas
  no mesmo arquivo.
- `severity`: `low` | `medium` | `high` — decidido pelo Claude ao criar a task.
- `status`: `pending` → `in_progress` (opcional, se o opencode quiser marcar que
  começou) → `done` | `blocked`.
- Nunca apagar tasks concluídas — elas são o histórico. `STATUS.md` é o índice
  cronológico rápido; o arquivo da task é a fonte completa.
- Se uma task depender de ação humana (ex.: exportar um asset do Rive Editor),
  ela **não** vai para esta pasta como task de código — fica documentada
  diretamente na conversa com o Hugo.

## SPEC obrigatório

Toda nova task — planejamento (Claude) ou execução (opencode) — consulta primeiro
os docs relevantes em `SPEC/` antes de decidir ou escrever qualquer código visual.
Qual doc usar depende do tipo de task:

| Task envolve... | Consultar |
|---|---|
| Qualquer componente/página/tela/`.pen` visual (cor, fonte, espaçamento, padrão de card/botão/sheet) | `SPEC/skill/ninha-brand/SKILL.md` — **fonte de verdade do projeto**, nunca inventar token novo |
| Decidir estilo/paleta/tipografia do zero (raro aqui, já temos `ninha-brand`, mas serve como checklist de UX/acessibilidade) | `SPEC/UI/UX.md` |
| Prototipagem exploratória / mockup navegável antes de virar código React | `SPEC/huashu.md` |
| Qualquer coisa com Rive (componentes, state machines, inputs, troubleshooting) | `SPEC/SKILL_RIVE.md` (referência completa), `SPEC/SKILL_3D.md` (resumo), `SPEC/skill_setup_guid.md` (setup/troubleshooting), `SPEC/skill_examples.tsx` (exemplos de código) |

Cada task criada em `tasks/NNN-slug.md` deve citar explicitamente qual(is) desses
docs se aplicam, na seção de contexto — não deixar implícito.
