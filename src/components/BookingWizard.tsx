import React, { useState, useEffect } from 'react';
import { X, Send, ChevronRight, CheckCircle2, ShieldCheck, Flame, Droplet, Bolt, Wind, Activity, Wrench, AlertTriangle } from 'lucide-react';
import { SERVICES, CITIES } from '../data';
import { CityId, ServiceId, ServiceIssue, BookingRequest } from '../types';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServiceId: ServiceId;
  selectedIssue: ServiceIssue | null;
  currentCityId: CityId;
  onSubmit: (request: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export default function BookingWizard({
  isOpen,
  onClose,
  selectedServiceId,
  selectedIssue,
  currentCityId,
  onSubmit
}: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceId>(selectedServiceId);
  const [issueId, setIssueId] = useState<string>(selectedIssue?.id || 'custom');
  const [customIssue, setCustomIssue] = useState('');
  
  // Contact details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<CityId>(currentCityId);
  const [address, setAddress] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgente'>('normal');

  // Sync inputs with selected props
  useEffect(() => {
    if (selectedServiceId) {
      setService(selectedServiceId);
    }
    if (selectedIssue) {
      setIssueId(selectedIssue.id);
    } else {
      setIssueId('custom');
    }
  }, [selectedServiceId, selectedIssue]);

  useEffect(() => {
    if (currentCityId) {
      setCity(currentCityId);
    }
  }, [currentCityId]);

  if (!isOpen) return null;

  const currentServiceDetails = SERVICES.find((s) => s.id === service) || SERVICES[0];

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (issueId === 'custom' && !customIssue.trim()) {
        alert('Por favor, describa brevemente el problema que necesita solucionar.');
        return;
      }
      setStep(2);
    }
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate step 2
    if (!name.trim()) {
      alert('Por favor, introduzca su nombre.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      alert('Por favor, introduzca un número de teléfono de contacto válido (mínimo 9 dígitos).');
      return;
    }
    if (!address.trim()) {
      alert('Por favor, introduzca la dirección de la avería.');
      return;
    }

    // Submit request
    onSubmit({
      name,
      phone,
      city,
      service,
      issueId: issueId === 'custom' ? undefined : issueId,
      customIssue: issueId === 'custom' ? customIssue : undefined,
      address,
      urgency
    });
    
    // Reset state & close
    setStep(1);
    setCustomIssue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-lg border border-slate-200">
          
          {/* Header */}
          <div className="bg-primary text-white px-6 py-4 flex justify-between items-center relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent"></div>
            <div>
              <h3 className="font-display font-extrabold text-lg tracking-tight">Solicitud de Técnico Autorizado</h3>
              <p className="text-[10px] text-blue-200 font-extrabold uppercase tracking-wider">Presupuesto sin compromiso - Desplazamiento Gratis</p>
            </div>
            <button 
              onClick={onClose}
              className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps indicator */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex justify-between items-center text-xs font-extrabold text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                step >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
              }`}>1</span>
              <span className={step >= 1 ? 'text-primary' : ''}>Avería</span>
            </div>
            <div className="h-px bg-slate-200 flex-1 mx-4"></div>
            <div className="flex items-center gap-1.5">
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
              }`}>2</span>
              <span className={step === 2 ? 'text-primary' : ''}>Contacto y Dirección</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
            {step === 1 ? (
              /* STEP 1: SERVICE & PROBLEM DETAILS */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">
                    ¿Qué tipo de avería o servicio necesita?
                  </label>
                  <select
                    value={service}
                    onChange={(e) => {
                      setService(e.target.value as ServiceId);
                      setIssueId('custom');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 font-extrabold focus:outline-none focus:border-secondary focus:bg-white transition"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">
                    Seleccione un problema común o indique otro
                  </label>
                  <div className="space-y-2">
                    {currentServiceDetails.commonIssues.map((issue) => (
                      <label
                        key={issue.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer text-left ${
                          issueId === issue.id
                            ? 'bg-blue-50/40 border-secondary shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="issue"
                          value={issue.id}
                          checked={issueId === issue.id}
                          onChange={() => setIssueId(issue.id)}
                          className="mt-1 text-secondary focus:ring-secondary"
                        />
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">{issue.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold">Precio orientativo: <strong className="text-secondary">{issue.avgPrice}</strong></div>
                        </div>
                      </label>
                    ))}

                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer text-left ${
                        issueId === 'custom'
                          ? 'bg-blue-50/40 border-secondary shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issue"
                        value="custom"
                        checked={issueId === 'custom'}
                        onChange={() => setIssueId('custom')}
                        className="mt-1 text-secondary focus:ring-secondary"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Describir otra avería / Servicio general</div>
                        <div className="text-[10px] text-slate-400 font-bold">Explíquenos qué ocurre y le daremos un presupuesto a medida.</div>
                      </div>
                    </label>
                  </div>
                </div>

                {issueId === 'custom' && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">
                      Descripción de la avería
                    </label>
                    <textarea
                      value={customIssue}
                      onChange={(e) => setCustomIssue(e.target.value)}
                      placeholder="Ej. El grifo de la cocina gotea de forma constante o Huele un poco a gas al encender la caldera..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-secondary focus:bg-white transition"
                    ></textarea>
                  </div>
                )}
              </div>
            ) : (
              /* STEP 2: CONTACT DETAILS */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">
                      Su Nombre
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Carlos Martínez"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">
                      Teléfono Móvil
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 600 123 456"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">
                      Delegación
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value as CityId)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-secondary focus:bg-white transition"
                    >
                      {Object.values(CITIES).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">
                      Dirección Completa
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej. Calle Mayor 12, 3º B o Av. Diagonal 450"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">
                    Nivel de Urgencia
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUrgency('normal')}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition cursor-pointer ${
                        urgency === 'normal'
                          ? 'bg-blue-50/30 border-secondary'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-900">Normal / Con Cita</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Atención programada hoy o mañana sin recargo.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUrgency('urgente')}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition cursor-pointer ${
                        urgency === 'urgente'
                          ? 'bg-amber-400/10 border-accent shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>URGENTE (24H)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Salida inmediata en menos de 15-30 minutos.</span>
                    </button>
                  </div>
                </div>

                {/* Secure Trust Stamp */}
                <div className="bg-slate-50 rounded-xl p-3 flex gap-2 items-center border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-success shrink-0" />
                  <span className="text-[10px] text-slate-500 font-medium leading-tight">
                    Sus datos de contacto se procesan de forma estrictamente confidencial para coordinar la visita del técnico de guardia y en ningún caso se venderán a terceros.
                  </span>
                </div>
              </div>
            )}

            {/* Actions Buttons */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-extrabold cursor-pointer transition"
                >
                  Volver atrás
                </button>
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-5 py-2.5 bg-secondary hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold cursor-pointer transition flex items-center gap-1 shadow-sm"
                >
                  <span>Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-2.5 bg-accent text-primary rounded-lg text-xs font-black cursor-pointer transition flex items-center gap-1.5 shadow-md hover:bg-amber-400"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirmar Solicitud</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
