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
    title: 'Grand Mariage (Manzaraka)',
    date: '15 Juillet 2026',
    location: 'Salle des Fêtes, Marseille',
    description: 'Célébration traditionnelle avec danses et chants.',
    image: 'https://picsum.photos/seed/wedding/400/300'
  },
  {
    id: '2',
    title: 'Conférence Diaspora',
    date: '22 Août 2026',
    location: 'Espace Congrès, Paris',
    description: 'Réunion sur les opportunités d\'investissement aux Comores.',
    image: 'https://picsum.photos/seed/conf/400/300'
  }
];
