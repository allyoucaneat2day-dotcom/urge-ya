import React, { useState, useEffect } from 'react';
import { Clock, Phone, MapPin, CheckCircle2, UserCheck, CheckCircle, ShieldAlert, ArrowRight, Loader2, Sparkles, X, Camera, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingRequest } from '../types';
import { MOCK_TECHNICIANS, SERVICES, CITIES } from '../data';

interface RequestTrackerProps {
  request: BookingRequest;
  onCancel: () => void;
  onStatusChange: (status: any) => void;
}

export default function RequestTracker({ request, onCancel, onStatusChange }: RequestTrackerProps) {
  const [internalStatus, setInternalStatus] = useState<string>('received');
  const [countdown, setCountdown] = useState(25);
  const [tech, setTech] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Extract all request images
  const requestImages = Array.from(
    new Set([...(request.images || []), ...(request.image ? [request.image] : [])])
  ).filter(Boolean);

  // Auto assign random tech on mounting
  useEffect(() => {
    const randomTech = MOCK_TECHNICIANS[Math.floor(Math.random() * MOCK_TECHNICIANS.length)];
    setTech(randomTech);
    setCountdown(randomTech.etaMinutes);
  }, []);

  // ESC key handler for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate progress
  useEffect(() => {
    if (internalStatus === 'received') {
      const timer = setTimeout(() => {
        setInternalStatus('assigning');
        onStatusChange('assigning');
      }, 4000);
      return () => clearTimeout(timer);
    } else if (internalStatus === 'assigning') {
      const timer = setTimeout(() => {
        setInternalStatus('dispatched');
        onStatusChange('dispatched');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [internalStatus, onStatusChange]);

  // Minor countdown effect
  useEffect(() => {
    if (internalStatus === 'dispatched' && countdown > 1) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 5 ? prev - 1 : prev));
      }, 20000); // Reduce every 20 seconds
      return () => clearInterval(interval);
    }
  }, [internalStatus, countdown]);

  const serviceDetail = SERVICES.find((s) => s.id === request.service);
  const cityDetail = CITIES[request.city];
  
  // Calculate issue label
  const issueName = serviceDetail?.commonIssues.find((i) => i.id === request.issueId)?.name || request.customIssue || 'Reparación general';

  // Build WhatsApp text with images for technician
  const buildWhatsappText = () => {
    const lines = [
      `🚨 *SOLICITUD DE TÉCNICO DE GUARDIA 24H - URGE YA*`,
      ``,
      `📋 *DATOS DEL CLIENTE Y UBICACIÓN:*`,
      `• *ID Solicitud:* ${request.id}`,
      `• *Nombre:* ${request.name}`,
      `• *Teléfono:* ${request.phone}`,
      `• *Dirección:* ${request.address} (${cityDetail.name})`,
      `• *Servicio:* ${serviceDetail?.name || request.service}`,
      `• *Problema:* ${issueName}`,
      `• *Urgencia:* ${request.urgency === 'urgente' ? 'URGENTE 24H' : 'NORMAL'}`
    ];

    if (requestImages.length > 0) {
      lines.push(``);
      lines.push(`📸 *FOTOS SUBIDAS DE LA AVERÍA (${requestImages.length}):*`);
      requestImages.forEach((imgUrl, i) => {
        lines.push(`  • Foto ${i + 1}: ${imgUrl}`);
      });
    }

    lines.push(``);
    lines.push(`⚡ Solicitamos atención prioritaria y envío de un técnico de guardia a la ubicación. ¡Muchas gracias!`);

    return lines.join('\n');
  };

  return (
    <div className="bg-primary border border-slate-800 text-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl mx-auto my-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent"></div>

      {/* Header section with status badges */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] font-black text-accent bg-accent/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
            {request.urgency === 'urgente' ? '🚨 ASISTENCIA URGENTE 24H' : '📅 CITA EN PROCESO'}
          </span>
          <h3 className="font-display font-black text-xl md:text-2xl mt-2 tracking-tight">
            Estado del Servicio Técnico
          </h3>
          <p className="text-xs text-blue-200/70 mt-1 font-medium">
            ID de solicitud: <span className="font-mono text-white font-bold">{request.id}</span>
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-blue-200 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg transition border border-white/10 cursor-pointer flex items-center gap-1.5 font-bold"
        >
          <X className="w-3.5 h-3.5" />
          <span>Ocultar Rastreador</span>
        </button>
      </div>

      {/* Live Timeline Steps */}
      <div className="py-6 grid grid-cols-3 gap-2 relative">
        <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-white/10 -translate-y-4"></div>
        
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="h-9 w-9 rounded-full bg-success flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-300">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold mt-2 text-white">Recibida</span>
          <span className="text-[9px] text-blue-200/60 mt-0.5 font-medium">Registrada</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            internalStatus === 'received' 
              ? 'bg-white/5 text-blue-200/50 border border-white/10' 
              : internalStatus === 'assigning'
                ? 'bg-secondary text-white animate-pulse shadow-lg shadow-blue-500/20'
                : 'bg-success text-white shadow-lg shadow-emerald-500/20'
          }`}>
            {internalStatus === 'received' ? '2' : internalStatus === 'assigning' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
          </div>
          <span className={`text-xs font-extrabold mt-2 ${internalStatus === 'received' ? 'text-blue-200/50' : 'text-white'}`}>Asignando</span>
          <span className="text-[9px] text-blue-200/60 mt-0.5 font-medium">Técnico de guardia</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            internalStatus !== 'dispatched'
              ? 'bg-white/5 text-blue-200/50 border border-white/10'
              : 'bg-accent text-primary shadow-lg shadow-amber-400/20 animate-pulse'
          }`}>
            {internalStatus !== 'dispatched' ? '3' : <Sparkles className="w-5 h-5 text-primary" />}
          </div>
          <span className={`text-xs font-extrabold mt-2 ${internalStatus !== 'dispatched' ? 'text-blue-200/50' : 'text-accent font-black'}`}>En Camino</span>
          <span className="text-[9px] text-blue-200/60 mt-0.5 font-medium">Desplazamiento gratis</span>
        </div>
      </div>

      {/* Main Status Showcase Container */}
      <div className="bg-slate-950/40 rounded-xl p-5 border border-white/5 space-y-4">
        
        {/* State A: Received - Waiting */}
        {internalStatus === 'received' && (
          <div className="text-center py-4 space-y-2.5 animate-in fade-in duration-300">
            <div className="relative inline-block">
              <span className="flex h-10 w-10 rounded-full bg-secondary/20 animate-ping absolute"></span>
              <div className="h-10 w-10 rounded-full bg-[#0174BE] flex items-center justify-center">
                <Clock className="w-5 h-5 text-white animate-pulse" />
              </div>
            </div>
            <h4 className="text-sm font-extrabold text-white">Procesando Solicitud en Servidor...</h4>
            <p className="text-xs text-blue-200/80 max-w-md mx-auto font-medium">
              Estamos consolidando su solicitud para asignarle el técnico de guardia especializado más cercano en <strong className="text-white font-extrabold">{cityDetail.name}</strong>.
            </p>
          </div>
        )}

        {/* State B: Assigning - Searching */}
        {internalStatus === 'assigning' && (
          <div className="text-center py-4 space-y-2.5 animate-in fade-in duration-300">
            <div className="relative inline-block">
              <span className="flex h-10 w-10 rounded-full bg-secondary/20 animate-ping absolute"></span>
              <div className="h-10 w-10 rounded-full bg-[#0174BE] flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <h4 className="text-sm font-extrabold text-white">Asignando Técnico de Guardia Homologado...</h4>
            <p className="text-xs text-blue-200/80 max-w-md mx-auto font-medium">
              Analizando operarios autorizados en <strong className="text-white font-extrabold">{cityDetail.name}</strong> especializados en <strong className="text-accent">{serviceDetail?.name}</strong>. Tardará solo unos segundos.
            </p>
          </div>
        )}

        {/* State C: Dispatched - Tech Profile revealed */}
        {internalStatus === 'dispatched' && tech && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Split layout: Tech info and ETA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3.5">
                <img
                  src={tech.avatar}
                  alt={tech.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-accent shadow-md"
                  loading="lazy"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-sm">{tech.name}</span>
                    <span className="bg-accent/20 text-accent text-[10px] px-1.5 py-0.5 rounded font-black">
                      ★ {tech.rating}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/70 font-semibold">{tech.specialty}</p>
                  <p className="text-[10px] text-blue-200/50 font-bold uppercase tracking-wider">{tech.completedJobs} intervenciones finalizadas</p>
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                <p className="text-[10px] font-black text-blue-200/70 uppercase tracking-widest">Tiempo de Llegada</p>
                <p className="text-2xl font-black font-display text-accent tracking-tight leading-none mt-1">
                  ~ {countdown} min
                </p>
                <p className="text-[9px] text-success font-black uppercase mt-1 tracking-wider">En camino</p>
              </div>
            </div>

            {/* Tech Action triggers */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href={`tel:${cityDetail.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0174BE] hover:bg-blue-600 text-white text-xs font-black py-3 rounded-lg transition-all cursor-pointer shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contactar con Central (Urgencias)</span>
              </a>
              <a
                href={`https://wa.me/34664065855?text=${encodeURIComponent(buildWhatsappText())}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white text-xs font-black py-3 rounded-lg transition-all cursor-pointer shadow-md"
              >
                {/* Whatsapp Icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.592 1.97 14.12 1.018 11.5 1.017c-5.441 0-9.866 4.372-9.87 9.802 0 1.698.455 3.356 1.32 4.819L1.921 20.3l4.726-1.146zm11.233-5.263c-.312-.156-1.843-.91-2.128-1.014-.283-.103-.49-.156-.694.156-.205.312-.79.99-.968 1.196-.178.205-.357.23-.669.074-1.962-.976-3.136-2.14-3.987-3.6-.23-.396.23-.367.657-1.22.073-.153.037-.287-.018-.396-.056-.109-.49-1.18-.671-1.617-.176-.424-.356-.366-.49-.373-.127-.007-.272-.008-.418-.008-.145 0-.382.055-.582.273-.201.218-.764.747-.764 1.821 0 1.074.782 2.112.891 2.26.11.149 1.539 2.35 3.728 3.292.519.224.925.358 1.242.459.522.166.997.142 1.373.087.419-.061 1.843-.753 2.128-1.445.284-.693.284-1.288.199-1.446-.084-.158-.312-.25-.624-.406z"/>
                </svg>
                <span>Chatear por WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Detailed parameters */}
        <div className="pt-3 border-t border-white/10 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-blue-200/70 font-semibold">Tipo de Servicio:</span>
            <span className="text-white font-extrabold">{serviceDetail?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200/70 font-semibold">Problema reportado:</span>
            <span className="text-white font-extrabold text-right max-w-xs truncate">{issueName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200/70 font-semibold">Titular de la Solicitud:</span>
            <span className="text-white font-extrabold">{request.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200/70 font-semibold">Dirección de asistencia:</span>
            <span className="text-white font-extrabold text-right max-w-xs truncate">{request.address} ({cityDetail.name})</span>
          </div>

          {/* Clickable Image Thumbnails Section */}
          {requestImages.length > 0 && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-accent" />
                  <span>Fotos de la avería adjuntas ({requestImages.length})</span>
                </span>
                <span className="text-[10px] text-blue-200/60 font-semibold">
                  Haz clic para ampliar en pantalla completa
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {requestImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className="group relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 hover:border-accent transition-all cursor-pointer shadow-md bg-black/40 focus:outline-none focus:ring-2 focus:ring-accent"
                    title={`Ver foto ${idx + 1} de la avería en pantalla completa`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Foto ${idx + 1} de la avería`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" />
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 py-0.2 rounded font-mono">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-blue-200/50 font-bold uppercase tracking-wider">
          El técnico le presentará el presupuesto formal y detallado sin compromiso al llegar.
        </p>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedImageIndex !== null && requestImages[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Lightbox Top Header */}
          <div
            className="w-full max-w-5xl flex items-center justify-between px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-white">
              <div className="p-1.5 bg-accent/20 text-accent rounded-lg">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  Vista Previa de la Avería
                </h4>
                <p className="text-[11px] text-blue-200/70 font-semibold">
                  Foto {selectedImageIndex + 1} de {requestImages.length} • {serviceDetail?.name || request.service}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedImageIndex(null)}
              className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
              title="Cerrar vista previa (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Image Frame */}
          <div
            className="relative flex-1 w-full max-w-5xl my-4 flex items-center justify-center min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation Previous Button */}
            {requestImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev !== null ? (prev === 0 ? requestImages.length - 1 : prev - 1) : 0
                  );
                }}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-accent hover:text-primary text-white border border-white/20 transition shadow-2xl cursor-pointer"
                title="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Center Image */}
            <img
              src={requestImages[selectedImageIndex]}
              alt={`Vista ampliada ${selectedImageIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />

            {/* Navigation Next Button */}
            {requestImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev !== null ? (prev === requestImages.length - 1 ? 0 : prev + 1) : 0
                  );
                }}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-accent hover:text-primary text-white border border-white/20 transition shadow-2xl cursor-pointer"
                title="Imagen siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer Controls & Strip */}
          <div
            className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
              {requestImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                    selectedImageIndex === idx ? 'border-accent scale-105 shadow-lg' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <a
                href={`https://wa.me/34664065855?text=${encodeURIComponent(
                  `🚨 *FOTO DE AVERÍA ENVIADA POR CLIENTE (ID: ${request.id})*\n\n• *Nombre:* ${request.name}\n• *Dirección:* ${request.address}\n• *Enlace de la Foto ${selectedImageIndex + 1}:* ${requestImages[selectedImageIndex]}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-green-600 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Enviar foto al WhatsApp del técnico</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

