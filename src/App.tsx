/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  Lock
} from 'lucide-react';
import { MOCK_PEOPLE, MOCK_PROFESSIONALS, MOCK_EVENTS, MOCK_CITIES, MOCK_ASSOCIATIONS, MOCK_ADS } from './data';
import { Island, Person, Professional, Event as ComEvent, City, Association, Ad } from './types';

// --- Components ---

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

const HomeSection = ({ onNavigate }: { onNavigate: (view: string | { type: string; id: string }) => void }) => (
  <div className="space-y-10 pb-24">
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
      </div>
    </header>

    {/* Sponsored Ads Carousel */}
    <AdsCarousel />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Panel title="prochains événements" action={<span className="bg-gold-500/10 text-gold-500 px-3 py-1 rounded-full text-[11px] font-bold uppercase cursor-pointer hover:bg-gold-500/20 transition-colors" onClick={() => onNavigate('events')}>Voir tout</span>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_EVENTS.slice(0, 4).map(event => (
              <div key={event.id} className="bg-white/[0.03] rounded-2xl p-4 border-l-3 border-gold-500 space-y-2 group cursor-pointer hover:bg-white/[0.06] transition-all" onClick={() => onNavigate('events')}>
                <span className="bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Évènement</span>
                <h4 className="font-semibold text-base group-hover:text-gold-500 transition-colors">{event.title}</h4>
                <div className="text-[11px] text-text-muted uppercase tracking-wider">{event.date} • {event.location}</div>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Trouver un membre">
          <div className="space-y-4">
            <div className="bg-black border border-gold-500/30 rounded-full px-5 py-3 flex items-center gap-3 text-text-muted">
              <Search size={16} className="text-gold-500" />
              <input type="text" className="bg-transparent border-none text-white w-full outline-none text-xs placeholder:text-white/20" placeholder="Nom, ville, île..." onClick={() => onNavigate('search')} readOnly />
            </div>
            <Button variant="primary" className="w-full py-2.5 text-xs" onClick={() => onNavigate('search')}>Rechercher</Button>
          </div>
        </Panel>

        <Panel title="Trouver un professionnel">
          <div className="space-y-4">
            <div className="bg-black border border-gold-500/30 rounded-full px-5 py-3 flex items-center gap-3 text-text-muted">
              <Briefcase size={16} className="text-gold-500" />
              <input type="text" className="bg-transparent border-none text-white w-full outline-none text-xs placeholder:text-white/20" placeholder="Restaurant, coiffeur, photographe..." onClick={() => onNavigate('search')} readOnly />
            </div>
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1 py-2.5 text-xs" onClick={() => onNavigate('search')}>Trouver un pro</Button>
              <Button variant="outline" className="flex-1 py-2.5 text-xs" onClick={() => onNavigate('search')}>Catégories</Button>
            </div>
          </div>
        </Panel>
      </div>

      <div className="space-y-8">
        <Panel title="Devenir Membre" className="bg-linear-to-br from-gold-500/10 to-transparent border-gold-500/20">
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            Enregistrez-vous dès maintenant pour être visible dans votre communauté et être informé des actualités de votre île.
          </p>
          <Button variant="primary" className="w-full shadow-gold-500/20" onClick={() => onNavigate('register')}>
            S'enregistrer via WhatsApp
          </Button>
        </Panel>

        <Panel title="Contact Direct">
          <div className="space-y-4">
            <p className="text-xs text-text-muted">Une question ? Un partenariat ? Contactez-nous directement.</p>
            <Button variant="outline" className="w-full" onClick={() => window.open('https://wa.me/33757828250', '_blank')}>
              <MessageCircle size={18} /> WhatsApp Support
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  </div>
);

const LoginSection = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'authentification
    // Pour l'instant, on accepte n'importe quel pseudo/password non vide
    if (pseudo.trim() && password.trim()) {
      const session = {
        pseudo,
        timestamp: Date.now()
      };
      localStorage.setItem('comnect_auth', JSON.stringify(session));
      onLoginSuccess();
    } else {
      setError('Veuillez entrer votre pseudo et mot de passe.');
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
          <h2 className="text-2xl font-bold gold-text">Espace Membre</h2>
          <p className="text-text-muted text-sm">Connectez-vous pour accéder à la recherche</p>
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
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

          <Button variant="primary" className="w-full py-4 rounded-2xl text-base font-bold" type="submit">
            Se connecter
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Pas encore de compte ? <span className="text-gold-500 cursor-pointer hover:underline">Contactez l'administrateur</span>
        </p>
      </motion.div>
    </div>
  );
};

const RegistrationSection = () => {
  const [activeTab, setActiveTab] = useState<'particulier' | 'professionnel'>('particulier');
  
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
    cityFrance: '',
    cityComoros: '',
    grandeComoreCity: '',
    mayotteCity: '',
    anjouanCity: '',
    moheliCity: '',
    description: ''
  });

  const [proData, setProData] = useState({
    name: '',
    email: '',
    phone: '',
    snapchat: '',
    instagram: '',
    tiktok: '',
    website: '',
    island: '' as Island | '',
    cityFrance: '',
    cityComoros: '',
    description: ''
  });

  const handleSubmitParticulier = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `Bonjour, je souhaite m’enregistrer en tant que PARTICULIER sur COM-NECT.\n\n`;
    message += `Prénom : ${formData.firstName}\n`;
    message += `Nom : ${formData.lastName}\n`;
    if (formData.nickname) message += `Surnom : ${formData.nickname}\n`;
    message += `Mail : ${formData.email}\n`;
    if (formData.phone) message += `Téléphone : ${formData.phone}\n`;
    if (formData.snapchat) message += `Snapchat : ${formData.snapchat}\n`;
    if (formData.instagram) message += `Instagram : ${formData.instagram}\n`;
    if (formData.tiktok) message += `TikTok : ${formData.tiktok}\n`;
    message += `Île choisie : ${formData.island}\n`;
    message += `Ville en France : ${formData.cityFrance}\n`;
    
    if (formData.island === 'Les 4 îles') {
      message += `Ville à Grande Comore : ${formData.grandeComoreCity}\n`;
      message += `Ville à Mayotte : ${formData.mayotteCity}\n`;
      message += `Ville à Anjouan : ${formData.anjouanCity}\n`;
      message += `Ville à Mohéli : ${formData.moheliCity}\n`;
    } else {
      message += `Ville aux Comores : ${formData.cityComoros}\n`;
    }
    
    if (formData.description) message += `Description : ${formData.description}\n`;

    const whatsappUrl = `https://wa.me/33757828250?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitProfessionnel = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `Bonjour, je souhaite m’enregistrer en tant que PROFESSIONNEL sur COM-NECT.\n\n`;
    message += `Nom de l'activité : ${proData.name}\n`;
    if (proData.email) message += `Mail : ${proData.email}\n`;
    if (proData.phone) message += `Téléphone : ${proData.phone}\n`;
    if (proData.snapchat) message += `Snapchat : ${proData.snapchat}\n`;
    if (proData.instagram) message += `Instagram : ${proData.instagram}\n`;
    if (proData.tiktok) message += `TikTok : ${proData.tiktok}\n`;
    if (proData.website) message += `Site internet : ${proData.website}\n`;
    message += `Île : ${proData.island}\n`;
    message += `Ville en France : ${proData.cityFrance}\n`;
    message += `Ville aux Comores : ${proData.cityComoros}\n`;
    if (proData.description) message += `Présentation de l'activité : ${proData.description}\n`;

    const whatsappUrl = `https://wa.me/33757828250?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-32">
      <header className="hero space-y-4 text-center">
        <h1 className="text-4xl font-bold gold-text tracking-tight">M'enregistrer</h1>
        <p className="text-text-muted text-lg">Rejoignez la communauté COM-NECT.</p>
        
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={() => setActiveTab('particulier')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'particulier' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            👉 Particulier
          </button>
          <button 
            onClick={() => setActiveTab('professionnel')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'professionnel' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            👉 Professionnel
          </button>
        </div>
      </header>

      {activeTab === 'particulier' ? (
        <form onSubmit={handleSubmitParticulier} className="space-y-8">
          <Panel title="Informations Personnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Prénom *" 
                required 
                value={formData.firstName}
                onChange={(e: any) => setFormData({...formData, firstName: e.target.value})}
              />
              <Input 
                label="Nom *" 
                required 
                value={formData.lastName}
                onChange={(e: any) => setFormData({...formData, lastName: e.target.value})}
              />
              <Input 
                label="Surnom" 
                value={formData.nickname}
                onChange={(e: any) => setFormData({...formData, nickname: e.target.value})}
              />
              <Input 
                label="Adresse Mail *" 
                type="email"
                required
                value={formData.email}
                onChange={(e: any) => setFormData({...formData, email: e.target.value})}
              />
              <Input 
                label="Numéro de téléphone" 
                type="tel"
                value={formData.phone}
                onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </Panel>

          <Panel title="Réseaux Sociaux">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="Snapchat" 
                value={formData.snapchat}
                onChange={(e: any) => setFormData({...formData, snapchat: e.target.value})}
              />
              <Input 
                label="Instagram" 
                value={formData.instagram}
                onChange={(e: any) => setFormData({...formData, instagram: e.target.value})}
              />
              <Input 
                label="TikTok" 
                value={formData.tiktok}
                onChange={(e: any) => setFormData({...formData, tiktok: e.target.value})}
              />
            </div>
          </Panel>

          <Panel title="Localisation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Île *" 
                required
                options={['Grande Comore', 'Mayotte', 'Anjouan', 'Mohéli', 'Les 4 îles']}
                value={formData.island}
                onChange={(e: any) => setFormData({...formData, island: e.target.value})}
              />
              <Input 
                label="Ville en France *" 
                required
                value={formData.cityFrance}
                onChange={(e: any) => setFormData({...formData, cityFrance: e.target.value})}
              />
              
              {formData.island && formData.island !== 'Les 4 îles' && (
                <Input 
                  label="Ville aux Comores *" 
                  required
                  value={formData.cityComoros}
                  onChange={(e: any) => setFormData({...formData, cityComoros: e.target.value})}
                />
              )}
            </div>

            {formData.island === 'Les 4 îles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-black/40 rounded-2xl border border-white/5">
                <Input 
                  label="Ville à Grande Comore *" 
                  required
                  value={formData.grandeComoreCity}
                  onChange={(e: any) => setFormData({...formData, grandeComoreCity: e.target.value})}
                />
                <Input 
                  label="Ville à Mayotte *" 
                  required
                  value={formData.mayotteCity}
                  onChange={(e: any) => setFormData({...formData, mayotteCity: e.target.value})}
                />
                <Input 
                  label="Ville à Anjouan *" 
                  required
                  value={formData.anjouanCity}
                  onChange={(e: any) => setFormData({...formData, anjouanCity: e.target.value})}
                />
                <Input 
                  label="Ville à Mohéli *" 
                  required
                  value={formData.moheliCity}
                  onChange={(e: any) => setFormData({...formData, moheliCity: e.target.value})}
                />
              </div>
            )}
          </Panel>

          <Panel title="Présentation">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Dites-en un peu plus sur vous...</label>
              <textarea 
                rows={4}
                className="w-full bg-black border border-gold-500/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors placeholder:text-white/20 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </Panel>

          <Button type="submit" variant="primary" className="w-full py-5 text-lg">
            <Send size={20} /> S'enregistrer (Particulier)
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitProfessionnel} className="space-y-8">
          <Panel title="Informations Professionnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Nom de l'activité *" 
                required 
                value={proData.name}
                onChange={(e: any) => setProData({...proData, name: e.target.value})}
              />
              <Input 
                label="Adresse Mail" 
                type="email"
                value={proData.email}
                onChange={(e: any) => setProData({...proData, email: e.target.value})}
              />
              <Input 
                label="Numéro de téléphone" 
                type="tel"
                value={proData.phone}
                onChange={(e: any) => setProData({...proData, phone: e.target.value})}
              />
              <Input 
                label="Site internet" 
                type="url"
                placeholder="https://..."
                value={proData.website}
                onChange={(e: any) => setProData({...proData, website: e.target.value})}
              />
            </div>
          </Panel>

          <Panel title="Réseaux Sociaux">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="Snapchat" 
                value={proData.snapchat}
                onChange={(e: any) => setProData({...proData, snapchat: e.target.value})}
              />
              <Input 
                label="Instagram" 
                value={proData.instagram}
                onChange={(e: any) => setProData({...proData, instagram: e.target.value})}
              />
              <Input 
                label="TikTok" 
                value={proData.tiktok}
                onChange={(e: any) => setProData({...proData, tiktok: e.target.value})}
              />
            </div>
          </Panel>

          <Panel title="Localisation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Île *" 
                required
                options={['Grande Comore', 'Mayotte', 'Anjouan', 'Mohéli', 'Les 4 îles']}
                value={proData.island}
                onChange={(e: any) => setProData({...proData, island: e.target.value})}
              />
              <Input 
                label="Ville en France" 
                value={proData.cityFrance}
                onChange={(e: any) => setProData({...proData, cityFrance: e.target.value})}
              />
              <Input 
                label="Ville aux Comores" 
                value={proData.cityComoros}
                onChange={(e: any) => setProData({...proData, cityComoros: e.target.value})}
              />
            </div>
          </Panel>

          <Panel title="Présentation de l'activité">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Décrivez votre activité...</label>
              <textarea 
                rows={4}
                className="w-full bg-black border border-gold-500/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors placeholder:text-white/20 text-sm"
                value={proData.description}
                onChange={(e) => setProData({...proData, description: e.target.value})}
              />
            </div>
          </Panel>

          <Button type="submit" variant="primary" className="w-full py-5 text-lg">
            <Send size={20} /> S'enregistrer (Professionnel)
          </Button>
        </form>
      )}
    </div>
  );
};

const SearchSection = () => {
  const [activeTab, setActiveTab] = useState<'particulier' | 'professionnel'>('particulier');
  const [query, setQuery] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const peopleResults = useMemo(() => {
    if (!hasSearched) return [];
    return MOCK_PEOPLE.filter(p => {
      const matchesQuery = !query || 
        p.firstName.toLowerCase().includes(query.toLowerCase()) ||
        p.lastName.toLowerCase().includes(query.toLowerCase()) ||
        p.cityFrance.toLowerCase().includes(query.toLowerCase()) ||
        p.cityComoros.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesIsland = !islandFilter || p.island === islandFilter;
      
      return matchesQuery && matchesIsland;
    });
  }, [query, islandFilter, hasSearched]);

  const proResults = useMemo(() => {
    if (!hasSearched) return [];
    return MOCK_PROFESSIONALS.filter(p => {
      const matchesQuery = !query || 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.cityFrance.toLowerCase().includes(query.toLowerCase()) ||
        p.cityComoros.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesIsland = !islandFilter || p.island === islandFilter;
      
      return matchesQuery && matchesIsland;
    });
  }, [query, islandFilter, hasSearched]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <header className="hero space-y-4 text-center">
        <h1 className="text-4xl font-bold gold-text tracking-tight">Recherche</h1>
        <p className="text-text-muted text-lg">Trouvez des membres ou des professionnels partout en France.</p>
        
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={() => setActiveTab('particulier')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'particulier' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            👉 Particulier
          </button>
          <button 
            onClick={() => setActiveTab('professionnel')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'professionnel' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            👉 Professionnel
          </button>
        </div>
      </header>

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" size={18} />
            <input 
              type="text"
              placeholder={activeTab === 'particulier' ? "Ville, village, nom ou mot-clé..." : "Restaurant, coiffeur, photographe..."}
              className="w-full bg-black border border-gold-500/30 rounded-full pl-12 pr-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select 
            label="" 
            options={['Grande Comore', 'Mayotte', 'Anjouan', 'Mohéli', 'Les 4 îles']}
            value={islandFilter}
            onChange={(e: any) => setIslandFilter(e.target.value)}
          />
        </div>
        <Button variant="primary" className="w-full mt-6" onClick={() => setHasSearched(true)}>
          Lancer la recherche
        </Button>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!hasSearched ? (
          <div className="col-span-full py-20 text-center space-y-4 bg-gray-dark rounded-[24px] panel-border">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gold-500/20">
              {activeTab === 'particulier' ? <Search size={40} /> : <Briefcase size={40} />}
            </div>
            <p className="text-text-muted text-lg">Lancez une recherche pour voir les {activeTab === 'particulier' ? 'profils' : 'professionnels'} disponibles</p>
          </div>
        ) : (activeTab === 'particulier' ? peopleResults : proResults).length > 0 ? (
          (activeTab === 'particulier' ? peopleResults : proResults).map(item => (
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
                    <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Ville en France</span>
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
            ) : (
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
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <header className="hero space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-bold gold-text tracking-tight">Évènements</h1>
          <p className="text-text-muted text-lg">Ne manquez rien de la vie communautaire.</p>
        </header>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_EVENTS.map(event => (
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

  // Check session on mount
  useEffect(() => {
    const checkAuth = () => {
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
      }
    };
    checkAuth();
  }, []);

  const handleNavigate = (newView: string | { type: string; id: string }) => {
    const viewId = typeof newView === 'string' ? newView : newView.id;
    
    // Vérification de la session (2h)
    const sessionStr = localStorage.getItem('comnect_auth');
    let isStillAuth = false;
    
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      const twoHours = 2 * 60 * 60 * 1000;
      if (Date.now() - session.timestamp < twoHours) {
        isStillAuth = true;
      } else {
        localStorage.removeItem('comnect_auth');
        setIsAuthenticated(false);
      }
    }

    // Protection de la vue recherche
    if (viewId === 'search' && !isStillAuth) {
      setView('login');
    } else {
      setView(newView);
    }
    setIsMenuOpen(false);
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'events', label: 'Évènements', icon: Calendar },
    { id: 'register', label: 'S\'enregistrer', icon: UserPlus },
  ];

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Bonjour, j'ai une question concernant COM-NECT.");
    window.open(`https://wa.me/33757828250?text=${message}`, '_blank');
  };

  return (
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
              {view === 'login' && <LoginSection onLoginSuccess={() => { setIsAuthenticated(true); setView('search'); }} />}
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
  );
}
