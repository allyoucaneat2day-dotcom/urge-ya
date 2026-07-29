import React from 'react';
import { ChevronRight, Home, MapPin, Layers, Sparkles } from 'lucide-react';
import { CityInfo, ServiceId } from '../types';
import { SILO_STRUCTURE } from '../data';

interface SiloBreadcrumbsProps {
  currentCity: CityInfo;
  selectedServiceId: ServiceId;
  onServiceSelect: (serviceId: ServiceId) => void;
  onCityChange?: (cityId: any) => void;
}

export default function SiloBreadcrumbs({
  currentCity,
  selectedServiceId,
  onServiceSelect
}: SiloBreadcrumbsProps) {
  const currentSilo = SILO_STRUCTURE.find((s) => s.id === selectedServiceId) || SILO_STRUCTURE[0];

  return (
    <nav
      aria-label="Ruta de navegación SILO"
      className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs py-2.5 px-4 overflow-x-auto shadow-inner"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-max">
        
        {/* Breadcrumb Items Path */}
        <ol className="flex items-center gap-2 font-medium">
          {/* Level 1: Home */}
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-1.5"
          >
            <a
              href="#"
              itemProp="item"
              className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-300 font-bold"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span itemProp="name">Urge Ya</span>
            </a>
            <meta itemProp="position" content="1" />
          </li>

          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

          {/* Level 2: City SILO Delegation */}
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-1.5"
          >
            <a
              href="#services-section"
              itemProp="item"
              className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-300"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span itemProp="name">Delegación {currentCity.name}</span>
            </a>
            <meta itemProp="position" content="2" />
          </li>

          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

          {/* Level 3: Active Service SILO Category */}
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-1.5"
          >
            <span
              itemProp="item"
              className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-extrabold flex items-center gap-1"
            >
              <Layers className="w-3 h-3 text-amber-400" />
              <span itemProp="name">{currentSilo.name}</span>
            </span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>

        {/* GEO & AI Indicator Badge */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-semibold bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>GEO Ready: Optimizado para Gemini, ChatGPT y Perplexity</span>
        </div>

      </div>
    </nav>
  );
}
