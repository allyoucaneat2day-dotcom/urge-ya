import React from 'react';
import { ShieldCheck, CheckCircle2, Phone, Star, MessageSquare } from 'lucide-react';
import { CityInfo } from '../types';

interface HeroSectionProps {
  currentCity: CityInfo;
  onOpenBookingWizard: () => void;
}

export default function HeroSection({ currentCity, onOpenBookingWizard }: HeroSectionProps) {
  const bulletServices = [
    'Instalaciones Eléctricas de Urgencia',
    'Fugas de Agua, Desatascos y Humedades',
    'Reparación e Instalación de Calentadores y Termos',
    'Corrección de Anomalías e Inspecciones de Gas',
    'Carga de Gas y Reparación de Aire Acondicionado',
    'Pintura, Paletería y Reparaciones del Hogar (Manitas)'
  ];

  const handleWhatsappClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Simulate WhatsApp redirect or open standard WhatsApp text
    const message = `Hola, necesito un técnico de urgencia en ${currentCity.name}. ¿Me pueden atender?`;
    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/34664065855?text=${encodedText}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-primary text-white py-12 md:py-20 lg:py-24">
      {/* High-Performance Atmospheric Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 opacity-40">
        <video
          src="https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/videos/mochilaurgeyacompleto.mp4"
          poster="https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/inagenes/IMG-20260714-WA0009.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/40"></div>
      </div>

      {/* Sleek Dynamic Background Accents */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-secondary/15 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 right-0 w-96 h-96 bg-secondary/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Key Bullet Points & Main Title */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          <div>
            <div className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full mb-4 tracking-wide uppercase">
              SERVICIO 24H DISPONIBLE
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-4">
              Reparamos <span className="text-accent">hoy</span> mismo su hogar.
            </h1>

            <p className="text-blue-100 text-base md:text-lg max-w-xl font-normal leading-relaxed">
              Más de 25 años de experiencia en fontanería, electricidad y climatización. Asistencia inmediata certificada.
            </p>
          </div>

          <div className="space-y-3">
            {bulletServices.map((service, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-slate-200 text-sm font-medium">{service}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onOpenBookingWizard}
              className="px-6 py-3.5 bg-accent hover:bg-amber-400 text-primary rounded-xl font-extrabold text-sm tracking-wide shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Solicitar Presupuesto Online</span>
              <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-black uppercase">¡Gratis!</span>
            </button>
            <div className="flex items-center gap-2.5 px-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-primary flex items-center justify-center text-[10px] font-bold text-white">4.9★</div>
                <div className="w-8 h-8 rounded-full bg-accent border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">25+</div>
              </div>
              <div className="text-xs text-blue-100 font-medium">
                Satisfechos en <span className="text-white font-semibold">{currentCity.name}</span>
              </div>
            </div>
          </div>

          {/* Three Custom Theme Counters - Exactly as in the design HTML */}
          <div className="flex gap-8 border-t border-white/10 pt-6 max-w-md">
            <div className="text-left">
              <p className="text-3xl font-black text-accent">25+</p>
              <p className="text-[10px] uppercase opacity-75 font-bold tracking-wider">Años Experiencia</p>
            </div>
            <div className="text-left">
              <p className="text-3xl font-black text-accent">0€</p>
              <p className="text-[10px] uppercase opacity-75 font-bold tracking-wider">Desplazamiento*</p>
            </div>
            <div className="text-left">
              <p className="text-3xl font-black text-accent">365</p>
              <p className="text-[10px] uppercase opacity-75 font-bold tracking-wider">Días al Año</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Card */}
        <div className="lg:col-span-5">
          <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden">
            {/* Top design accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent"></div>

            {/* Video preview display instead of static image */}
            <div className="relative rounded-xl overflow-hidden mb-6 h-48 md:h-52 bg-slate-950/60 border border-white/10 group shadow-lg">
              <video
                src="https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/videos/mochilaurgeyacompleto.mp4"
                poster="https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/inagenes/IMG-20260714-WA0009.jpg"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-4">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-success animate-ping"></span>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-success absolute"></span>
                  <span className="text-xs text-white font-bold uppercase tracking-wider pl-1">Vídeo Corporativo Oficial</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="text-center space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">Delegación oficial activa</p>
                <h3 className="text-accent font-display text-xl md:text-2xl font-bold uppercase">
                  {currentCity.regionLabel}
                </h3>
              </div>

              <div className="flex justify-center items-center gap-6 py-2">
                {/* Phone CTA Button - Round, centered, no numbers, only logo */}
                <a
                  href={`tel:${currentCity.phone}`}
                  className="flex items-center justify-center bg-accent hover:bg-amber-400 text-primary h-16 w-16 rounded-full shadow-lg shadow-amber-400/20 transition-all hover:scale-110 active:scale-95 cursor-pointer pulse-gentle"
                  title="Llamar Urgente"
                >
                  <Phone className="w-7 h-7" />
                </a>

                {/* WhatsApp CTA Button - Round, centered, logo and 'Urgente' */}
                <a
                  href="#"
                  onClick={handleWhatsappClick}
                  className="flex flex-col items-center justify-center bg-[#25D366] hover:bg-[#20ba59] text-white h-16 w-16 rounded-full shadow-lg shadow-green-500/10 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="WhatsApp Urgente"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                  </svg>
                  <span className="text-[8px] font-black uppercase tracking-wider -mt-0.5 text-white">Urgente</span>
                </a>
              </div>

              <div className="pt-2 border-t border-white/10 text-xs text-blue-100/80 space-y-1">
                <p>Presupuesto sin compromiso. Desplazamiento <span className="text-accent font-bold">GRATIS</span> al aceptar el servicio.</p>
                <p className="font-semibold text-white">¡Llámanos ya, técnicos de guardia en camino!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
