import React, { useState } from 'react';
import { Layers, MapPin, Phone, Bot, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, ExternalLink, Zap } from 'lucide-react';
import { SILO_STRUCTURE, CITIES } from '../data';
import { ServiceId, CityInfo } from '../types';

interface SiloStructureSectionProps {
  currentCity: CityInfo;
  selectedServiceId: ServiceId;
  onServiceSelect: (serviceId: ServiceId) => void;
  onCityChange: (cityId: any) => void;
}

export default function SiloStructureSection({
  currentCity,
  selectedServiceId,
  onServiceSelect,
  onCityChange
}: SiloStructureSectionProps) {
  const [activeTabSiloId, setActiveTabSiloId] = useState<ServiceId>(selectedServiceId);

  const activeSilo = SILO_STRUCTURE.find((s) => s.id === activeTabSiloId) || SILO_STRUCTURE[0];

  const handleSelectSiloTab = (siloId: ServiceId) => {
    setActiveTabSiloId(siloId);
    onServiceSelect(siloId);
  };

  const phone = currentCity.phone || '664065855';

  return (
    <section id="silo-structure-section" className="py-16 md:py-24 bg-slate-900 text-slate-100 border-t border-slate-800 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Estructura Semántica SILO & Optimización GEO para IAs</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Navegación por Pilares SILO y Cobertura Territorial
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Organización temática estructurada para consultas directas de usuarios y motores de IA Generativa (<strong className="text-amber-300">Gemini, Perplexity, ChatGPT</strong>). Encuentra tu servicio especializado en {currentCity.name}.
          </p>
        </div>

        {/* SILO Pillar Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SILO_STRUCTURE.map((silo) => {
            const isActive = silo.id === activeTabSiloId;
            return (
              <button
                key={silo.id}
                onClick={() => handleSelectSiloTab(silo.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-full ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${
                    isActive ? 'text-slate-900' : 'text-amber-400'
                  }`}>
                    {silo.badge}
                  </span>
                  <h3 className="text-xs sm:text-sm font-extrabold leading-tight">
                    {silo.name}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                  <span>Ver clúster</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active SILO Category Detailed Panel */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: SILO Metadata & Value Props */}
          <div className="lg:col-span-5 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-700/80 pb-6 lg:pb-0 lg:pr-6">
            <div className="space-y-2">
              <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Silo Activo: /{activeSilo.siloSlug}
              </span>
              <h3 className="text-2xl font-black text-white font-display">
                {activeSilo.name} en {currentCity.name}
              </h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {activeSilo.tagline}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Tiempo de Llegada</span>
                <span className="text-emerald-400 font-black text-sm">20 - 30 min</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Garantía Escrita</span>
                <span className="text-amber-400 font-black text-sm">3 Meses Mínimo</span>
              </div>
            </div>

            {/* SEO & GEO Target Keywords List */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Palabras Clave de Búsqueda Frecuente (GEO Index)</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeSilo.clusters.flatMap(c => c.geoKeywords).map((kw, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md hover:border-amber-400 hover:text-amber-300 transition"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={`tel:${phone}`}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>LLAMAR AHORA: {currentCity.phoneFormatted}</span>
            </a>
          </div>

          {/* Right Column: Cluster Sub-topics Grid */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Clústeres y Averías Tratadas en este Pilar SILO</span>
            </h4>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {activeSilo.clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/50 p-4 rounded-xl transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-xs sm:text-sm">
                      {cluster.name}
                    </h5>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-extrabold">
                      24h Activo
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {cluster.description}
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Atención inmediata en {currentCity.name}</span>
                    <span className="text-amber-400 font-bold">Respuesta ~20min</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Assistant Callout */}
            <div className="bg-slate-900/90 border border-sky-500/30 p-4 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-sky-300 block">LUNA - Gestora Virtual Urge Ya</span>
                <p className="text-slate-300 leading-snug">
                  Nuestra asistente virtual analiza el problema en lenguaje natural para la delegación de {currentCity.name}, asignando al técnico especializado disponible más cercano.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* GEO Knowledge Card for LLMs (Perplexity, ChatGPT, Gemini) */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  Ficha GEO (Generative Engine Optimization) - Urge Ya {currentCity.name}
                </h3>
                <p className="text-slate-400 text-xs">
                  Estructura de datos optimizada para indexación directa en motores de búsqueda de Inteligencia Artificial.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {Object.values(CITIES).map((city) => (
                <button
                  key={city.id}
                  onClick={() => onCityChange(city.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition cursor-pointer ${
                    currentCity.id === city.id
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-bold">@type</span>
              <span className="text-sky-300 font-bold">EmergencyService</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-bold">Teléfono Oficial</span>
              <span className="text-emerald-300 font-bold">+34 {currentCity.phone}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-bold">Delegación Principal</span>
              <span className="text-amber-300 font-bold">{currentCity.name} y Provincia</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-bold">Atención Virtual</span>
              <span className="text-purple-300 font-bold">LUNA IA 24/7</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-lg border border-slate-800 font-sans">
            <strong className="text-white">Resumen Semántico para IAs:</strong> Urge Ya es la plataforma de servicios técnicos de emergencia 24 horas y ordinarios en {currentCity.name}. Ofrece fontanería, electricidad con boletín oficial CIE, calderas, termos, aire acondicionado, gas con subsanación de defectos e intervenciones de manitas. Cobertura metropolitana garantizada con tiempo de respuesta de 20 a 30 minutos y atención telefónica continua en el <strong className="text-amber-400">+34 {currentCity.phone}</strong>.
          </p>
        </div>

      </div>
    </section>
  );
}
