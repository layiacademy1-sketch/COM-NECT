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
  Instagram, 
  MessageCircle, 
  MapPin, 
  Globe, 
  Menu, 
  X,
  ArrowRight,
  Phone,
  Send
} from 'lucide-react';
import { MOCK_PEOPLE, MOCK_PROFESSIONALS, MOCK_EVENTS } from './data';
import { Island, Person, Professional, Event as ComEvent } from './types';

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

const HomeSection = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
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
        <h1 className="text-4xl md:text-5xl font-bold gold-text tracking-tight">Bienvenue sur COM-NECT</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed mx-auto">
          Reliez-vous à vos racines. Retrouvez vos proches de Grande-Comore, Mayotte, Anjouan et Mohéli partout en France.
        </p>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      {/* Left Panel: Events & Search */}
      <div className="space-y-8">
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
          <div className="space-y-6">
            <div className="bg-black border border-gold-500/30 rounded-full px-5 py-4 flex items-center gap-3 text-text-muted">
              <Search size={18} className="text-gold-500" />
              <input type="text" className="bg-transparent border-none text-white w-full outline-none text-sm placeholder:text-white/20" placeholder="Rechercher par ville, île ou village..." />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" className="flex-1" onClick={() => onNavigate('search')}>Lancer la recherche</Button>
              <Button variant="outline" className="flex-1" onClick={() => onNavigate('search')}>Filtres Avancés</Button>
            </div>
          </div>
        </Panel>
      </div>

      {/* Right Panel: Stats & Join */}
      <div className="space-y-8">
        <Panel title="Impact Communautaire">
          <div className="space-y-4">
            <div className="bg-white/5 rounded-[20px] p-5 text-center border border-white/5">
              <div className="text-3xl font-bold text-gold-500">1,240+</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Membres Inscrits</div>
            </div>
            <div className="bg-white/5 rounded-[20px] p-5 text-center border border-white/5">
              <div className="text-3xl font-bold text-gold-500">85</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Professionnels Certifiés</div>
            </div>
            <div className="bg-white/5 rounded-[20px] p-5 text-center border border-white/5">
              <div className="text-3xl font-bold text-gold-500">12</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Évènements ce mois</div>
            </div>
          </div>
        </Panel>

        <Panel title="Devenir Membre">
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            Enregistrez-vous dès maintenant pour être visible dans votre communauté et être informé des actualités de votre île.
          </p>
          <Button variant="primary" className="w-full" onClick={() => onNavigate('register')}>
            S'enregistrer via WhatsApp
          </Button>
        </Panel>
      </div>
    </div>
  </div>
);

const RegistrationSection = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `Bonjour, je souhaite m’enregistrer sur COM-NECT.\n\n`;
    message += `Prénom : ${formData.firstName}\n`;
    message += `Nom : ${formData.lastName}\n`;
    if (formData.nickname) message += `Surnom : ${formData.nickname}\n`;
    if (formData.email) message += `Mail : ${formData.email}\n`;
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

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-32">
      <header className="hero space-y-2 text-center">
        <h1 className="text-4xl font-bold gold-text tracking-tight">M'enregistrer</h1>
        <p className="text-text-muted text-lg">Rejoignez la communauté et devenez visible pour vos proches.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
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
              label="Adresse Mail" 
              type="email"
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
          <Send size={20} /> Enregistrer via WhatsApp
        </Button>
      </form>
    </div>
  );
};

