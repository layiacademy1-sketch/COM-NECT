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
  category: 'restaurant' | 'coiffeur' | 'boutique' | 'photographe' | 'transport' | 'web/digital' | 'autre';
  island: Island;
  cityFrance: string;
  cityComoros: string;
  description: string;
  image: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  externalLink?: string;
  city?: string; // Optional link to a city
}

export interface Association {
  id: string;
  name: string;
  city: string;
  island: Island;
  description: string;
  logo?: string;
}

export interface City {
  id: string;
  name: string;
  island: Island;
  description: string;
  image: string;
}

export interface Ad {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export interface MarketplaceAd {
  id: string;
  title: string;
  category: 'logement' | 'véhicule' | 'mode' | 'emploi';
  price: string;
  description: string;
  image: string;
  contact: string;
}
