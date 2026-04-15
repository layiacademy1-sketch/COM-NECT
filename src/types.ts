export type Island = 'Grande Comore' | 'Mayotte' | 'Anjouan' | 'Mohéli' | 'Les 4 îles';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  island: Island;
  cityFrance: string;
  cityComoros: string;
  citiesIn4Islands?: {
    grandeComore: string;
    mayotte: string;
    anjouan: string;
    moheli: string;
  };
  description: string;
  socials: {
    instagram?: string;
    tiktok?: string;
    snapchat?: string;
  };
}

export interface Professional {
  id: string;
  name: string;
  category: 'restaurant' | 'coiffeur' | 'boutique' | 'photographe' | 'transport' | 'autre';
  island: Island;
  cityFrance: string;
  cityComoros: string;
  description: string;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  externalLink?: string;
}
