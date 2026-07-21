import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, Settings, ShieldCheck } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('reparaya_cookie_consent');
    if (!consent) {
      // Small delay to make it feel natural
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('reparaya_cookie_consent', JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setIsVisible(false);
  };

  const handleSaveSelection = () => {
    localStorage.setItem('reparaya_cookie_consent', JSON.stringify({ essential: true, analytics, marketing }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl p-4 md:p-5 text-slate-850 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Information text */}
        <div className="flex items-start gap-3 flex-1">
          <div className="bg-slate-50 text-slate-700 p-2 rounded-xl shrink-0 border border-slate-100">
            <ShieldAlert className="w-5 h-5 text-secondary" />
          </div>
          <div className="space-y-1 text-left">
            <p className="text-xs md:text-sm font-extrabold text-primary leading-none">
              Aviso de Privacidad y Cookies
            </p>
            <p className="text-slate-600 text-xs leading-relaxed max-w-3xl font-medium">
              Utilizamos cookies para garantizar la seguridad del sitio, analizar el rendimiento del tráfico y personalizar la experiencia del usuario de asistencia de urgencia en su delegación de Barcelona, Madrid o Valencia.
            </p>
          </div>
        </div>

        {/* Call to actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold px-4 py-2.5 rounded-lg transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Gestionar Consentimiento</span>
          </button>
          
          <button
            onClick={handleAcceptAll}
            className="flex items-center gap-1 bg-secondary hover:bg-blue-700 text-white text-xs font-black px-5 py-2.5 rounded-lg transition cursor-pointer shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Aceptar Todo</span>
          </button>
        </div>
      </div>

      {/* Advanced toggle settings drawer */}
      {showSettings && (
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-150 grid md:grid-cols-3 gap-4 animate-in fade-in duration-150 text-left">
          
          {/* Toggle 1: Essential (Required) */}
          <div className="bg-bg-light p-3.5 rounded-xl flex items-center justify-between border border-slate-200">
            <div>
              <p className="text-xs font-extrabold text-primary">Cookies Técnicas (Esenciales)</p>
              <p className="text-[10px] text-slate-500 font-bold">Necesarias para guardar sus decisiones de consentimiento y solicitudes.</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">Obligatorio</span>
          </div>

          {/* Toggle 2: Analytics */}
          <div className="bg-bg-light p-3.5 rounded-xl flex items-center justify-between border border-slate-200">
            <div>
              <p className="text-xs font-extrabold text-primary">Cookies de Rendimiento (Estadísticas)</p>
              <p className="text-[10px] text-slate-500 font-bold">Recogen datos anónimos para mejorar la navegación del portal técnico.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={() => setAnalytics(!analytics)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>

          {/* Toggle 3: Marketing */}
          <div className="bg-bg-light p-3.5 rounded-xl flex items-center justify-between border border-slate-200">
            <div>
              <p className="text-xs font-extrabold text-primary">Cookies de Marketing / Anuncios</p>
              <p className="text-[10px] text-slate-500 font-bold">Permiten medir el retorno de campañas locales de anuncios en buscadores.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={() => setMarketing(!marketing)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>

          {/* Accept Selection save button */}
          <div className="md:col-span-3 flex justify-end mt-2">
            <button
              onClick={handleSaveSelection}
              className="flex items-center gap-1 bg-primary hover:bg-slate-800 text-white text-xs font-black px-5 py-2.5 rounded-lg cursor-pointer transition shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Guardar Configuración Personalizada</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
