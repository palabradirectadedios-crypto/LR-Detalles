import logoImg from '../assets/images/lr_detalles_logo_1790822338681.jpg';
import anchetaImg from '../assets/images/hero_ancheta_gourmet_1790822351013.jpg';
import floresEternasImg from '../assets/images/flores_eternas_satin_1790909962621.jpg';
import limpiapipasImg from '../assets/images/flores_limpiapipas_1790909976090.jpg';
import cajaRegaloImg from '../assets/images/caja_regalo_personalizada_1790909987938.jpg';
import desayunoImg from '../assets/images/desayuno_sorpresa_ancheta_1790822409835.jpg';
import preciosFloresImg from '../assets/images/tabla_precios_flores_eternas.svg';
import { Category, Product, StoreSettings } from '../types/catalog';

export const DEFAULT_LOGO = logoImg;

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'LR Detalles',
  tagline: 'Sorprende. Regala. Enamora.',
  whatsappNumber: '573105551234',
  instagramUsername: 'lr_detalles0',
  instagramUrl: 'https://www.instagram.com/lr_detalles0?stkn=MWx1aHcyYWttMGNtaA==',
  logoUrl: logoImg,
  currencySymbol: '$',
  currencyCode: 'COP',
  deliveryCoverage: 'Envíos personalizados solo en la ciudad de Montería',
  customGreetingMessage: '¡Hola LR Detalles! 🌸 Vi su catálogo digital y me gustaría consultar información sobre:',
  adminPin: '1991',
  flowerPricesImageUrl: preciosFloresImg,
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-flores-eternas',
    name: 'Flores Eternas',
    slug: 'flores-eternas',
    description: 'Ramos elaborados a mano en cinta satinada a tu gusto que duran para siempre.',
    iconName: 'Flower2',
    order: 1,
    priceListImageUrl: preciosFloresImg,
  },
  {
    id: 'cat-limpiapipas',
    name: 'Flores en Limpiapipas',
    slug: 'flores-en-limpiapipas',
    description: 'Hermosos ramos y flores artesanales moldeadas en limpiapipas de colores con detalles únicos.',
    iconName: 'Sparkles',
    order: 2,
  },
  {
    id: 'cat-anchetas',
    name: 'Anchetas',
    slug: 'anchetas',
    description: 'Cajas decoradas a tu gusto con peluches, flores, globos y hermosos detalles pensados para sorprender.',
    iconName: 'Gift',
    order: 3,
  },
  {
    id: 'cat-cajas-regalo',
    name: 'Cajas de Regalo',
    slug: 'cajas-de-regalo',
    description: 'Cajas sorpresa con fotografías, dedicatorias, dulces, luces cálidas y detalles únicos.',
    iconName: 'Package',
    order: 4,
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Ancheta Especial con Peluche & Taza Personalizada',
    categoryId: 'cat-anchetas',
    description: 'Hermosa ancheta artesanal en canasto blanco o bandeja decorada con cinta de satén rosa y toques dorados. Incluye peluche tierno, taza personalizada con nombre o frase especial, snacks y tarjeta con dedicatoria.',
    suggestedPrice: 120000,
    currency: 'COP',
    imageUrl: anchetaImg,
    includes: [
      'Peluche mediano suave antialérgico',
      'Taza personalizada de cerámica con frase o dedicatoria',
      'Bebida refrescante seleccionada',
      'Paquete de snacks gourmet y frutos secos',
      'Globo metalizado mini decorativo',
      'Tarjeta personalizada con mensaje emotivo',
      'Canastilla en mimbre blanco o caja decorada artesanal con lazo de lujo'
    ],
    tags: ['Amor & Aniversario', 'Cumpleaños', 'Más Vendido', 'Para Ella', 'Personalizado'],
    availability: 'disponible',
    isFeatured: true,
    leadTimeHours: 24,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'prod-2',
    title: 'Bouquet de Flores Eternas en Cinta Satinada con Luces LED',
    categoryId: 'cat-flores-eternas',
    description: 'Impresionante ramo de flores eternas confeccionadas a mano pétalo a pétalo en fina cinta de raso satinada en tonos rosa pastel y crema. Decorado con mariposas doradas 3D y serie de luces micro LED cálidas que jamás se marchitan.',
    suggestedPrice: 110000,
    currency: 'COP',
    imageUrl: floresEternasImg,
    includes: [
      '24 Rosas eternas hechas a mano en cinta satinada',
      'Serie de luces cálidas micro LED con batería incluida',
      'Mariposas doradas decorativas con detalles brillantes',
      'Papel coreano mate impermeable en degradé rosa y blanco con filo dorado',
      'Moño de seda de doble faz rosa palo',
      'Tarjeta de lujo personalizada'
    ],
    tags: ['Flores Eternas', 'Amor & Aniversario', 'Romántico', 'Para Ella', 'Destacado'],
    availability: 'disponible',
    isFeatured: true,
    leadTimeHours: 24,
    createdAt: '2026-09-02T11:00:00Z',
  },
  {
    id: 'prod-3',
    title: 'Ramo Artesanal de Flores en Limpiapipas',
    categoryId: 'cat-limpiapipas',
    description: 'Tierno y colorido ramo elaborado completamente a mano con técnica de limpiapipas suave (chenille) de alta calidad. Incluye tulipanes, margaritas y girasoles en tonos pasteles que nunca pierden su forma ni color.',
    suggestedPrice: 85000,
    currency: 'COP',
    imageUrl: limpiapipasImg,
    includes: [
      'Flores artesanales tejidas a mano en limpiapipas (tulipanes, margaritas y girasoles)',
      'Hojas y follaje verde suave en limpiapipas',
      'Envoltura floral en papel coreano translúcido y papel seda pastel',
      'Moño de cinta satinada rosa',
      'Tarjeta personalizada con dedicatoria especial'
    ],
    tags: ['Limpiapipas', 'Flores Eternas', 'Cumpleaños', 'Amistad', 'Detalles Especiales'],
    availability: 'disponible',
    isFeatured: true,
    leadTimeHours: 24,
    createdAt: '2026-09-03T12:00:00Z',
  },
  {
    id: 'prod-4',
    title: 'Caja de Regalo Sorpresa con Fotos Polaroid & Luces',
    categoryId: 'cat-cajas-regalo',
    description: 'Nuestra exclusiva caja de regalo rígida decorada con moño de satén de gran tamaño. Al abrirla, revela una guirnalda de fotografías estilo Polaroid con sus momentos favoritos iluminadas con luces LED y un tierno detalle en su interior.',
    suggestedPrice: 95000,
    currency: 'COP',
    imageUrl: cajaRegaloImg,
    includes: [
      'Caja de regalo rígida de lujo en color pastel',
      '6 Fotografías impresas tipo Polaroid personalizadas',
      'Ganchillos mini de madera y cuerda rústica decorativa',
      'Serie de luces micro LED cálidas',
      'Mini peluche tierno o llavero especial',
      'Tarjeta dedicatoria sellada',
      'Lazo de cinta satinada con filo dorado'
    ],
    tags: ['Personalizado', 'Amor & Aniversario', 'Cumpleaños', 'Para Él', 'Para Ella'],
    availability: 'disponible',
    isFeatured: true,
    leadTimeHours: 24,
    createdAt: '2026-09-04T08:00:00Z',
  },
  {
    id: 'prod-6',
    title: 'Globo Burbuja Personalizado con Flores Eternas & Luces',
    categoryId: 'cat-globos',
    description: 'Globo burbuja cristalino con mensaje personalizado en vinilo metalizado, base floral con rosas eternas en cinta satinada y luces micro LED que le otorgan un brillo mágico.',
    suggestedPrice: 95000,
    currency: 'COP',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    includes: [
      'Globo burbuja 24" inflado con helio certificado',
      'Frase personalizada en vinilo adhesivo dorado o blanco',
      'Serie de luces cálidas micro LED con interruptor',
      'Base decorativa con 6 rosas eternas en cinta de satén',
      'Cinta de raso rosa pastel con tarjeta'
    ],
    tags: ['Cumpleaños', 'Grados & Logros', 'Personalizado', 'Flores Eternas'],
    availability: 'disponible',
    isFeatured: true,
    leadTimeHours: 24,
    createdAt: '2026-09-06T14:00:00Z',
  },
  {
    id: 'prod-7',
    title: 'Ancheta Cervecera & Snacks Artesanales',
    categoryId: 'cat-anchetas',
    description: 'Diseñada especialmente para celebrar momentos especiales, con cervezas importadas, copa o vaso conmemorativo, snacks salados y empaque refinado con toques dorados.',
    suggestedPrice: 135000,
    currency: 'COP',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    includes: [
      '3 Cervezas seleccionadas (Corona o Stella Artois)',
      'Frasco de frutos secos caramelizados y maní especial',
      'Snacks crujientes seleccionados',
      'Destapador metálico con mango grabado',
      'Caja decorada con moño dorado y tarjeta personalizada'
    ],
    tags: ['Para Él', 'Cumpleaños', 'Agradecimiento'],
    availability: 'disponible',
    isFeatured: false,
    leadTimeHours: 24,
    createdAt: '2026-09-07T15:00:00Z',
  },
  {
    id: 'prod-8',
    title: 'Caja Sorpresa Hexagonal con Flores Eternas y Tarjetas',
    categoryId: 'cat-cajas-regalo',
    description: 'Elegante caja hexagonal con apertura de sorpresa múltiple, espacio para dedicatorias, fotografías y en el centro un arreglo de flores eternas en cinta satinada.',
    suggestedPrice: 105000,
    currency: 'COP',
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    includes: [
      'Caja hexagonal de niveles desplegables en cartón rígido rosa pastel',
      'Ramillete de flores eternas centrales',
      'Espacio con solapas para fotos y cartas dedicatorias',
      'Llavero o detalle sorpresa',
      'Tarjeta personalizada caligrafiada'
    ],
    tags: ['Cumpleaños', 'Amistad', 'Amor & Aniversario', 'Flores Eternas'],
    availability: 'disponible',
    isFeatured: false,
    leadTimeHours: 24,
    createdAt: '2026-09-08T17:00:00Z',
  }
];

export const PRESET_GALLERY_IMAGES = [
  { name: 'Flores Eternas en Cinta', url: floresEternasImg },
  { name: 'Flores en Limpiapipas', url: limpiapipasImg },
  { name: 'Caja de Regalo con Fotos', url: cajaRegaloImg },
  { name: 'Ancheta con Peluche y Taza', url: anchetaImg },
  { name: 'Globos Burbuja con Luces', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80' },
  { name: 'Caja Regalo y Moño Rosa', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80' },
  { name: 'Caja Hexagonal Sorpresa', url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80' }
];

export const AVAILABLE_TAGS = [
  'Amor & Aniversario',
  'Cumpleaños',
  'Flores Eternas',
  'Limpiapipas',
  'Personalizado',
  'Para Ella',
  'Para Él',
  'Sorpresa Matutina',
  'Grados & Logros',
  'Agradecimiento',
  'Detalles Especiales'
];
