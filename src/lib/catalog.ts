import type { Category, Product } from "@/lib/menu-data";

// Fotos locais em src/assets/products/<slug>.jpg (migradas do iFood da Ninha em 2026-09-23).
const PHOTOS = import.meta.glob<string>("../assets/products/*.{jpg,svg}", {
  eager: true,
  import: "default",
});

function photo(slug: string) {
  const url = PHOTOS[`../assets/products/${slug}.jpg`] ?? PHOTOS[`../assets/products/${slug}.svg`];
  if (!url) throw new Error(`[catalog] foto não encontrada: src/assets/products/${slug}.jpg`);
  return url;
}

export const categories: Category[] = [
  {
    id: "sobremesas",
    label: "Sobremesas",
    eyebrow: "Doce na medida",
    products: [
      {
        id: "morango-cravejado",
        name: "Morango Cravejado",
        description:
          "Morango com brigadeiro de Ninho e cobertura de chocolate branco com crocante de caramelo vermelho. Um equilíbrio perfeito que você merece experimentar!",
        price: 21.99,
        image: photo("morango-cravejado"),
        featured: true,
        tags: ["Queridinho"],
      },
      {
        id: "capitao-jack",
        name: "Capitão Jack",
        description:
          "Nossa releitura da famosa torta americana gelada: camadas de calda de caramelo, creme de baunilha, caramelo salgado, castanhas crocantes, ganache de chocolate meio amargo e Ovomaltine!",
        price: 23,
        image: photo("capitao-jack"),
        featured: true,
        tags: ["Queridinho"],
      },
      {
        id: "crunchy-cake",
        name: "Crunchy Cake",
        description:
          "Massa de chocolate fofinha e molhadinha, cobertura de brigadeiro gourmet e uma generosa camada do chocolate crocante Pailleté Feuilletine. Explosão de crocância e cremosidade!",
        price: 24.99,
        image: photo("crunchy-cake"),
        featured: true,
        tags: ["Queridinho"],
      },
      {
        id: "slice-palha-italiana-supreme",
        name: "Slice Palha Italiana Supreme",
        description:
          "Massa de chocolate molhadinha recheada com brigadeiro gourmet e Palha Italiana de Ninho com Nutella, finalizada com um brigadeiro de palha por cima. Bem chocolatudo e cremoso!",
        price: 26.99,
        image: photo("slice-palha-italiana-supreme"),
      },
      {
        id: "slice-dupla-tentacao-crocante",
        name: "Slice Cake Dupla Tentação Crocante",
        description:
          "Massa de chocolate super fofinha com brigadeiro meio amargo e brigadeiro de maracujá, finalizada com a cobertura crocante do Crunchy Cake. O equilíbrio perfeito entre o doce e o azedinho.",
        price: 24.99,
        image: photo("slice-dupla-tentacao-crocante"),
      },
      {
        id: "slice-kinder-bueno",
        name: "Slice Kinder Bueno",
        description:
          "Massa de cacau black intensa, recheio de brigadeiro branco com chocolate e avelãs crocantes, e um segundo recheio de brigadeiro com Nutella e mais avelãs.",
        price: 26.99,
        image: photo("slice-kinder-bueno"),
      },
      {
        id: "pave-abacaxi-coco",
        name: "Pavê de Abacaxi com Côco",
        description: "Camadas de creme com côco, creme de Ninho com abacaxi e biscoitos.",
        price: 21.99,
        image: photo("pave-abacaxi-coco"),
      },
      {
        id: "pave-ninho-nutella",
        name: "Pavê Ninho com Nutella",
        description:
          "Camadas cremosas de brigadeiro de Ninho com chocolate branco e brigadeiro de chocolate com Nutella, cobertas com raspas de chocolate nobre.",
        price: 23.9,
        image: photo("pave-ninho-nutella"),
      },
      {
        id: "banoffe",
        name: "Banoffe",
        description:
          "Receita de família: base de biscoito amanteigado, creme de doce de leite, doce de leite caseiro com banana caramelizada e chantilly fresco.",
        price: 23.99,
        image: photo("banoffe"),
      },
      {
        id: "torta-de-limao",
        name: "Torta de Limão",
        description:
          "Nossa receita de família: massa amanteigada que derrete na boca, creme de limão e merengue gratinado com raspas de limão. Equilíbrio perfeito entre o doce e o cítrico.",
        price: 25.9,
        image: photo("torta-de-limao"),
      },
      {
        id: "pudim-de-sorvete",
        name: "Pudim de Sorvete com Calda de Chocolate (sem glúten)",
        description:
          "Sorvete à base de baunilha com calda de chocolate meio amargo. Dica: aqueça 5 segundos no micro-ondas para desenformar e despeje a calda por cima.",
        price: 16.9,
        image: photo("pudim-de-sorvete"),
      },
      {
        id: "mousse-de-chocolate",
        name: "Mousse de Chocolate (sem glúten)",
        description:
          "Cremosa e intensamente chocolatuda, feita com chocolate de alta qualidade e finalizada com raspas de chocolate.",
        price: 16.9,
        image: photo("mousse-de-chocolate"),
      },
      {
        id: "palha-italiana-ninho-nutella",
        name: "Palha Italiana Ninho com Nutella",
        description:
          "O toque cremoso do brigadeiro de Ninho com a intensidade da Nutella — a dupla perfeita para adoçar o seu dia!",
        price: 13.99,
        image: photo("palha-italiana-ninho-nutella"),
      },
      {
        id: "pudim",
        name: "Pudim",
        description:
          "Cremoso, sem nenhum furinho e com calda na medida certa. Experimente e apaixone-se!",
        price: 17.9,
        image: photo("pudim"),
      },
    ],
  },
  {
    id: "mini-bolo-vulcao",
    label: "Mini Bolo Vulcão",
    eyebrow: "Bombas de chocolate",
    products: [
      {
        id: "cenoura-com-brigadeiro",
        name: "Cenoura com Brigadeiro",
        description:
          'Carinhosamente chamado de "Caseirinho": massa de cenoura suave coberta com nosso brigadeiro gourmet cremoso.',
        price: 19.99,
        image: photo("cenoura-com-brigadeiro"),
      },
    ],
  },
  {
    id: "geladinho-gourmet",
    label: "Geladinhos Gourmet",
    eyebrow: "Refrescantes",
    products: [
      {
        id: "geladinho-pudim",
        name: "Geladinho Gourmet de Pudim",
        description:
          "O sabor clássico do pudim em versão geladinha, feito com pudim de verdade e aquela calda dourada.",
        price: 13.99,
        image: photo("geladinho-pudim"),
      },
      {
        id: "geladinho-ninho-morango",
        name: "Geladinho Ninho com Geleia de Morango",
        description: "O sabor cremoso do leite Ninho com o toque da geleia artesanal de morango.",
        price: 12.99,
        image: photo("geladinho-ninho-morango"),
      },
      {
        id: "geladinho-ferrero-rocher",
        name: "Geladinho Ferrero Rocher",
        description: "Geladinho gourmet sabor Ferrero Rocher.",
        price: 12.9,
        image: photo("geladinho-ferrero-rocher"),
      },
      {
        id: "geladinho-chocolate",
        name: "Geladinho de Chocolate",
        description: "Geladinho gourmet de chocolate.",
        price: 11.9,
        image: photo("geladinho-chocolate"),
      },
      {
        id: "geladinho-abacate",
        name: "Geladinho de Abacate",
        description: "Geladinho gourmet de abacate.",
        price: 10.99,
        image: photo("geladinho-abacate"),
      },
    ],
  },
  {
    id: "salgados",
    label: "Salgados",
    eyebrow: "Para todos os gostos",
    products: [
      {
        id: "quiche-alho-poro",
        name: "Quiche de Alho-Poró",
        description:
          "Leve, sofisticada e irresistível: massa leve, recheio cremoso e ingredientes selecionados.",
        price: 18,
        image: photo("quiche-alho-poro"),
      },
      {
        id: "quiche-frango",
        name: "Quiche de Frango",
        description:
          "Cremosa e super saborosa, perfeita para o lanche ou o jantar. Massa leve e recheio cremoso.",
        price: 18,
        image: photo("quiche-frango"),
      },
      {
        id: "quiche-calabresa",
        name: "Quiche de Calabresa",
        description:
          "Bem temperada e cheia de sabor. Massa leve, recheio cremoso e ingredientes selecionados.",
        price: 18,
        image: photo("quiche-calabresa"),
      },
      {
        id: "empadao-frango",
        name: "Empadão de Frango",
        description:
          "Massa amanteigada, leve e macia, com recheio farto de frango desfiado, requeijão cremoso e tempero caseiro.",
        price: 21.99,
        image: photo("empadao-frango"),
      },
      {
        id: "empadao-carne-seca",
        name: "Empadão de Carne Seca",
        description:
          "Massa amanteigada levemente dourada com recheio cremoso e generoso de carne seca, com aquele sabor caseiro de vó.",
        price: 22.99,
        image: photo("empadao-carne-seca"),
      },
      {
        id: "empadao-palmito",
        name: "Empadão de Palmito",
        description:
          "Massa amanteigada que derrete na boca e recheio generoso e cremoso de palmito.",
        price: 20.99,
        image: photo("empadao-palmito"),
      },
      {
        id: "empadinha-frango",
        name: "Empadinha de Frango",
        description: "Empadinha de massa amanteigada recheada com frango.",
        price: 11,
        image: photo("empadinha-frango"),
      },
      {
        id: "empadinha-carne-seca",
        name: "Empadinha de Carne Seca",
        description: "Empadinha de massa amanteigada recheada com carne seca.",
        price: 13,
        image: photo("empadinha-carne-seca"),
      },
      {
        id: "empadinha-palmito",
        name: "Empadinha de Palmito",
        description:
          "Massa amanteigada que derrete na boca e recheio generoso e cremoso de palmito.",
        price: 12,
        image: photo("empadinha-palmito"),
      },
    ],
  },
  {
    id: "bebidas",
    label: "Bebidas",
    eyebrow: "Para acompanhar",
    products: [
      {
        id: "coca-cola-sem-acucar-200ml",
        name: "Coca-Cola Sem Açúcar 200ml",
        description: "Garrafa 200ml.",
        price: 5.99,
        image: photo("coca-cola-sem-acucar-200ml"),
      },
      {
        id: "coca-cola-200ml",
        name: "Coca-Cola Original 200ml",
        description: "Garrafa 200ml.",
        price: 5.99,
        image: photo("coca-cola-200ml"),
      },
      {
        id: "coca-cola-220ml",
        name: "Coca-Cola 220ml",
        description: "Lata 220ml.",
        price: 7.5,
        image: photo("coca-cola-220ml"),
      },
      {
        id: "coca-cola-350ml",
        name: "Coca-Cola Original 350ml",
        description: "Lata 350ml.",
        price: 8.15,
        image: photo("coca-cola-350ml"),
      },
      {
        id: "coca-cola-sem-acucar-350ml",
        name: "Coca-Cola Sem Açúcar 350ml",
        description: "Lata 350ml.",
        price: 8.15,
        image: photo("coca-cola-sem-acucar-350ml"),
      },
      {
        id: "coca-cola-1-5l",
        name: "Coca-Cola Original 1,5L",
        description: "Garrafa 1,5L.",
        price: 17,
        image: photo("coca-cola-1-5l"),
      },
      {
        id: "guarana-guaravita-290ml",
        name: "Guaraná Natural Guaravita 290ml",
        description: "Embalagem 290ml.",
        price: 4.99,
        image: photo("guarana-guaravita-290ml"),
      },
      {
        id: "agua-com-gas-500ml",
        name: "Água Mineral com Gás 500ml",
        description: "Garrafa 500ml.",
        price: 5,
        image: photo("agua-com-gas-500ml"),
      },
      {
        id: "agua-sem-gas",
        name: "Água sem Gás",
        description: "Água mineral sem gás.",
        price: 4,
        image: photo("agua-sem-gas"),
      },
    ],
  },
];

export const featuredProducts: Product[] = categories
  .flatMap((c) => c.products)
  .filter((p) => p.featured);
