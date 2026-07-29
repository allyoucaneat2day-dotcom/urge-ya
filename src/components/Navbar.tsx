import React, { useState } from 'react';
import { Phone, MapPin, Menu, X, ChevronDown, CheckCircle, Layers, Sparkles } from 'lucide-react';
import { CITIES, SILO_STRUCTURE } from '../data';
import { CityId, CityInfo, ServiceId } from '../types';

interface NavbarProps {
  currentCity: CityInfo;
  onCityChange: (cityId: CityId) => void;
  onServiceSelect: (serviceId: ServiceId) => void;
}

export default function Navbar({ currentCity, onCityChange, onServiceSelect }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSiloDropdownOpen, setIsSiloDropdownOpen] = useState(false);

  const citiesList = Object.values(CITIES);

  const handleServiceClick = (id: ServiceId, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onServiceSelect(id);
    setIsMobileMenuOpen(false);
    setIsSiloDropdownOpen(false);
    
    // Smooth scroll to services section
    const element = document.getElementById('services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSiloStructureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById('silo-structure-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCitySelect = (id: CityId) => {
    onCityChange(id);
    setIsCityDropdownOpen(false);
  };

  const servicesMenu = [
    { id: 'fontaneria' as ServiceId, label: 'Fontanería' },
    { id: 'electricidad' as ServiceId, label: 'Electricidad' },
    { id: 'calentadores' as ServiceId, label: 'Calentadores' },
    { id: 'aire' as ServiceId, label: 'Aire Acondicionado' },
    { id: 'gas' as ServiceId, label: 'Gas' },
    { id: 'manitas' as ServiceId, label: 'Manitas' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm" id="main-navbar">
      {/* City Switcher Top bar */}
      <div className="bg-primary text-slate-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
            <span>Técnicos de guardia disponibles hoy en:</span>
            <span className="text-accent font-extrabold underline decoration-accent decoration-2 underline-offset-2">
              {currentCity.name} y alrededores
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-blue-100 opacity-90">Atención Telefónica 24 Horas / 365 Días</span>
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded cursor-pointer transition font-bold"
              >
                <MapPin className="w-3 h-3 text-accent" />
                <span>Delegación: {currentCity.name}</span>
                <ChevronDown className="w-3 h-3 text-blue-200" />
              </button>
              
              {isCityDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Cambiar Delegación GEO
                  </div>
                  {citiesList.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city.id as CityId)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                        currentCity.id === city.id ? 'bg-slate-50 text-secondary font-bold' : ''
                      }`}
                    >
                      <span>{city.name}</span>
                      {currentCity.id === city.id && <CheckCircle className="w-4 h-4 text-success" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
        {/* Brand/Logo - Matches exact logo look in design HTML */}
        <a href="#" className="flex items-center gap-3 font-display font-extrabold text-primary text-xl sm:text-2xl tracking-tight">
          <video
            src="https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/videos/urgeyalogotipovideo.webm"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="h-12 w-12 sm:h-14 sm:w-14 object-cover rounded-xl shadow-sm border border-slate-100 shrink-0"
          />
          <span className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight italic whitespace-nowrap">URGE <span className="text-secondary">YA</span></span>
        </a>

        {/* Desktop Links with SILO Dropdown */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {/* SILO Mega Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsSiloDropdownOpen(!isSiloDropdownOpen)}
              onMouseEnter={() => setIsSiloDropdownOpen(true)}
              className="flex items-center gap-1 hover:text-secondary transition-colors py-1 relative font-extrabold text-slate-800 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Servicios SILO 24h</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* SILO Mega Dropdown Menu */}
            {isSiloDropdownOpen && (
              <div
                onMouseLeave={() => setIsSiloDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    Estructura SILO • {currentCity.name}
                  </span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded font-bold">
                    6 Pilares
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {SILO_STRUCTURE.map((silo) => (
                    <button
                      key={silo.id}
                      onClick={() => handleServiceClick(silo.id)}
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 hover:border-amber-400 border border-slate-700/80 text-left transition cursor-pointer group"
                    >
                      <div className="text-[10px] text-amber-400 font-extrabold">{silo.badge}</div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {silo.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {silo.clusters[0]?.name}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-center">
                  <button
                    onClick={handleSiloStructureClick}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center justify-center gap-1.5 w-full cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Mapa de Estructura SILO & GEO</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Individual Service Links */}
          {servicesMenu.map((menuItem) => (
            <a
              key={menuItem.id}
              href={`#${menuItem.id}`}
              onClick={(e) => handleServiceClick(menuItem.id, e)}
              className="hover:text-secondary transition-colors py-1 relative group"
            >
              {menuItem.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}

          {/* SILO Structure Section direct link */}
          <a
            href="#silo-structure-section"
            onClick={handleSiloStructureClick}
            className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-2.5 py-1 rounded-md transition flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Info SILO</span>
          </a>
        </div>

        {/* Desktop Call/Contact */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentCity.name} & Alrededores</span>
          <a
            href={`tel:${currentCity.phone}`}
            className="px-5 py-2.5 bg-accent text-primary font-black rounded-lg text-sm shadow-sm hover:shadow-md hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span>SOLICITAR TÉCNICO</span>
          </a>
        </div>

        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-slate-800 p-2 rounded-md hover:bg-slate-100 transition focus:outline-none animate-in fade-in"
          id="menu-toggle"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-3 shadow-lg max-h-[75vh] overflow-y-auto" id="mobile-menu">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Categorías SILO 24h
            </span>
            <button
              onClick={handleSiloStructureClick}
              className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              <span>Mapa SILO</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {servicesMenu.map((menuItem) => (
              <a
                key={menuItem.id}
                href={`#${menuItem.id}`}
                onClick={(e) => handleServiceClick(menuItem.id, e)}
                className="bg-slate-50 hover:bg-blue-50 hover:text-secondary px-3.5 py-3 rounded-lg text-sm font-semibold text-slate-700 transition flex flex-col gap-0.5"
              >
                <span>{menuItem.label}</span>
                <span className="text-[10px] text-slate-400 font-normal">Silo {menuItem.label}</span>
              </a>
            ))}
          </div>
          
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <a
              href={`tel:${currentCity.phone}`}
              className="flex items-center justify-center gap-2 bg-accent text-primary py-3 rounded-xl font-extrabold text-base shadow-sm hover:bg-amber-400 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Llamar {currentCity.phoneFormatted}</span>
            </a>
            <div className="text-center text-xs text-slate-500 font-medium">
              Disponible las 24 Horas en {currentCity.name}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

