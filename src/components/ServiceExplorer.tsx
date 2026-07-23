import React, { useState, useEffect } from 'react';
import { 
  Droplet, Bolt, Flame, Wind, Activity, Wrench, Clock, 
  ArrowRight, Maximize2, X, ChevronLeft, ChevronRight, Eye, ZoomIn, Phone
} from 'lucide-react';
import { SERVICES } from '../data';
import { ServiceDetail, ServiceId, ServiceIssue, CityInfo } from '../types';

interface ServiceExplorerProps {
  selectedServiceId: ServiceId;
  onServiceSelect: (serviceId: ServiceId) => void;
  onIssueSelect: (serviceId: ServiceId, issue: ServiceIssue) => void;
  currentCity?: CityInfo;
}

export default function ServiceExplorer({
  selectedServiceId,
  onServiceSelect,
  onIssueSelect,
  currentCity
}: ServiceExplorerProps) {
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);
  
  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const phone = currentCity?.phone || '664065855';
  const phoneFormatted = currentCity?.phoneFormatted || '664 065 855';
  const rawWa = currentCity?.whatsappNumber || '+34664065855';
  const cleanWa = rawWa.replace(/[^0-9]/g, '');
  const cityName = currentCity?.name || 'mi zona';

  const getServiceIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className={className} />;
      case 'Bolt': return <Bolt className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      default: return <Wrench className={className} />;
    }
  };

  // Keyboard navigation for lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalImageIndex === null) return;
      if (e.key === 'Escape') setModalImageIndex(null);
      if (e.key === 'ArrowLeft') setModalImageIndex((prev) => (prev !== null ? (prev - 1 + SERVICES.length) % SERVICES.length : 0));
      if (e.key === 'ArrowRight') setModalImageIndex((prev) => (prev !== null ? (prev + 1) % SERVICES.length : 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImageIndex]);

  const activeModalService = modalImageIndex !== null ? SERVICES[modalImageIndex] : null;

  return (
    <section id="services-section" className="py-16 md:py-24 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-[#0174BE]/10 px-3 py-1 rounded-full">
            Especialidades
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary mt-4 tracking-tight">
            Nuestros Servicios Técnicos Autorizados
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-3 leading-relaxed">
            Seleccione una categoría para consultar las averías más habituales, las tarifas de referencia y ver imágenes reales de nuestras intervenciones.
          </p>
        </div>

        {/* 6 Category Cards with Image Thumbnails & Click to Expand */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SERVICES.map((service, index) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <div
                key={service.id}
                className={`group relative flex flex-col rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${
                  isSelected
                    ? 'bg-white border-2 border-primary shadow-xl scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-secondary hover:shadow-md'
                }`}
              >
                {/* Card Top Image Thumbnail */}
                <div 
                  onClick={() => setModalImageIndex(index)}
                  className="relative h-24 sm:h-28 overflow-hidden bg-slate-900 cursor-pointer group/img"
                  title="Haz clic para ver imagen en pantalla completa"
                >
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 opacity-90 group-hover/img:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover/img:bg-slate-950/40 transition-colors flex items-center justify-center">
                    <span className="bg-slate-900/80 hover:bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover/img:opacity-100 transition-all duration-200 flex items-center gap-1 shadow-lg transform translate-y-1 group-hover/img:translate-y-0">
                      <ZoomIn className="w-3 h-3 text-accent" /> Ampliar
                    </span>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-slate-950/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                    #{index + 1}
                  </span>
                </div>

                {/* Card Title & Selector */}
                <button
                  type="button"
                  onClick={() => onServiceSelect(service.id)}
                  className="p-3 flex flex-col items-center justify-center text-center cursor-pointer flex-1"
                >
                  <div className={`p-2 rounded-lg mb-1.5 transition-colors ${
                    isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-secondary/10 group-hover:text-secondary'
                  }`}>
                    {getServiceIcon(service.iconName, 'w-4 h-4')}
                  </div>
                  <span className={`text-xs font-extrabold tracking-tight ${
                    isSelected ? 'text-primary' : 'text-slate-700'
                  }`}>
                    {service.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Service Detailed Board */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-12">
          
          {/* Service Left Poster - Clickable to Pop-up Screen */}
          <div 
            onClick={() => setModalImageIndex(SERVICES.findIndex(s => s.id === selectedService.id))}
            className="lg:col-span-5 relative min-h-72 lg:min-h-[480px] cursor-pointer group/poster overflow-hidden"
            title="Haz clic para ampliar la imagen en pantalla completa"
          >
            <img
              src={selectedService.imageUrl}
              alt={selectedService.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/poster:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/20 flex flex-col justify-end p-6 md:p-8">
              
              {/* Expand Image Button Badge */}
              <div className="absolute top-4 right-4 bg-slate-900/80 hover:bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-white/20 transition backdrop-blur-md group-hover/poster:scale-105">
                <Maximize2 className="w-3.5 h-3.5 text-accent" />
                <span>🔍 Ampliar Foto</span>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-accent text-primary px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider mb-3.5 w-fit shadow-sm">
                Garantía Escrita 3 Meses
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Servicio de {selectedService.name}
              </h3>
              <p className="text-accent font-extrabold text-sm md:text-base mt-1.5">
                {selectedService.tagline}
              </p>
              <p className="text-blue-100 text-xs md:text-sm mt-3 leading-relaxed opacity-95">
                {selectedService.longDescription}
              </p>
              <div className="mt-4 flex items-center gap-2 text-accent text-xs font-bold">
                <Eye className="w-4 h-4" />
                <span>Haz clic aquí para ver la foto en pantalla completa</span>
              </div>
            </div>
          </div>

          {/* Service Right Content - Pricing & Common issues */}
          <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
            <div>
              <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">
                Averías Comunes y Presupuestos de Referencia
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Precios base de referencia para su zona. El desplazamiento es gratuito al aceptar el presupuesto presencial.
              </p>
            </div>

            <div className="space-y-4">
              {selectedService.commonIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="group bg-slate-50 hover:bg-[#0174BE]/5 border border-slate-200/60 hover:border-[#0174BE]/20 p-4 rounded-xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                      <h5 className="font-extrabold text-slate-900 text-sm md:text-base">
                        {issue.name}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-500 pl-3.5 leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  {/* Price & Action Badge */}
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/60">
                    <div className="text-left md:text-right shrink-0">
                      <div className="text-secondary font-black text-base md:text-lg">
                        {issue.avgPrice}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{issue.duration}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onIssueSelect(selectedService.id, issue)}
                      className="flex items-center gap-1.5 bg-white group-hover:bg-[#0174BE] text-secondary group-hover:text-white border border-[#0174BE]/30 group-hover:border-[#0174BE] px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      <span>Solicitar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* General Information Strip */}
            <div className="bg-amber-400/5 border border-accent/20 rounded-xl p-4 flex gap-3 items-start">
              <div className="bg-accent text-primary p-1.5 rounded-lg shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h6 className="text-primary font-extrabold text-xs uppercase tracking-wide">¿No encuentra su avería en la lista?</h6>
                <p className="text-slate-600 text-xs leading-relaxed">
                  No se preocupe. Nuestro equipo de profesionales abarca todo tipo de reparaciones de electricidad, fontanería, gas y mantenimiento integral del hogar. Llámenos o solicite presupuesto online y le asignaremos el técnico adecuado en minutos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 6-Image Showcase Gallery Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>📸 Galería de Fotografías de nuestros Servicios</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Haz clic en cualquier imagen para abrirla en el visor emergente de alta resolución.
              </p>
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full w-fit">
              6 Especialidades
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {SERVICES.map((service, idx) => (
              <div
                key={service.id}
                onClick={() => setModalImageIndex(idx)}
                className="group relative h-36 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-lg hover:border-secondary transition-all"
              >
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <span className="p-1 bg-slate-900/80 hover:bg-primary text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow">
                      <Maximize2 className="w-3.5 h-3.5 text-accent" />
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-xs truncate">
                      {service.name}
                    </p>
                    <p className="text-accent text-[10px] font-medium truncate">
                      Ver foto en HD 🔍
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POP-UP SCREEN / LIGHTBOX MODAL */}
      {activeModalService && modalImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setModalImageIndex(null)}
        >
          {/* Modal Container */}
          <div 
            className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto my-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-white">
                <div className="p-1.5 bg-primary rounded-lg text-accent">
                  {getServiceIcon(activeModalService.iconName, 'w-4 h-4')}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base leading-tight">
                    {activeModalService.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Fotografía de Servicio #{modalImageIndex + 1} de {SERVICES.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalImageIndex(null)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                  title="Cerrar (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image View Area */}
            <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden p-2 sm:p-4">
              <img
                src={activeModalService.imageUrl}
                alt={activeModalService.name}
                className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />

              {/* Navigation Left Arrow */}
              <button
                type="button"
                onClick={() => setModalImageIndex((modalImageIndex - 1 + SERVICES.length) % SERVICES.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-primary text-white p-2.5 rounded-full border border-slate-700 hover:border-accent transition shadow-xl cursor-pointer"
                title="Anterior foto"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Navigation Right Arrow */}
              <button
                type="button"
                onClick={() => setModalImageIndex((modalImageIndex + 1) % SERVICES.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-primary text-white p-2.5 rounded-full border border-slate-700 hover:border-accent transition shadow-xl cursor-pointer"
                title="Siguiente foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
              <div>
                <p className="text-xs text-slate-300 font-bold">
                  {activeModalService.tagline}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xl">
                  {activeModalService.longDescription}
                </p>
              </div>

              {/* Dual Contact CTAs: Direct Call & WhatsApp */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
                {/* Phone Call Button */}
                <a
                  href={`tel:${phone}`}
                  onClick={() => {
                    onServiceSelect(activeModalService.id);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-accent hover:bg-amber-400 text-primary rounded-xl text-xs font-black transition cursor-pointer shadow flex items-center justify-center gap-2 active:scale-95"
                  title={`Llamar a ${phoneFormatted} para solicitar ${activeModalService.name}`}
                >
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="whitespace-nowrap">Solicitar {activeModalService.name} ({phoneFormatted})</span>
                </a>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
                    `Hola, solicito asistencia técnica urgente para el servicio de ${activeModalService.name} en ${cityName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    onServiceSelect(activeModalService.id);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-extrabold transition cursor-pointer shadow flex items-center justify-center gap-2 active:scale-95"
                  title={`Enviar mensaje de WhatsApp para ${activeModalService.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="whitespace-nowrap">WhatsApp {activeModalService.name}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

