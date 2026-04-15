import { Person, Professional, Event } from './types';

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
    externalLink: 'https://www.casinodeparis.fr/fr/Zily-22-Mai-2026-Billetterie-Paris'
  },
  {
    id: '2',
    title: 'SAYS’Z à la Cigale de Paris',
    date: 'Sam. 17 Oct. 2026',
    location: 'La Cigale, Paris',
    description: 'Concert exceptionnel du célèbre chanteur Comorien.',
    image: 'https://image.noelshack.com/fichiers/2026/16/3/1776274195-playtwo-artiste-saysz-600x900-2.jpg',
    externalLink: 'https://lacigale.fr/evenements/saysz/'
  }
];
