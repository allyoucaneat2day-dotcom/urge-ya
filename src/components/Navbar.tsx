import React, { useState } from 'react';
import { Phone, MapPin, Menu, X, ChevronDown, CheckCircle } from 'lucide-react';
import { CITIES } from '../data';
import { CityId, CityInfo } from '../types';

interface NavbarProps {
  currentCity: CityInfo;
  onCityChange: (cityId: CityId) => void;
  onServiceSelect: (serviceId: any) => void;
}

export default function Navbar({ currentCity, onCityChange, onServiceSelect }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const citiesList = Object.values(CITIES);

  const handleServiceClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    onServiceSelect(id);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to services section
    const element = document.getElementById('services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCitySelect = (id: CityId) => {
    onCityChange(id);
    setIsCityDropdownOpen(false);
  };

  const servicesMenu = [
    { id: 'fontaneria', label: 'Fontanería' },
    { id: 'electricidad', label: 'Electricidad' },
    { id: 'calentadores', label: 'Calentadores' },
    { id: 'aire', label: 'Aire Acondicionado' },
    { id: 'gas', label: 'Gas' },
    { id: 'manitas', label: 'Manitas' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm" id="main-navbar">
      {/* City Switcher Top bar */}
      <div className="bg-primary text-slate-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-success"></span>
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
                    Cambiar Delegación
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
        <a href="#" className="flex items-center gap-3 font-display font-extrabold text-primary text-xl tracking-tight">
          <video
            src="https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/videos/urgeyalogotipovideo.webm"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="h-10 w-10 object-cover rounded-lg shadow-sm"
          />
          <span className="text-xl font-extrabold text-primary tracking-tight italic">URGE <span className="text-secondary">YA</span></span>
        </a>

        {/* Desktop Links - Matches hover style in design HTML */}
        <div className="hidden lg:flex gap-8 text-sm font-semibold text-slate-600">
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
        </div>

        {/* Desktop Call/Contact - Styled like yellow technical button in design HTML */}
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
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1">
            Nuestros Servicios
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {servicesMenu.map((menuItem) => (
              <a
                key={menuItem.id}
                href={`#${menuItem.id}`}
                onClick={(e) => handleServiceClick(menuItem.id, e)}
                className="bg-slate-50 hover:bg-blue-50 hover:text-secondary px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 transition"
              >
                {menuItem.label}
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
