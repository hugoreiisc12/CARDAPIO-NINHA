# Guia de Configuração dos Assets Rive — Ninha Cakes

Todos os vetores dos doces artesanais foram exportados em formato SVG limpo para a pasta `public/animations/` para fácil importação no **Rive Desktop App**.

---

## Assets Exportados

| Doce | Arquivo SVG | Descrição |
| :--- | :--- | :--- |
| 🍩 **Donut** | [`donut.svg`](file:///Users/hugo/Desktop/CARDAPIO_NINHA/plum-sweet-menu/public/animations/donut.svg) | Donut com cobertura de morango e confeitos |
| 🍬 **Bombom** | [`bombom.svg`](file:///Users/hugo/Desktop/CARDAPIO_NINHA/plum-sweet-menu/public/animations/bombom.svg) | Bombom gourmet com espiral e forminha rosa |
| 🍭 **Pirulito** | [`pirulito.svg`](file:///Users/hugo/Desktop/CARDAPIO_NINHA/plum-sweet-menu/public/animations/pirulito.svg) | Pirulito espiral artesanal |
| 🍫 **Trufa** | [`trufa.svg`](file:///Users/hugo/Desktop/CARDAPIO_NINHA/plum-sweet-menu/public/animations/trufa.svg) | Trufa de chocolate belga maçaricada |

---

## Estrutura Recomendada no Rive Desktop App (`ninha.riv`)

### Artboards:
1. **`NinhaHero`** (Capa principal Hero):
   - Animação de entrada e queda flutuante dos doces.
   - Parallax reativo ao cursor.
2. **`NinhaCard`** (Cards de produtos):
   - Efeito de hover e rotação 3D sutil ao passar o cursor sobre o produto.
3. **`NinhaOrcamento`** (Banner de encomendas):
   - Brilhos cintilantes e movimento contínuo.

### Inputs da State Machine (`HeroCharacterMachine`):
- `pointerX` (Tipo: **Number**, Faixa: `0` a `100`): Posição X do cursor.
- `pointerY` (Tipo: **Number**, Faixa: `0` a `100`): Posição Y do cursor.
- `isHovered` (Tipo: **Boolean**): Ativado quando o usuário interage com o elemento Hero.

---

## Como Salvar o Arquivo Final
Após animar e ajustar no Rive Desktop, exportar como arquivo `.riv` binário diretamente para:
`public/animations/ninha.riv`