const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(() => {
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

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <header className="hero space-y-2 text-center">
        <h1 className="text-4xl font-bold gold-text tracking-tight">Recherche</h1>
        <p className="text-text-muted text-lg">Trouvez des membres de la communauté partout en France.</p>
      </header>

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" size={18} />
            <input 
              type="text"
              placeholder="Ville, village, nom ou mot-clé..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!hasSearched ? (
          <div className="col-span-full py-20 text-center space-y-4 bg-gray-dark rounded-[24px] panel-border">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gold-500/20">
              <Search size={40} />
            </div>
            <p className="text-text-muted text-lg">Lancez une recherche pour voir les profils disponibles</p>
          </div>
        ) : results.length > 0 ? (
          results.map(person => (
            <Card key={person.id} className="space-y-6 group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold group-hover:text-gold-500 transition-colors">{person.firstName} {person.lastName}</h3>
                  <div className="flex items-center gap-2 text-gold-500 text-[11px] font-bold uppercase tracking-wider">
                    <Globe size={12} /> {person.island}
                  </div>
                </div>
                <div className="flex gap-2">
                  {person.socials.instagram && (
                    <a href={`https://instagram.com/${person.socials.instagram}`} target="_blank" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                      <Instagram size={18} />
                    </a>
                  )}
                  {person.socials.tiktok && (
                    <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                      <MessageCircle size={18} />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Ville en France</span>
                  <p className="text-sm flex items-center gap-1.5"><MapPin size={14} className="text-gold-500" /> {person.cityFrance}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Ville aux Comores</span>
                  <p className="text-sm flex items-center gap-1.5"><Home size={14} className="text-gold-500" /> {person.cityComoros}</p>
                </div>
              </div>

              <p className="text-sm text-white/60 leading-relaxed italic">
                "{person.description}"
              </p>
            </Card>
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

const ProfessionalSection = () => {
  const [query, setQuery] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(() => {
    if (!hasSearched) return [];
    return MOCK_PROFESSIONALS.filter(p => {
      const matchesQuery = !query || 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.cityFrance.toLowerCase().includes(query.toLowerCase()) ||
        p.cityComoros.toLowerCase().includes(query.toLowerCase());
      
      const matchesIsland = !islandFilter || p.island === islandFilter;
      
      return matchesQuery && matchesIsland;
    });
  }, [query, islandFilter, hasSearched]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <header className="hero space-y-2 text-center">
        <h1 className="text-4xl font-bold gold-text tracking-tight">Pro & Services</h1>
        <p className="text-text-muted text-lg">Soutenez les talents et commerces de la communauté.</p>
      </header>

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" size={18} />
            <input 
              type="text"
              placeholder="Restaurant, coiffeur, photographe..."
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
          Trouver un pro
        </Button>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!hasSearched ? (
          <div className="col-span-full py-20 text-center space-y-4 bg-gray-dark rounded-[24px] panel-border">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gold-500/20">
              <Briefcase size={40} />
            </div>
            <p className="text-text-muted text-lg">Lancez une recherche pour voir les professionnels</p>
          </div>
        ) : results.length > 0 ? (
          results.map(pro => (
            <div key={pro.id} className="bg-gray-dark rounded-[24px] panel-border overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={pro.image} alt={pro.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-gold-500 text-black text-[10px] font-bold uppercase tracking-widest">
                    {pro.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold group-hover:text-gold-500 transition-colors">{pro.name}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-text-muted flex items-center gap-2"><MapPin size={14} className="text-gold-500" /> {pro.cityFrance}</p>
                  <p className="text-sm text-text-muted flex items-center gap-2"><Globe size={14} className="text-gold-500" /> {pro.island}</p>
                </div>
                <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">{pro.description}</p>
                <Button variant="outline" className="w-full text-xs py-2.5">Voir le profil</Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-dark rounded-[24px] panel-border">
            <p className="text-text-muted text-lg">Aucun professionnel trouvé.</p>
          </div>
        )}
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
        <Button variant="primary" onClick={() => {
          const message = encodeURIComponent("Bonjour, j’aimerais enregistrer un évènement sur COM-NECT.");
          window.open(`https://wa.me/33757828250?text=${message}`, '_blank');
        }}>
          <Calendar size={18} /> Enregistrer un évènement
        </Button>
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
              <Button variant="secondary" className="w-full md:w-auto text-xs py-2.5">Voir plus</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [view]);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'pro', label: 'Pro & Services', icon: Briefcase },
    { id: 'events', label: 'Évènements', icon: Calendar },
    { id: 'register', label: 'S\'enregistrer', icon: UserPlus },
  ];

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Bonjour, j'ai une question concernant COM-NECT.");
    window.open(`https://wa.me/33757828250?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] bg-gray-dark sidebar-border flex-col p-10 justify-between sticky top-0 h-screen">
        <div className="space-y-12">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <div className="w-8 h-8 rounded-lg border-2 border-gold-500 flex items-center justify-center text-gold-500 font-bold text-sm group-hover:bg-gold-500 group-hover:text-black transition-all">C</div>
            <span className="text-2xl font-extrabold text-gold-500 tracking-tighter">COM-NECT</span>
          </div>
          
          <nav className="space-y-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
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
        <div className="flex items-center gap-2" onClick={() => setView('home')}>
          <div className="w-8 h-8 rounded-lg border-2 border-gold-500 flex items-center justify-center text-gold-500 font-bold">C</div>
          <span className="text-xl font-bold text-gold-500 tracking-tight">COM-NECT</span>
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
                  onClick={() => setView(item.id)}
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
      <main className="flex-1 p-6 md:p-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'home' && <HomeSection onNavigate={setView} />}
            {view === 'register' && <RegistrationSection />}
            {view === 'search' && <SearchSection />}
            {view === 'pro' && <ProfessionalSection />}
            {view === 'events' && <EventsSection />}
          </motion.div>
        </AnimatePresence>

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
            onClick={() => setView(item.id)}
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
