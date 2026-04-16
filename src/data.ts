import { Person, Professional, Event, Association, City, Ad, MarketplaceAd } from './types';

export const MOCK_ADS: Ad[] = [
  {
    id: '1',
    title: 'ZORA BEAUTY',
    subtitle: 'Beauté et mode',
    image: 'https://image.noelshack.com/fichiers/2026/16/4/1776303766-generated-image-april-16-2026-3-38am.png',
    link: 'https://snapchat.com/t/7oq8cRqv'
  },
  {
    id: '2',
    title: 'ZEYRO',
    subtitle: 'Création de maillot',
    image: 'https://image.noelshack.com/fichiers/2026/16/4/1776302915-chatgpt-image-16-avr-2026-03-28-25.jpg',
    link: 'https://le-zeyro.com/'
  },
  {
    id: '3',
    title: 'LAYI AGENCY',
    subtitle: 'Passer votre compte Snapchat en professionnel.',
    image: 'https://image.noelshack.com/fichiers/2026/16/4/1776304295-photo-2026-04-16-03-50-41.jpg',
    link: 'https://www.snapchat.com/add/layiagency'
  },
  {
    id: '4',
    title: 'LA PLUME DE LA REUSSITE',
    subtitle: "Cours d'arabe",
    image: 'https://image.noelshack.com/fichiers/2026/16/4/1776305166-photo-2026-04-16-04-05-17.jpg',
    link: 'https://wa.me/33695826065'
  },
  {
    id: '5',
    title: 'C269',
    subtitle: 'Le sport aux Comores en temps réel.',
    image: 'https://image.noelshack.com/fichiers/2026/16/4/1776342293-photo-2026-04-16-14-23-56.jpg',
    link: 'https://www.facebook.com/c269.fr'
  }
];

export const MOCK_PEOPLE: Person[] = [
  {
    id: '1',
    firstName: 'Saïd',
    lastName: 'Ali',
    island: 'Grande Comore',
    cityFrance: 'Marseille',
    cityComoros: 'Moroni',
    description: 'Passionné par la culture comorienne et le développement web.',
    socials: { instagram: 'said_ali', tiktok: 'said_dev' }
  },
  {
    id: '2',
    firstName: 'Fatima',
    lastName: 'Moussa',
    island: 'Anjouan',
    cityFrance: 'Paris',
    cityComoros: 'Mutsamudu',
    description: 'Étudiante en médecine, j\'aime voyager et découvrir de nouveaux horizons.',
    socials: { instagram: 'fatima_m' }
  },
  {
    id: '3',
    firstName: 'Karim',
    lastName: 'Abdou',
    island: 'Mayotte',
    cityFrance: 'Lyon',
    cityComoros: 'Mamoudzou',
    description: 'Entrepreneur dans l\'import-export entre la France et les Comores.',
    socials: { snapchat: 'karim_biz' }
  },
  {
    id: '4',
    firstName: 'Nadia',
    lastName: 'Ibrahim',
    island: 'Mohéli',
    cityFrance: 'Nantes',
    cityComoros: 'Fomboni',
    description: 'Artiste peintre, je m\'inspire des paysages de mon île.',
    socials: { instagram: 'nadia_art' }
  },
  {
    id: '5',
    firstName: 'Ahmed',
    lastName: 'Bakari',
    island: 'Grande Comore',
    cityFrance: 'Paris',
    cityComoros: 'Moroni',
    description: 'Ingénieur civil, fier de ses origines.',
    socials: { instagram: 'ahmed_b' }
  }
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Le Saveur des Îles',
    category: 'restaurant',
    island: 'Grande Comore',
    cityFrance: 'Marseille',
    cityComoros: 'Moroni',
    description: 'Cuisine traditionnelle comorienne au cœur de Marseille.',
    image: 'https://picsum.photos/seed/restaurant1/400/300'
  },
  {
    id: '2',
    name: 'Style Comores',
    category: 'coiffeur',
    island: 'Anjouan',
    cityFrance: 'Paris',
    cityComoros: 'Mutsamudu',
    description: 'Coiffure et soins esthétiques spécialisés.',
    image: 'https://picsum.photos/seed/hair/400/300'
  },
  {
    id: '3',
    name: 'Com-Transport',
    category: 'transport',
    island: 'Les 4 îles',
    cityFrance: 'Lyon',
    cityComoros: 'Toutes',
    description: 'Transport de colis et logistique vers l\'archipel.',
    image: 'https://picsum.photos/seed/truck/400/300'
  },
  {
    id: '4',
    name: 'Moroni Tech',
    category: 'autre',
    island: 'Grande Comore',
    cityFrance: 'Paris',
    cityComoros: 'Moroni',
    description: 'Solutions informatiques et digitales.',
    image: 'https://picsum.photos/seed/tech/400/300'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'ZILY au Casino de Paris',
    date: '22 Mai 2026',
    location: 'Casino de Paris, Paris',
    description: 'Concert exceptionnel de la célèbre chanteuse Mahoraise.',
    image: 'https://image.noelshack.com/fichiers/2026/16/3/1776274008-vz-8af607df-839f-4bb3-9268-d6bf91052219.jpeg',
    externalLink: 'https://www.casinodeparis.fr/fr/Zily-22-Mai-2026-Billetterie-Paris',
    city: 'Moroni'
  },
  {
    id: '2',
    title: 'SAYS’Z à la Cigale de Paris',
    date: 'Sam. 17 Oct. 2026',
    location: 'La Cigale, Paris',
    description: 'Concert exceptionnel du célèbre chanteur Comorien.',
    image: 'https://image.noelshack.com/fichiers/2026/16/3/1776274195-playtwo-artiste-saysz-600x900-2.jpg',
    externalLink: 'https://lacigale.fr/evenements/saysz/',
    city: 'Moroni'
  }
];

