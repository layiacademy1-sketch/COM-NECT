/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  Home, 
  ChevronRight, 
  ChevronLeft,
  Instagram, 
  MessageCircle, 
  MapPin, 
  Globe, 
  Menu, 
  X,
  ArrowRight,
  Phone,
  Send,
  User,
  Lock,
  LogOut,
  ShoppingBag,
  Info,
  Car,
  Shirt,
  Tag
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  onSnapshot,
  orderBy,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { MOCK_PEOPLE, MOCK_PROFESSIONALS, MOCK_EVENTS, MOCK_CITIES, MOCK_ASSOCIATIONS, MOCK_ADS, MOCK_MARKETPLACE_ADS } from './data';
import { Island, Person, Professional, Event as ComEvent, City, Association, Ad, MarketplaceAd } from './types';

// --- Components ---

class ErrorBoundary extends Component<any, any> {
  state: any;
  props: any;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Une erreur inattendue est survenue.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error && parsed.error.includes("Missing or insufficient permissions")) {
          errorMessage = "Vous n'avez pas les permissions nécessaires pour effectuer cette action.";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
              <X size={40} />
            </div>
            <h1 className="text-2xl font-bold text-white">Oups !</h1>
            <p className="text-text-muted">{errorMessage}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'gold'; 
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  const variants = {
    primary: "bg-gold-500 text-black hover:bg-gold-600 shadow-lg shadow-gold-500/10",
    secondary: "bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm",
    outline: "border border-gold-500 text-gold-500 hover:bg-gold-500/5",
    gold: "bg-gold-500 text-black hover:bg-gold-600 shadow-lg shadow-gold-500/10"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void; key?: string | number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={`bg-white/[0.03] border-l-3 border-gold-500 rounded-2xl p-6 transition-all duration-200 hover:bg-white/[0.06] hover:-translate-y-0.5 ${className}`}
  >
    {children}
  </motion.div>
);

const Panel = ({ children, className = "", title, action }: { children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }) => (
  <div className={`bg-gray-dark rounded-[24px] panel-border p-6 flex flex-col ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-6">
        {title && <h3 className="text-lg font-semibold text-gold-500 uppercase tracking-wider">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

const Input = ({ label, ...props }: { label: string; [key: string]: any }) => (
  <div className="space-y-2">
    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <input 
        {...props}
        className="w-full bg-black border border-gold-500/30 rounded-full px-5 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors placeholder:text-white/20 text-sm"
      />
    </div>
  </div>
);

const Select = ({ label, options, ...props }: { label: string; options: string[]; [key: string]: any }) => (
  <div className="space-y-2">
    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">{label}</label>
    <select 
      {...props}
      className="w-full bg-black border border-gold-500/30 rounded-full px-5 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm appearance-none"
    >
      <option value="" className="bg-black text-white">Sélectionner...</option>
      {options.map(opt => (
        <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
      ))}
    </select>
  </div>
);

// --- Sections ---

const AdsCarousel = () => {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Duplicate ads for infinite scroll effect
  const ads = [...MOCK_ADS, ...MOCK_ADS, ...MOCK_ADS];

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full py-8 relative group/carousel">
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
      
      {/* Navigation Cursors */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/50 border border-gold-500/30 flex items-center justify-center text-gold-500 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-gold-500 hover:text-black shadow-2xl backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/50 border border-gold-500/30 flex items-center justify-center text-gold-500 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-gold-500 hover:text-black shadow-2xl backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      <div 
        ref={containerRef}
        className="w-full overflow-x-auto no-scrollbar flex gap-6 px-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <motion.div 
          className="flex gap-6 w-max"
          animate={isPaused ? {} : { x: ["0%", "-33.33%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {ads.map((ad, idx) => (
            <div 
              key={`${ad.id}-${idx}`}
              onClick={() => ad.link !== '#' && window.open(ad.link, '_blank')}
              className="w-48 h-64 bg-gray-dark rounded-2xl panel-border overflow-hidden relative group cursor-pointer hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 shrink-0"
            >
              {/* Diagonal Ribbon */}
              <div className="absolute top-3 -right-8 bg-gold-500 text-black text-[8px] font-black py-1 px-10 rotate-45 z-20 shadow-lg uppercase tracking-tighter">
                Sponsorisé
              </div>

              <div className="h-2/3 overflow-hidden">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              
              <div className="p-4 bg-linear-to-b from-gray-dark/80 to-gray-dark">
                <h4 className="text-sm font-bold text-white group-hover:text-gold-500 transition-colors line-clamp-1">{ad.title}</h4>
                <p className="text-[10px] text-text-muted mt-1 line-clamp-1">{ad.subtitle}</p>
                <div className="mt-2 flex items-center text-[8px] font-bold text-gold-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Visiter <ChevronRight size={10} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const HomeSection = ({ onNavigate }: { onNavigate: (view: string | { type: string; id: string }) => void }) => {
  const [events, setEvents] = useState<ComEvent[]>([]);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    if (showComingSoon) {
      const timer = setTimeout(() => setShowComingSoon(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showComingSoon]);

  const handleComingSoon = () => setShowComingSoon(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setEvents(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'events'));
    return () => unsub();
  }, []);

  const displayEvents = events.length > 0 ? events.slice(0, 4) : MOCK_EVENTS.slice(0, 4);

  return (
    <div className="space-y-10 pb-24 relative">
      {/* Coming Soon Toast */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-gold-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <Info size={18} /> Bientôt disponible
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <header className="hero flex flex-col items-center text-center space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full group-hover:bg-gold-500/30 transition-all duration-500" />
          <div className="relative p-1.5 rounded-full bg-linear-to-br from-gold-300 via-gold-500 to-gold-700 shadow-2xl shadow-gold-500/30">
            <img 
              src="https://image.noelshack.com/fichiers/2026/16/3/1776267673-chatgpt-image-15-avr-2026-16-27-27.png" 
              alt="Logo" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-full bg-black" 
              referrerPolicy="no-referrer" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold gold-text tracking-tight flex flex-col items-center">
            <span>BIENVENUE SUR</span>
            <span className="text-4xl md:text-5xl mt-2">COM-NECT</span>
          </h1>
          <p className="text-text-muted text-base max-w-2xl leading-relaxed mx-auto">
            Reliez-vous à vos racines. Retrouvez vos proches de Grande-Comore, Mayotte, Anjouan et Mohéli partout en France.
          </p>
          <div className="pt-4 flex justify-center">
            <Button 
              variant="gold" 
              className="px-10 py-4 text-sm font-bold uppercase tracking-widest rounded-full shadow-xl shadow-gold-500/20 hover:scale-105 transition-transform" 
              onClick={() => onNavigate('register')}
            >
              M'enregistrer
            </Button>
          </div>
        </div>
      </header>

      {/* Sponsored Ads Carousel */}
      <AdsCarousel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Panel title="prochains événements" action={<span className="bg-gold-500/10 text-gold-500 px-3 py-1 rounded-full text-[11px] font-bold uppercase cursor-pointer hover:bg-gold-500/20 transition-colors" onClick={() => onNavigate('events')}>Voir tout</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayEvents.map(event => (
                <div key={event.id} className="bg-white/[0.03] rounded-2xl p-4 border-l-3 border-gold-500 space-y-2 group cursor-pointer hover:bg-white/[0.06] transition-all" onClick={() => onNavigate('events')}>
                  <span className="bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Évènement</span>
                  <h4 className="font-semibold text-base group-hover:text-gold-500 transition-colors">{event.title}</h4>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">{event.date} • {event.location}</div>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel title="Trouver une personne">
              <div className="space-y-4">
                <div className="bg-black border border-gold-500/30 rounded-full px-5 py-3 flex items-center gap-3 text-text-muted">
                  <Search size={16} className="text-gold-500" />
                  <input type="text" className="bg-transparent border-none text-white w-full outline-none text-xs placeholder:text-white/20" placeholder="Nom, ville, île..." onClick={handleComingSoon} readOnly />
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1 py-2.5 text-xs" onClick={handleComingSoon}>Rechercher</Button>
                  <Button variant="outline" className="flex-1 py-2.5 text-xs" onClick={handleComingSoon}>Filtres</Button>
                </div>
              </div>
            </Panel>

            <Panel title="Trouver une association">
              <div className="space-y-4">
                <div className="bg-black border border-gold-500/30 rounded-full px-5 py-3 flex items-center gap-3 text-text-muted">
                  <Globe size={16} className="text-gold-500" />
                  <input type="text" className="bg-transparent border-none text-white w-full outline-none text-xs placeholder:text-white/20" placeholder="Ville ou mot clé..." onClick={handleComingSoon} readOnly />
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1 py-2.5 text-xs" onClick={handleComingSoon}>Rechercher</Button>
                  <Button variant="outline" className="flex-1 py-2.5 text-xs" onClick={handleComingSoon}>Villes</Button>
                </div>
              </div>
            </Panel>

            <Panel title="Trouver une entreprise">
              <div className="space-y-4">
                <div className="bg-black border border-gold-500/30 rounded-full px-5 py-3 flex items-center gap-3 text-text-muted">
                  <Briefcase size={16} className="text-gold-500" />
                  <input type="text" className="bg-transparent border-none text-white w-full outline-none text-xs placeholder:text-white/20" placeholder="Restaurant, coiffeur, photographe..." onClick={handleComingSoon} readOnly />
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1 py-2.5 text-xs" onClick={handleComingSoon}>Trouver une entreprise</Button>
                  <Button variant="outline" className="flex-1 py-2.5 text-xs" onClick={handleComingSoon}>Catégories</Button>
                </div>
              </div>
            </Panel>

            <Panel title="LE BON COIN DES COMORES" className="bg-linear-to-br from-gold-500/10 to-transparent border-gold-500/20">
              <div className="space-y-4">
                <p className="text-sm text-text-muted leading-relaxed">
                  Petites annonces, services et bonnes affaires entre membres de la communauté.
                </p>
                <Button variant="gold" className="w-full py-3 text-sm font-bold uppercase tracking-widest" onClick={() => onNavigate('boutique')}>
                  Entrer dans le Bon Coin
                </Button>
              </div>
            </Panel>
          </div>
        </div>

      <div className="space-y-8">
        <Panel title="Contact Direct">
          <div className="space-y-4">
            <p className="text-xs text-text-muted">Une question ? Un partenariat ? Contactez-nous directement.</p>
            <Button variant="outline" className="w-full" onClick={() => window.open('https://wa.me/33757828250', '_blank')}>
              <MessageCircle size={18} /> WhatsApp Support
            </Button>
          </div>
        </Panel>

        <Panel title="LE BON COIN DES COMORES" className="hidden lg:flex bg-linear-to-br from-gold-500/5 to-transparent">
          <div className="space-y-4">
            <p className="text-xs text-text-muted leading-relaxed">
              Retrouvez toutes les annonces de la communauté.
            </p>
            <Button variant="outline" className="w-full text-xs py-2" onClick={() => onNavigate('boutique')}>
              Accéder au Bon Coin
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  </div>
);
};

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Sections ---

const LoginSection = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim() || !password.trim()) {
      setError('Veuillez entrer votre pseudo et mot de passe.');
      return;
    }

    setLoading(true);
    setError('');

    // Admin check
    if (pseudo.trim() === 'membre' && password.trim() === '0612') {
      onLoginSuccess();
      setLoading(false);
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('pseudo', '==', pseudo.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Pseudo non trouvé.');
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.email;
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError('Identifiants incorrects ou erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-dark panel-border p-8 rounded-3xl space-y-8 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl border-2 border-gold-500 flex items-center justify-center text-gold-500 font-bold text-2xl mx-auto mb-4">C</div>
          <h2 className="text-2xl font-bold gold-text">Administration</h2>
          <p className="text-text-muted text-sm">Accès réservé</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gold-500/70 ml-1">Pseudo</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50 group-focus-within:text-gold-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-gold-500 transition-all"
                placeholder="Votre pseudo"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gold-500/70 ml-1">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50 group-focus-within:text-gold-500 transition-colors" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-gold-500 transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

          <Button variant="primary" className="w-full py-4 rounded-2xl text-base font-bold" type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Pas encore de compte ? <span className="text-gold-500 cursor-pointer hover:underline">Contactez l'administrateur</span>
        </p>
      </motion.div>
    </div>
  );
};

const BoutiqueSection = () => {
  const [activeCategory, setActiveCategory] = useState<'tous' | 'logement' | 'véhicule' | 'mode' | 'emploi'>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAd, setSelectedAd] = useState<MarketplaceAd | null>(null);

  const categories = [
    { id: 'tous', label: 'Tous', icon: Tag },
    { id: 'logement', label: 'Logement', icon: Home },
    { id: 'véhicule', label: 'Véhicule', icon: Car },
    { id: 'mode', label: 'Mode', icon: Shirt },
    { id: 'emploi', label: 'Emploi', icon: Briefcase },
  ];

  const filteredAds = MOCK_MARKETPLACE_ADS.filter(ad => {
    const matchesCategory = activeCategory === 'tous' || ad.category === activeCategory;
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold gold-text tracking-tight uppercase">Le Bon Coin des Comores</h1>
        <p className="text-text-muted text-lg">Petites annonces et services de la communauté</p>
      </header>

      {/* Search and Categories */}
      <div className="space-y-8">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" size={20} />
          <input 
            type="text" 
            placeholder="Que recherchez-vous ?" 
            className="w-full bg-white/5 border border-gold-500/20 rounded-full pl-14 pr-6 py-4 text-white focus:outline-none focus:border-gold-500 transition-all shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all border ${
                activeCategory === cat.id 
                  ? 'bg-gold-500 text-black border-gold-500 shadow-lg shadow-gold-500/20' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
              }`}
            >
              <cat.icon size={18} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAds.length > 0 ? (
          filteredAds.map((ad) => (
            <motion.div
              key={ad.id}
              layoutId={ad.id}
              onClick={() => setSelectedAd(ad)}
              className="group bg-white/[0.03] rounded-3xl overflow-hidden border border-white/5 hover:border-gold-500/50 transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={ad.image} 
                  alt={ad.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-gold-500 font-bold text-sm">{ad.price}</span>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold-500 font-bold">
                  <Tag size={10} />
                  {ad.category}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-gold-500 transition-colors">{ad.title}</h3>
                <p className="text-text-muted text-sm line-clamp-2 flex-grow">{ad.description}</p>
                <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-auto">
                  <span className="text-xs text-white/40">Contact direct</span>
                  <div className="flex items-center gap-1 text-gold-500 font-bold text-sm">
                    <Phone size={14} />
                    {ad.contact}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
              <Search size={32} />
            </div>
            <p className="text-text-muted">Aucune annonce ne correspond à votre recherche.</p>
          </div>
        )}
      </div>

      {/* Ad Detail Modal */}
      <AnimatePresence>
        {selectedAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAd(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              layoutId={selectedAd.id}
              className="relative w-full max-w-2xl bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedAd(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-gold-500 hover:text-black transition-all"
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                <img 
                  src={selectedAd.image} 
                  alt={selectedAd.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-500 font-bold">
                      <Tag size={12} />
                      {selectedAd.category}
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedAd.title}</h2>
                  </div>
                  <div className="text-2xl font-bold gold-text">{selectedAd.price}</div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">Présentation</h4>
                  <p className="text-text-muted leading-relaxed">{selectedAd.description}</p>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                  <a 
                    href={`tel:${selectedAd.contact}`}
                    className="flex-1 bg-gold-500 text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20"
                  >
                    <Phone size={20} />
                    Appeler ({selectedAd.contact})
                  </a>
                  <a 
                    href={`https://wa.me/${selectedAd.contact.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10"
                  >
                    <MessageCircle size={20} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RegistrationSection = () => {
  const [activeTab, setActiveTab] = useState<'particulier' | 'entreprise' | 'association'>('particulier');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    phone: '',
    snapchat: '',
    instagram: '',
    tiktok: '',
    island: '' as Island | '',
    country: '',
    cityResidence: '',
    cityComoros: '',
    grandeComoreCity: '',
    mayotteCity: '',
    anjouanCity: '',
    moheliCity: '',
    description: ''
  });

  const [entData, setEntData] = useState({
    name: '',
    email: '',
    phone: '',
    snapchat: '',
    instagram: '',
    tiktok: '',
    website: '',
    island: '' as Island | '',
    country: '',
    cityResidence: '',
    cityComoros: '',
    description: ''
  });

  const [assocData, setAssocData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    island: '' as Island | '',
    country: '',
    cityResidence: '',
    cityComoros: '',
    description: ''
  });

  const handleSubmit = (type: string, data: any) => {
    let message = `Bonjour, je souhaite m’enregistrer en tant que ${type.toUpperCase()} sur COM-NECT.\n\n`;
    
    if (type === 'particulier') {
      message += `Prénom : ${data.firstName}\n`;
      message += `Nom : ${data.lastName}\n`;
      if (data.nickname) message += `Surnom : ${data.nickname}\n`;
    } else {
      message += `Nom : ${data.name}\n`;
    }

    message += `Mail : ${data.email}\n`;
    if (data.phone) message += `Téléphone : ${data.phone}\n`;
    if (data.website) message += `Site : ${data.website}\n`;
    message += `Pays actuel : ${data.country}\n`;
    message += `Ville résidence actuelle : ${data.cityResidence}\n`;
    message += `Île d'origine : ${data.island}\n`;
    
    if (data.island === 'Les 4 îles') {
      message += `Ville à Grande Comore : ${data.grandeComoreCity}\n`;
      message += `Ville à Mayotte : ${data.mayotteCity}\n`;
      message += `Ville à Anjouan : ${data.anjouanCity}\n`;
      message += `Ville à Mohéli : ${data.moheliCity}\n`;
    } else {
      message += `Ville aux Comores : ${data.cityComoros}\n`;
    }
    
    if (data.description) message += `Description : ${data.description}\n`;

    const whatsappUrl = `https://wa.me/33757828250?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-32">
      <header className="hero space-y-4 text-center">
        <h1 className="text-4xl font-bold gold-text tracking-tight">M'enregistrer</h1>
        <p className="text-text-muted text-lg">Rejoignez la communauté COM-NECT.</p>
        
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <button 
            onClick={() => setActiveTab('particulier')}
            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all uppercase tracking-widest ${activeTab === 'particulier' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Particulier
          </button>
          <button 
            onClick={() => setActiveTab('entreprise')}
            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all uppercase tracking-widest ${activeTab === 'entreprise' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Entreprise
          </button>
          <button 
            onClick={() => setActiveTab('association')}
            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all uppercase tracking-widest ${activeTab === 'association' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Association
          </button>
        </div>
      </header>

      {activeTab === 'particulier' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('particulier', formData); }} className="space-y-8">
          <Panel title="Informations Personnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Prénom *" required value={formData.firstName} onChange={(e: any) => setFormData({...formData, firstName: e.target.value})} />
              <Input label="Nom *" required value={formData.lastName} onChange={(e: any) => setFormData({...formData, lastName: e.target.value})} />
              <Input label="Surnom" value={formData.nickname} onChange={(e: any) => setFormData({...formData, nickname: e.target.value})} />
              <Input label="Adresse Mail *" type="email" required value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
              <Input label="Numéro de téléphone" type="tel" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </Panel>

          <Panel title="Localisation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Pays actuel *" required value={formData.country} onChange={(e: any) => setFormData({...formData, country: e.target.value})} />
              <Input label="Ville résidence actuelle *" required value={formData.cityResidence} onChange={(e: any) => setFormData({...formData, cityResidence: e.target.value})} />
              <Select label="Île d'origine *" required options={['Grande Comore', 'Mayotte', 'Anjouan', 'Mohéli', 'Les 4 îles']} value={formData.island} onChange={(e: any) => setFormData({...formData, island: e.target.value})} />
              {formData.island && formData.island !== 'Les 4 îles' && (
                <Input label="Ville aux Comores *" required value={formData.cityComoros} onChange={(e: any) => setFormData({...formData, cityComoros: e.target.value})} />
              )}
            </div>
            {formData.island === 'Les 4 îles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-black/40 rounded-2xl border border-white/5">
                <Input label="Ville à Grande Comore *" required value={formData.grandeComoreCity} onChange={(e: any) => setFormData({...formData, grandeComoreCity: e.target.value})} />
                <Input label="Ville à Mayotte *" required value={formData.mayotteCity} onChange={(e: any) => setFormData({...formData, mayotteCity: e.target.value})} />
                <Input label="Ville à Anjouan *" required value={formData.anjouanCity} onChange={(e: any) => setFormData({...formData, anjouanCity: e.target.value})} />
                <Input label="Ville à Mohéli *" required value={formData.moheliCity} onChange={(e: any) => setFormData({...formData, moheliCity: e.target.value})} />
              </div>
            )}
          </Panel>

          <Panel title="Présentation">
            <textarea rows={4} className="w-full bg-black border border-gold-500/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm" placeholder="Dites-en un peu plus sur vous..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </Panel>

          <Button type="submit" variant="primary" className="w-full py-5 text-lg">
            <Send size={20} /> S'enregistrer (Particulier)
          </Button>
        </form>
      )}

      {activeTab === 'entreprise' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('entreprise', entData); }} className="space-y-8">
          <Panel title="Informations Entreprise">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nom de l'entreprise *" required value={entData.name} onChange={(e: any) => setEntData({...entData, name: e.target.value})} />
              <Input label="Adresse Mail" type="email" value={entData.email} onChange={(e: any) => setEntData({...entData, email: e.target.value})} />
              <Input label="Numéro de téléphone" type="tel" value={entData.phone} onChange={(e: any) => setEntData({...entData, phone: e.target.value})} />
              <Input label="Site internet" type="url" placeholder="https://..." value={entData.website} onChange={(e: any) => setEntData({...entData, website: e.target.value})} />
            </div>
          </Panel>

          <Panel title="Localisation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Pays actuel *" required value={entData.country} onChange={(e: any) => setEntData({...entData, country: e.target.value})} />
              <Input label="Ville résidence actuelle *" required value={entData.cityResidence} onChange={(e: any) => setEntData({...entData, cityResidence: e.target.value})} />
              <Select label="Île *" required options={['Grande Comore', 'Mayotte', 'Anjouan', 'Mohéli', 'Les 4 îles']} value={entData.island} onChange={(e: any) => setEntData({...entData, island: e.target.value})} />
              <Input label="Ville aux Comores" value={entData.cityComoros} onChange={(e: any) => setEntData({...entData, cityComoros: e.target.value})} />
            </div>
          </Panel>

          <Panel title="Présentation">
            <textarea rows={4} className="w-full bg-black border border-gold-500/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm" placeholder="Décrivez votre entreprise..." value={entData.description} onChange={(e) => setEntData({...entData, description: e.target.value})} />
          </Panel>

          <Button type="submit" variant="primary" className="w-full py-5 text-lg">
            <Send size={20} /> S'enregistrer (Entreprise)
          </Button>
        </form>
      )}

      {activeTab === 'association' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('association', assocData); }} className="space-y-8">
          <Panel title="Informations Association">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nom de l'association *" required value={assocData.name} onChange={(e: any) => setAssocData({...assocData, name: e.target.value})} />
              <Input label="Adresse Mail" type="email" value={assocData.email} onChange={(e: any) => setAssocData({...assocData, email: e.target.value})} />
              <Input label="Numéro de téléphone" type="tel" value={assocData.phone} onChange={(e: any) => setAssocData({...assocData, phone: e.target.value})} />
              <Input label="Site internet" type="url" placeholder="https://..." value={assocData.website} onChange={(e: any) => setAssocData({...assocData, website: e.target.value})} />
            </div>
          </Panel>

          <Panel title="Localisation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Pays actuel *" required value={assocData.country} onChange={(e: any) => setAssocData({...assocData, country: e.target.value})} />
              <Input label="Ville résidence actuelle *" required value={assocData.cityResidence} onChange={(e: any) => setAssocData({...assocData, cityResidence: e.target.value})} />
              <Select label="Île liée *" required options={['Grande Comore', 'Mayotte', 'Anjouan', 'Mohéli', 'Les 4 îles']} value={assocData.island} onChange={(e: any) => setAssocData({...assocData, island: e.target.value})} />
              <Input label="Ville aux Comores" value={assocData.cityComoros} onChange={(e: any) => setAssocData({...assocData, cityComoros: e.target.value})} />
            </div>
          </Panel>

          <Panel title="Présentation">
            <textarea rows={4} className="w-full bg-black border border-gold-500/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm" placeholder="Décrivez les buts de l'association..." value={assocData.description} onChange={(e) => setAssocData({...assocData, description: e.target.value})} />
          </Panel>

          <Button type="submit" variant="primary" className="w-full py-5 text-lg">
            <Send size={20} /> S'enregistrer (Association)
          </Button>
        </form>
      )}
    </div>
  );
};

const SearchSection = () => {
  const [activeTab, setActiveTab] = useState<'particulier' | 'entreprise' | 'association'>('particulier');
  const [query, setQuery] = useState('');
  const [islandFilter, setIslandFilter] = useState<Island | ''>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [pros, setPros] = useState<Professional[]>([]);
  const [assocs, setAssocs] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    if (showComingSoon) {
      const timer = setTimeout(() => setShowComingSoon(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showComingSoon]);

  const handleComingSoon = () => setShowComingSoon(true);

  useEffect(() => {
    const unsubPeople = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      const mapped = data.map(u => ({
        id: u.id,
        firstName: u.firstName || u.pseudo,
        lastName: u.lastName || '',
        island: u.island as Island,
        cityFrance: u.cityFrance || '',
        cityComoros: u.cityComoros || '',
        description: u.description || '',
        socials: {
          instagram: u.instagram,
          snapchat: u.snapchat,
          tiktok: u.tiktok
        }
      }));
      setPeople(mapped);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    const unsubPros = onSnapshot(collection(db, 'professionals'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setPros(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'professionals'));

    const unsubAssocs = onSnapshot(collection(db, 'associations'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setAssocs(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'associations'));

    return () => {
      unsubPeople();
      unsubPros();
      unsubAssocs();
    };
  }, []);

  const peopleResults = useMemo(() => {
    if (!hasSearched) return [];
    const source = people.length > 0 ? people : MOCK_PEOPLE;
    return source.filter(p => {
      const matchesQuery = !query || 
        p.firstName.toLowerCase().includes(query.toLowerCase()) ||
        p.lastName.toLowerCase().includes(query.toLowerCase()) ||
        p.cityFrance.toLowerCase().includes(query.toLowerCase()) ||
        p.cityComoros.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesIsland = !islandFilter || p.island === islandFilter;
      
      return matchesQuery && matchesIsland;
    });
  }, [query, islandFilter, hasSearched, people]);

  const proResults = useMemo(() => {
    if (!hasSearched) return [];
    const source = pros.length > 0 ? pros : MOCK_PROFESSIONALS;
    return source.filter(p => {
      const matchesQuery = !query || 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.cityFrance.toLowerCase().includes(query.toLowerCase()) ||
        p.cityComoros.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesIsland = !islandFilter || p.island === islandFilter;
      
      return matchesQuery && matchesIsland;
    });
  }, [query, islandFilter, hasSearched, pros]);

  const assocResults = useMemo(() => {
    if (!hasSearched) return [];
    const source = assocs.length > 0 ? assocs : MOCK_ASSOCIATIONS;
    return source.filter(a => {
      const matchesQuery = !query || 
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase()) ||
        a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.island.toLowerCase().includes(query.toLowerCase());
      
      const matchesIsland = !islandFilter || a.island === islandFilter;
      
      return matchesQuery && matchesIsland;
    });
  }, [query, islandFilter, hasSearched, assocs]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32 relative">
      {/* Coming Soon Toast */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-gold-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <Info size={18} /> Bientôt disponible
          </motion.div>
        )}
      </AnimatePresence>

      <header className="hero space-y-4 text-center">
        <h1 className="text-4xl font-bold gold-text tracking-tight uppercase">Recherche</h1>
        <p className="text-text-muted text-lg">Trouvez des membres, des professionnels ou des associations.</p>
        
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <button 
            onClick={() => setActiveTab('particulier')}
            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all uppercase tracking-widest ${activeTab === 'particulier' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Particuliers
          </button>
          <button 
            onClick={() => setActiveTab('entreprise')}
            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all uppercase tracking-widest ${activeTab === 'entreprise' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Entreprises
          </button>
          <button 
            onClick={() => setActiveTab('association')}
            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all uppercase tracking-widest ${activeTab === 'association' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            Associations
          </button>
        </div>
      </header>

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" size={18} />
            <input 
              type="text"
              placeholder={activeTab === 'particulier' ? "Nom, ville ou mot-clé..." : activeTab === 'entreprise' ? "Activité, ville..." : "Association, ville..."}
              className="w-full bg-black border border-gold-500/30 rounded-full pl-12 pr-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={handleComingSoon}
              readOnly
            />
          </div>
          <div onClick={handleComingSoon} className="cursor-pointer">
            <Select 
              label="" 
              options={['Grande Comore', 'Mayotte', 'Anjouan', 'Mohéli', 'Les 4 îles']}
              value={islandFilter}
              onChange={(e: any) => setIslandFilter(e.target.value)}
              disabled
            />
          </div>
        </div>
        <Button variant="primary" className="w-full mt-6" onClick={handleComingSoon}>
          Lancer la recherche
        </Button>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!hasSearched ? (
          <div className="col-span-full py-20 text-center space-y-4 bg-gray-dark rounded-[24px] panel-border">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gold-500/20">
              {activeTab === 'particulier' ? <Search size={40} /> : activeTab === 'professionnel' ? <Briefcase size={40} /> : <Globe size={40} />}
            </div>
            <p className="text-text-muted text-lg">Lancez une recherche pour voir les {activeTab === 'particulier' ? 'profils' : activeTab === 'entreprise' ? 'entreprises' : 'associations'} disponibles</p>
          </div>
        ) : (activeTab === 'particulier' ? peopleResults : activeTab === 'entreprise' ? proResults : assocResults).length > 0 ? (
          (activeTab === 'particulier' ? peopleResults : activeTab === 'entreprise' ? proResults : assocResults).map(item => (
            activeTab === 'particulier' ? (
              <Card key={item.id} className="space-y-6 group">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold group-hover:text-gold-500 transition-colors">{(item as Person).firstName} {(item as Person).lastName}</h3>
                    <div className="flex items-center gap-2 text-gold-500 text-[11px] font-bold uppercase tracking-wider">
                      <Globe size={12} /> {(item as Person).island}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(item as Person).socials.instagram && (
                      <a href={`https://instagram.com/${(item as Person).socials.instagram}`} target="_blank" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                        <Instagram size={18} />
                      </a>
                    )}
                    {(item as Person).socials.tiktok && (
                      <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                        <MessageCircle size={18} />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Ville résidence</span>
                    <p className="text-sm flex items-center gap-1.5"><MapPin size={14} className="text-gold-500" /> {(item as Person).cityFrance}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Ville aux Comores</span>
                    <p className="text-sm flex items-center gap-1.5"><Home size={14} className="text-gold-500" /> {(item as Person).cityComoros}</p>
                  </div>
                </div>

                <p className="text-sm text-white/60 leading-relaxed italic">
                  "{(item as Person).description}"
                </p>
              </Card>
            ) : activeTab === 'professionnel' ? (
              <div key={item.id} className="bg-gray-dark rounded-[24px] panel-border overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={(item as Professional).image} alt={(item as Professional).name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-gold-500 text-black text-[10px] font-bold uppercase tracking-widest">
                      {(item as Professional).category}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold group-hover:text-gold-500 transition-colors">{(item as Professional).name}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-text-muted flex items-center gap-2"><MapPin size={14} className="text-gold-500" /> {(item as Professional).cityFrance}</p>
                    <p className="text-sm text-text-muted flex items-center gap-2"><Globe size={14} className="text-gold-500" /> {(item as Professional).island}</p>
                  </div>
                  <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">{(item as Professional).description}</p>
                  <Button variant="outline" className="w-full text-xs py-2.5">Voir le profil</Button>
                </div>
              </div>
            ) : (
              <Card key={item.id} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                    {(item as Association).logo ? <img src={(item as Association).logo} alt={(item as Association).name} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <Globe size={28} className="text-gold-500/20" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{(item as Association).name}</h3>
                    <div className="flex items-center gap-1.5 text-gold-500 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={12} /> {(item as Association).city} • {(item as Association).island}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">{(item as Association).description}</p>
                <Button variant="outline" className="w-full py-2 text-xs">
                  Voir le profil
                </Button>
              </Card>
            )
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-6 bg-gray-dark rounded-[24px] panel-border">
            <p className="text-text-muted text-lg">Aucun résultat trouvé pour votre recherche.</p>
            <Button variant="outline" className="mx-auto" onClick={() => { setQuery(''); setIslandFilter(''); setHasSearched(false); }}>
              Réinitialiser
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};



const CitiesSection = ({ onNavigate }: { onNavigate: (cityId: string) => void }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    return MOCK_CITIES.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <header className="hero space-y-2 text-center">
        <h1 className="text-4xl font-bold gold-text tracking-tight">Villes des Comores</h1>
        <p className="text-text-muted text-lg">Découvrez les villes et villages de l'archipel.</p>
      </header>

      <Panel>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" size={18} />
          <input 
            type="text"
            placeholder="Rechercher une ville (ex: Moroni, Mutsamudu...)"
            className="w-full bg-black border border-gold-500/30 rounded-full pl-12 pr-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(city => (
          <div 
            key={city.id} 
            className="bg-gray-dark rounded-[24px] panel-border overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-300"
            onClick={() => onNavigate(city.id)}
          >
            <div className="relative h-48 overflow-hidden">
              <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-gold-500 text-black text-[10px] font-bold uppercase tracking-widest">
                  {city.island}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold group-hover:text-gold-500 transition-colors">{city.name}</h3>
              <p className="text-sm text-white/40 mt-2 line-clamp-2">{city.description}</p>
              <div className="mt-4 flex items-center text-gold-500 text-xs font-bold uppercase tracking-wider">
                Explorer la ville <ArrowRight size={14} className="ml-2" />
              </div>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-dark rounded-[24px] panel-border">
            <p className="text-text-muted text-lg">Aucune ville trouvée pour "{query}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CityDetailSection = ({ cityId, onBack }: { cityId: string; onBack: () => void }) => {
  const city = MOCK_CITIES.find(c => c.id === cityId);
  
  if (!city) return null;

  const members = MOCK_PEOPLE
    .filter(p => p.cityComoros === city.name)
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  const events = MOCK_EVENTS.filter(e => e.city === city.name);
  const professionals = MOCK_PROFESSIONALS.filter(p => p.cityComoros === city.name);
  const associations = MOCK_ASSOCIATIONS.filter(a => a.city === city.name);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <X size={16} /> Retour aux villes
      </button>

      <header className="relative h-[250px] md:h-[400px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl">
        <img src={city.image} alt={city.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <span className="px-4 py-1.5 rounded-full bg-gold-500 text-black text-xs font-bold uppercase tracking-widest mb-4 inline-block">
            {city.island}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{city.name}</h1>
          <p className="text-white/70 text-lg max-w-2xl mt-4 leading-relaxed">{city.description}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Members */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold gold-text flex items-center gap-3">
              <UserPlus size={24} /> Membres de {city.name} ({members.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map(member => (
                <Card key={member.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold">
                    {member.firstName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{member.firstName} {member.lastName}</h4>
                    <p className="text-xs text-text-muted">{member.cityFrance}</p>
                  </div>
                </Card>
              ))}
              {members.length === 0 && <p className="text-text-muted italic">Aucun membre inscrit pour le moment.</p>}
            </div>
          </section>

          {/* Events */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold gold-text flex items-center gap-3">
              <Calendar size={24} /> Évènements à venir
            </h2>
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="bg-white/[0.03] rounded-2xl p-6 panel-border flex gap-6 group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-gold-500 text-[10px] font-bold uppercase tracking-widest">{event.date}</span>
                    <h4 className="font-bold text-lg group-hover:text-gold-500 transition-colors">{event.title}</h4>
                    <p className="text-sm text-text-muted line-clamp-1">{event.description}</p>
                  </div>
                </div>
              ))}
              {events.length === 0 && <p className="text-text-muted italic">Aucun évènement prévu prochainement.</p>}
            </div>
          </section>

          {/* Associations */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold gold-text flex items-center gap-3">
              <Globe size={24} /> Associations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {associations.map(assoc => (
                <div key={assoc.id} className="bg-white/[0.03] rounded-2xl p-6 panel-border flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                    {assoc.logo ? <img src={assoc.logo} alt={assoc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <Globe size={32} className="text-gold-500/20" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{assoc.name}</h4>
                    <p className="text-xs text-text-muted mt-1">{assoc.description}</p>
                  </div>
                </div>
              ))}
              {associations.length === 0 && <p className="text-text-muted italic">Aucune association répertoriée.</p>}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* Professionals */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold gold-text flex items-center gap-3">
              <Briefcase size={24} /> Professionnels
            </h2>
            <div className="space-y-4">
              {professionals.map(pro => (
                <div key={pro.id} className="bg-white/[0.03] rounded-2xl p-4 panel-border group cursor-pointer hover:bg-white/[0.06] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <img src={pro.image} alt={pro.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-gold-500 transition-colors">{pro.name}</h4>
                      <span className="text-[10px] font-bold uppercase text-gold-500 tracking-widest">{pro.category}</span>
                    </div>
                  </div>
                </div>
              ))}
              {professionals.length === 0 && <p className="text-text-muted italic">Aucun professionnel répertorié.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const EventsSection = () => {
  const [events, setEvents] = useState<ComEvent[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setEvents(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'events'));
    return () => unsub();
  }, []);

  const displayEvents = events.length > 0 ? events : MOCK_EVENTS;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <header className="hero space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-bold gold-text tracking-tight">Évènements</h1>
          <p className="text-text-muted text-lg">Ne manquez rien de la vie communautaire.</p>
        </header>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayEvents.map(event => (
          <div key={event.id} className="bg-gray-dark rounded-[24px] panel-border overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-300">
            <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gold-500 text-[11px] font-bold uppercase tracking-widest">
                  <Calendar size={14} /> {event.date}
                </div>
                <h3 className="text-xl font-bold group-hover:text-gold-500 transition-colors">{event.title}</h3>
                <p className="text-sm text-text-muted flex items-center gap-2"><MapPin size={14} className="text-gold-500" /> {event.location}</p>
                <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">{event.description}</p>
              </div>
              <Button 
                variant="secondary" 
                className="w-full md:w-auto text-xs py-2.5"
                onClick={() => event.externalLink && window.open(event.externalLink, '_blank')}
              >
                Voir plus
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<string | { type: string; id: string }>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setIsAuthenticated(true);
      } else {
        // Fallback to local session check for the 2h requirement
        const sessionStr = localStorage.getItem('comnect_auth');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          const twoHours = 2 * 60 * 60 * 1000;
          if (Date.now() - session.timestamp < twoHours) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('comnect_auth');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNavigate = (newView: string | { type: string; id: string }) => {
    setView(newView);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('comnect_auth');
    setIsAuthenticated(false);
    setView('home');
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'events', label: 'Évènements', icon: Calendar },
    { id: 'boutique', label: 'Le Bon Coin', icon: ShoppingBag },
    { id: 'register', label: "S'enregistrer", icon: UserPlus },
  ];

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Bonjour, j'ai une question concernant COM-NECT.");
    window.open(`https://wa.me/33757828250?text=${message}`, '_blank');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col md:flex-row bg-black font-sans overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] bg-gray-dark sidebar-border flex-col p-10 justify-between sticky top-0 h-screen">
        <div className="space-y-12">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigate('home')}>
            <div className="w-8 h-8 rounded-lg border-2 border-gold-500 flex items-center justify-center text-gold-500 font-bold text-sm group-hover:bg-gold-500 group-hover:text-black transition-all">C</div>
            <span className="text-xl font-extrabold text-gold-500 tracking-tighter">COM-NECT</span>
          </div>
          
          <nav className="space-y-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 text-sm ${
                  view === item.id 
                    ? 'bg-linear-to-br from-gold-500 to-gold-600 text-black shadow-lg shadow-gold-500/20' 
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          {isAuthenticated && (
            <Button variant="outline" className="w-full border-red-500/30 text-red-500 hover:bg-red-500/5" onClick={handleLogout}>
              <LogOut size={18} /> Déconnexion
            </Button>
          )}
          <div className="opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={() => handleNavigate('login')} className="text-[10px] text-white/5 w-full text-left px-4">Admin</button>
          </div>
          <Button variant="primary" className="w-full" onClick={handleWhatsAppContact}>
            WhatsApp Contact
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 glass sticky top-0 z-50">
        <div className="flex items-center gap-2" onClick={() => handleNavigate('home')}>
          <div className="w-8 h-8 rounded-lg border-2 border-gold-500 flex items-center justify-center text-gold-500 font-bold">C</div>
          <span className="text-lg font-bold text-gold-500 tracking-tight">COM-NECT</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-xl font-semibold transition-all ${
                    view === item.id ? 'bg-gold-500 text-black' : 'text-white/80'
                  }`}
                >
                  <item.icon size={24} />
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 relative overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof view === 'string' ? view : view.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'home' && <HomeSection onNavigate={handleNavigate} />}
              {view === 'login' && <LoginSection onLoginSuccess={() => { setIsAuthenticated(true); setView('home'); }} />}
              {view === 'boutique' && <BoutiqueSection />}
              {view === 'register' && <RegistrationSection />}
              {view === 'search' && <SearchSection />}
              {view === 'events' && <EventsSection />}
              {view === 'cities' && <CitiesSection onNavigate={(id) => handleNavigate({ type: 'city', id })} />}
              {typeof view !== 'string' && view.type === 'city' && (
                <CityDetailSection cityId={view.id} onBack={() => handleNavigate('cities')} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* WhatsApp FAB */}
        <motion.button
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWhatsAppContact}
          className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-2xl shadow-[#25D366]/30 z-50"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793 0-.853.448-1.271.607-1.445.159-.175.347-.218.463-.218.116 0 .231.001.332.005.109.004.258-.041.405.314.159.386.543 1.32.593 1.42.05.1.084.216.012.357-.072.141-.108.23-.216.355-.108.125-.221.213-.318.332-.102.124-.209.26-.09.465.119.205.528.871 1.132 1.408.777.691 1.431.907 1.634 1.008.203.101.323.084.444-.055.121-.139.521-.606.66-.813.139-.207.278-.174.469-.104.191.071 1.211.572 1.419.677.208.105.347.158.397.245.05.088.05.511-.094.916z"/>
          </svg>
        </motion.button>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-6 py-4 flex justify-between items-center z-50 rounded-t-[2rem]">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${view === item.id ? 'text-gold-500 scale-110' : 'text-white/40'}`}
          >
            <item.icon size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
    </ErrorBoundary>
  );
}
