import React from 'react';
import { Droplet, Bolt, Flame, Wind, Activity, Wrench, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data';
import { ServiceDetail, ServiceId, ServiceIssue } from '../types';

interface ServiceExplorerProps {
  selectedServiceId: ServiceId;
  onServiceSelect: (serviceId: ServiceId) => void;
  onIssueSelect: (serviceId: ServiceId, issue: ServiceIssue) => void;
}

export default function ServiceExplorer({
  selectedServiceId,
  onServiceSelect,
  onIssueSelect
}: ServiceExplorerProps) {
  
  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

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

  return (
    <section id="services-section" className="py-16 md:py-24 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-[#0174BE]/10 px-3 py-1 rounded-full">
            Especialidades
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary mt-4 tracking-tight">
            Nuestros Servicios Técnicos Autorizados
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-3 leading-relaxed">
            Seleccione una categoría para consultar las averías más habituales, las tarifas de referencia y la duración aproximada de la intervención en su domicilio.
          </p>
        </div>

        {/* 6 Grid Tabs - Redesigned to fit the Sleek Interface style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {SERVICES.map((service) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service.id)}
                className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-primary shadow-xl scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-secondary hover:bg-slate-50'
                }`}
              >
                <div className={`p-3 rounded-xl mb-3.5 transition-colors ${
                  isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {getServiceIcon(service.iconName, 'w-6 h-6')}
                </div>
                <span className={`text-xs md:text-sm font-extrabold tracking-tight ${
                  isSelected ? 'text-primary' : 'text-slate-600'
                }`}>
                  {service.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Service Detailed Board */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-12">
          {/* Service Left Poster - Styled with the main theme color and accent overlay */}
          <div className="lg:col-span-5 relative min-h-64 lg:min-h-[480px]">
            <img
              src={selectedService.imageUrl}
              alt={selectedService.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/20 flex flex-col justify-end p-6 md:p-8">
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
      </div>
    </section>
  );
}
