export const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'shawarmas', label: 'Shawarmas' },
  { id: 'combos', label: 'Combos' },
  { id: 'acompanhamentos', label: 'Acompanhamentos' },
  { id: 'bebidas', label: 'Bebidas' }
];

export const products = [
  {
    id: 1,
    category: 'shawarmas',
    name: 'Capitão Clássico',
    description: 'Frango marinado, creme de alho, tomate, pepino e ervas no pão sírio tostado.',
    price: 29.9,
    badge: 'Mais pedido',
    accent: 'red',
    initials: 'CC',
    image: '/assets/shawarma-closeup.jpg',
    imagePosition: 'center 18%'
  },
  {
    id: 2,
    category: 'shawarmas',
    name: 'Viúva Picante',
    description: 'Carne bem temperada, tahine, cebola roxa e molho de pimenta defumada.',
    price: 32.9,
    badge: 'Picante',
    accent: 'gold',
    initials: 'VP',
    image: '/assets/shawarma-closeup.jpg',
    imagePosition: 'center 49%'
  },
  {
    id: 3,
    category: 'shawarmas',
    name: 'Hulk Duplo',
    description: 'Porção generosa de frango e falafel, salada crocante e molho verde da casa.',
    price: 36.9,
    badge: 'Fome de herói',
    accent: 'green',
    initials: 'HD',
    image: '/assets/shawarma-cc0.jpg',
    imagePosition: 'center 58%'
  },
  {
    id: 4,
    category: 'shawarmas',
    name: 'Thor do Oriente',
    description: 'Cordeiro desfiado, coalhada seca, cebola caramelizada e zaatar.',
    price: 38.9,
    badge: 'Especial',
    accent: 'blue',
    initials: 'TO',
    image: '/assets/shawarma-cc0.jpg',
    imagePosition: 'center 36%'
  },
  {
    id: 5,
    category: 'combos',
    name: 'Combo Os Vingadores',
    description: 'Dois shawarmas Capitão Clássico, batata zaatar, homus e duas bebidas.',
    price: 74.9,
    badge: 'Para dividir',
    accent: 'navy',
    initials: 'OV',
    image: '/assets/shawarma-closeup.jpg',
    imagePosition: 'center 30%'
  },
  {
    id: 6,
    category: 'combos',
    name: 'Combo Pós-Créditos',
    description: 'Capitão Clássico, batata crocante e refrigerante artesanal de romã.',
    price: 44.9,
    badge: 'Recomendado',
    accent: 'red',
    initials: 'PC',
    image: '/assets/shawarma-cc0.jpg',
    imagePosition: 'center center'
  },
  {
    id: 7,
    category: 'acompanhamentos',
    name: 'Batata Zaatar',
    description: 'Batatas rústicas, zaatar, páprica doce e maionese de alho.',
    price: 16.9,
    badge: 'Crocante',
    accent: 'gold',
    initials: 'BZ'
  },
  {
    id: 8,
    category: 'acompanhamentos',
    name: 'Homus Guardião',
    description: 'Homus cremoso com azeite, grão-de-bico crocante e pão sírio.',
    price: 14.9,
    badge: 'Veggie',
    accent: 'green',
    initials: 'HG'
  },
  {
    id: 9,
    category: 'bebidas',
    name: 'Poção de Romã',
    description: 'Soda artesanal de romã, limão e hortelã, servida bem gelada.',
    price: 9.9,
    badge: 'Gelada',
    accent: 'red',
    initials: 'PR'
  }
];

export const demoOrders = [
  {
    id: 'SH-2481',
    date: 'Hoje, 19:42',
    items: '1× Combo Pós-Créditos · 1× Poção de Romã',
    total: 54.8,
    status: 'A caminho',
    step: 3
  },
  {
    id: 'SH-2397',
    date: '12 de maio, 20:15',
    items: '1× Viúva Picante · 1× Batata Zaatar',
    total: 49.8,
    status: 'Entregue',
    step: 4
  }
];
