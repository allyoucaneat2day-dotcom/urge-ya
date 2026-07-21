import React, { useState, useEffect } from 'react';
import { Clock, Phone, MapPin, CheckCircle2, UserCheck, CheckCircle, ShieldAlert, ArrowRight, Loader2, Sparkles, X } from 'lucide-react';
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

  // Auto assign random tech on mounting
  useEffect(() => {
    const randomTech = MOCK_TECHNICIANS[Math.floor(Math.random() * MOCK_TECHNICIANS.length)];
    setTech(randomTech);
    setCountdown(randomTech.etaMinutes);
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
                href="https://wa.me/34664065855"
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
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-blue-200/50 font-bold uppercase tracking-wider">
          El técnico le presentará el presupuesto formal y detallado sin compromiso al llegar.
        </p>
      </div>
    </div>
  );
}