export const MOCK_ASSOCIATIONS: Association[] = [
  {
    id: '1',
    name: 'Amicale de Moroni',
    city: 'Moroni',
    island: 'Grande Comore',
    description: 'Association culturelle et sociale pour les ressortissants de Moroni.',
    logo: 'https://picsum.photos/seed/assoc1/100/100'
  },
  {
    id: '2',
    name: 'Jeunesse Fomboni',
    city: 'Fomboni',
    island: 'Mohéli',
    description: 'Promotion du sport et de l\'éducation à Fomboni.',
    logo: 'https://picsum.photos/seed/assoc2/100/100'
  }
];

export const MOCK_CITIES: City[] = [
  {
    id: '1',
    name: 'Moroni',
    island: 'Grande Comore',
    description: 'La capitale des Comores, située sur la côte ouest de la Grande Comore.',
    image: 'https://picsum.photos/seed/moroni/800/400'
  },
  {
    id: '2',
    name: 'Mutsamudu',
    island: 'Anjouan',
    description: 'La capitale d\'Anjouan, connue pour sa citadelle et ses rues étroites.',
    image: 'https://picsum.photos/seed/mutsamudu/800/400'
  },
  {
    id: '3',
    name: 'Fomboni',
    island: 'Mohéli',
    description: 'La plus grande ville de Mohéli, calme et accueillante.',
    image: 'https://picsum.photos/seed/fomboni/800/400'
  },
  {
    id: '4',
    name: 'Mamoudzou',
    island: 'Mayotte',
    description: 'Le centre économique et administratif de Mayotte.',
    image: 'https://picsum.photos/seed/mamoudzou/800/400'
  }
];

export const MOCK_MARKETPLACE_ADS: MarketplaceAd[] = [
  {
    id: '1',
    title: 'Création de maillot',
    category: 'mode',
    price: 'À partir de 50€',
    description: 'Personnalisation de maillots de sport de haute qualité. Design unique pour clubs ou particuliers.',
    image: 'https://image.noelshack.com/fichiers/2026/16/4/1776302915-chatgpt-image-16-avr-2026-03-28-25.jpg',
    contact: '0757828250'
  }
];
