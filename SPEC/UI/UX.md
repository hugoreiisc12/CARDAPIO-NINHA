---
name: uiux-pro-max
description: Base de conhecimento e conjunto de regras de decisão para design de UI/UX — estilos visuais, paletas de cores, tipografia, padrões de UX, anti-padrões e inteligência de design por segmento de mercado (fintech, saúde, e-commerce, educação, gaming, SaaS). USE ESTA SKILL sempre ANTES de gerar código de qualquer interface (HTML, React, mockup, protótipo, dashboard, landing page), para decidir estilo visual, paleta, tipografia, espaçamento e padrões de layout de forma justificada em vez de "adivinhar". Também use quando o usuário pedir uma paleta de cores, combinação tipográfica, checklist de acessibilidade/UX, ou perguntar "que estilo combina com meu produto". Combine com a skill `huashu-design` quando o pedido também envolver produzir o protótipo em si — Huashu executa, esta skill decide.
---
 
# UI/UX Pro Max
 
Função: fornecer a **inteligência de design** que precede a geração de código. Em vez de deixar as escolhas visuais ao acaso, esta skill estrutura a decisão em camadas — estilo, paleta, tipografia, componentes, espaçamento, animação — e adapta tudo isso ao segmento do produto.
 
Sempre que for gerar qualquer interface, siga esta sequência **antes** de escrever HTML/CSS/JSX:
 
## 1. Definir o estilo visual
 
Escolha (ou pergunte ao usuário entre) um repertório de estilos coerentes com o produto, por exemplo: Minimalista, Apple-like, Glassmorphism, Bento Grid, Neo Brutalism, Material Design, Futurista, Enterprise, Luxury, Gaming, Flat, Skeuomorphism sutil, Editorial/Magazine, Brutalist-tech, Organic/Soft UI. Não repita sempre o mesmo estilo padrão — varie conforme o contexto do pedido.
 
## 2. Definir a paleta de cores
 
Escolha uma paleta com propósito, não cores aleatórias. Estrutura mínima de uma paleta:
- 1 cor primária (marca/ação principal)
- 1-2 cores secundárias/de apoio
- Neutros (para texto, fundo, bordas) — geralmente uma escala de cinza/preto-azulado com 5-7 tons
- Cores semânticas: sucesso, erro, aviso, informação
- Garanta contraste suficiente entre texto e fundo (mínimo AA do WCAG: 4.5:1 para texto normal, 3:1 para texto grande)
## 3. Definir a tipografia
 
Escolha uma combinação (normalmente 1-2 famílias): uma para títulos/display e outra para corpo de texto, ou uma única família com pesos variados bem definidos. Evite mais de 2 famílias em um mesmo produto. Defina uma escala tipográfica consistente (ex: 12/14/16/20/24/32/48px) em vez de tamanhos arbitrários.
 
## 4. Componentes, espaçamento e padrões de layout
 
- Use uma escala de espaçamento consistente (ex: múltiplos de 4px ou 8px) — nunca valores arbitrários tipo 13px, 27px.
- Defina padrões de componente (botões, cards, inputs) e repita-os — inconsistência entre componentes similares é o anti-padrão mais comum.
- Para landing pages: hero → prova social/benefícios → detalhamento de features → prova (depoimentos/números) → CTA final. Adapte a ordem conforme o objetivo de conversão.
- Para dashboards: hierarquia clara entre métricas principais (destaque) e secundárias (suporte), gráficos com o tipo certo para o dado (linha para tendência temporal, barra para comparação categórica, pizza/donut só para poucas categorias e partes de um todo).
## 5. Inteligência por segmento
 
Adapte automaticamente estilo, paleta e tom conforme o setor do produto — não aplique o mesmo padrão visual a qualquer contexto:
 
| Segmento | Direção visual |
|---|---|
| **Fintech** | Aparência confiável, tons de azul/verde-escuro, CTAs discretos e sóbrios, dados numéricos com destaque claro |
| **Healthcare** | Visual limpo, alto contraste, forte foco em acessibilidade e legibilidade, tom calmo |
| **E-commerce** | CTAs destacados e de alta visibilidade, forte hierarquia visual em direção à compra, imagens de produto em destaque |
| **Educação** | Cores amigáveis e acolhedoras, layouts simples, baixa densidade de informação por tela |
| **Gaming** | Visual vibrante, alto contraste, elementos com profundidade/3D, tipografia expressiva |
| **SaaS/Enterprise** | Visual profissional, densidade de informação equilibrada, ênfase em produtividade e clareza de dados |
 
Quando o segmento do usuário não se encaixar nessas categorias, infira a direção certa pelo mesmo raciocínio: quem é o usuário final, qual emoção o produto precisa transmitir, qual o nível de confiança/urgência necessário.
 
## 6. UX incorporado (checklist obrigatório)
 
Ao entregar qualquer interface, verifique:
- [ ] Acessibilidade: contraste adequado, tamanhos de alvo de toque (mínimo ~44px), texto alternativo em ícones informativos
- [ ] Responsividade / mobile-first: o layout funciona em telas pequenas primeiro, depois escala
- [ ] Estados de erro e feedback visual: formulários mostram erro claro, ações têm confirmação/loading state
- [ ] Hierarquia da informação: o que é mais importante está visualmente mais destacado
- [ ] Densidade de conteúdo adequada ao contexto (dashboards toleram mais densidade que landing pages)
- [ ] Microinterações sutis (hover, foco, transições) sem exagero
## 7. Anti-padrões — nunca fazer
 
- Contraste insuficiente entre texto e fundo
- CTAs escondidos, pequenos demais, ou sem destaque visual claro
- Tipografia inadequada ao contexto (ex: fonte lúdica em app financeiro sério)
- Excesso de gradientes ou glassmorphism aplicado sem propósito
- Layouts confusos, sem grid consistente
- Espaçamento inconsistente entre elementos similares
- Cores incompatíveis ou sem relação semântica com a ação (ex: botão de "excluir" em verde)
- Excesso de efeitos visuais (sombras, blur, animação) que competem entre si
## Como aplicar esta skill na prática
 
1. Antes de gerar qualquer código de interface, responda internamente (ou explicite ao usuário, se for um pedido de consultoria): estilo, paleta, tipografia, padrões de layout — no formato do checklist acima — específicos para o segmento do produto.
2. Só depois disso, gere o código (via `huashu-design` para protótipos completos, ou diretamente se for um componente pontual).
3. Ao final, rode o checklist da seção 6 e 7 como revisão antes de entregar.