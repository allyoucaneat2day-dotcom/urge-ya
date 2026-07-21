import React, { useState, useEffect } from 'react';
import {
  CalendarRange,
  Gauge,
  Droplet,
  Bolt,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  HeartHandshake,
  Activity,
  ArrowRight,
  BookOpen
} from 'lucide-react';

import { CityId, ServiceId, ServiceIssue, BookingRequest, Review } from './types';
import { CITIES, SERVICES, INITIAL_REVIEWS } from './data';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ServiceExplorer from './components/ServiceExplorer';
import BookingWizard from './components/BookingWizard';
import RequestTracker from './components/RequestTracker';
import ReviewsHub from './components/ReviewsHub';
import FAQSection from './components/FAQSection';
import CookieBanner from './components/CookieBanner';
import AIAssistant from './components/AIAssistant';

export default function App() {
  // States
  const [currentCityId, setCurrentCityId] = useState<CityId>('barcelona');
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId>('fontaneria');
  const [selectedIssue, setSelectedIssue] = useState<ServiceIssue | null>(null);
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingRequest | null>(null);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const currentCity = CITIES[currentCityId];

  // Load state from localStorage on init
  useEffect(() => {
    // 1. Title updates dynamically based on current city selection
    document.title = `Urge Ya | Servicio Técnico de Urgencia en ${currentCity.name}`;

    // 2. Load active booking
    const savedBooking = localStorage.getItem('reparaya_active_booking');
    if (savedBooking) {
      try {
        setActiveBooking(JSON.parse(savedBooking));
      } catch (e) {
        console.error('Error parsing active booking', e);
      }
    }

    // 3. Load user reviews
    const savedReviews = localStorage.getItem('reparaya_user_reviews');
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews);
        setReviews([...INITIAL_REVIEWS, ...parsed]);
      } catch (e) {
        console.error('Error parsing custom reviews', e);
      }
    }
  }, [currentCityId, currentCity.name]);

  // Handle city selection changes
  const handleCityChange = (cityId: CityId) => {
    setCurrentCityId(cityId);
  };

  // Handle service selector tabs
  const handleServiceSelect = (serviceId: ServiceId) => {
    setSelectedServiceId(serviceId);
  };

  // Handle quick repair request trigger from Explorer card
  const handleIssueSelect = (serviceId: ServiceId, issue: ServiceIssue) => {
    setSelectedServiceId(serviceId);
    setSelectedIssue(issue);
    setIsBookingOpen(true);
  };

  // Handle custom manual modal open
  const handleOpenBookingWizard = () => {
    setSelectedIssue(null);
    setIsBookingOpen(true);
  };

  // Submit Booking request handler
  const handleBookingSubmit = (newBookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const bookingId = `RY-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullBooking: BookingRequest = {
      ...newBookingData,
      id: bookingId,
      status: 'received',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('reparaya_active_booking', JSON.stringify(fullBooking));
    setActiveBooking(fullBooking);

    // Scroll smoothly to active tracker
    setTimeout(() => {
      const element = document.getElementById('active-tracker-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Handle active tracker state update
  const handleStatusChange = (status: 'received' | 'assigning' | 'dispatched' | 'completed') => {
    if (activeBooking) {
      const updated = { ...activeBooking, status };
      localStorage.setItem('reparaya_active_booking', JSON.stringify(updated));
    }
  };

  // Cancel / Close active booking tracker
  const handleCancelBooking = () => {
    if (confirm('¿Desea ocultar el seguimiento en vivo? La solicitud seguirá registrada para el técnico.')) {
      localStorage.removeItem('reparaya_active_booking');
      setActiveBooking(null);
    }
  };

  // Add review handler
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const reviewId = `REV-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullReview: Review = {
      ...newReviewData,
      id: reviewId,
      date: new Date().toISOString().split('T')[0]
    };

    const savedReviewsString = localStorage.getItem('reparaya_user_reviews');
    let savedList = [];
    if (savedReviewsString) {
      try {
        savedList = JSON.parse(savedReviewsString);
      } catch (e) {
        console.error(e);
      }
    }
    
    savedList.push(fullReview);
    localStorage.setItem('reparaya_user_reviews', JSON.stringify(savedList));
    setReviews([...INITIAL_REVIEWS, ...savedList]);
  };

  const handleWhatsappClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hola, necesito asistencia técnica en ${currentCity.name}.`;
    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/34664065855?text=${encodedText}`, '_blank');
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans flex flex-col justify-between">
      
      {/* 1. Header & Navigation */}
      <Navbar
        currentCity={currentCity}
        onCityChange={handleCityChange}
        onServiceSelect={handleServiceSelect}
      />

      {/* 2. Hero banner */}
      <HeroSection
        currentCity={currentCity}
        onOpenBookingWizard={handleOpenBookingWizard}
      />

      {/* 3. Live active request tracker */}
      {activeBooking && (
        <div id="active-tracker-container" className="py-4 bg-slate-100 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <RequestTracker
              request={activeBooking}
              onCancel={handleCancelBooking}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}

      {/* 4. Value Propositions section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Nuestras Garantías
            </span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Más de 25 Años de Experiencia en el Sector
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Trabajamos bajo estándares de máxima rigurosidad técnica para que tu tranquilidad y seguridad estén garantizadas en todo momento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Cita inmediata */}
            <div className="flex flex-col items-center text-center p-5 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md rounded-2xl transition">
              <div className="p-3 bg-blue-100/60 text-blue-600 rounded-xl mb-4 shrink-0">
                <CalendarRange className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-950 text-base mb-2">Cita Inmediata</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Asignamos una visita técnica con el especialista especializado <strong className="text-blue-600">el mismo día</strong> de su llamada o solicitud.
              </p>
            </div>

            {/* Card 2: Servicio Urgente */}
            <div className="flex flex-col items-center text-center p-5 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md rounded-2xl transition">
              <div className="p-3 bg-amber-100/60 text-amber-600 rounded-xl mb-4 shrink-0">
                <Gauge className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-950 text-base mb-2">Asistencia URGENTE</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Retén activo las 24 horas. Desplazamiento <strong className="text-amber-700">prioritario</strong> todos los días del año, festivos incluidos.
              </p>
            </div>

            {/* Card 3: Fontanería Integral */}
            <div className="flex flex-col items-center text-center p-5 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md rounded-2xl transition">
              <div className="p-3 bg-emerald-100/60 text-emerald-600 rounded-xl mb-4 shrink-0">
                <Droplet className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-950 text-base mb-2">Fontanería Integral</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Solución definitiva a fugas complejas, localización de humedades, desatascos severos e instalación de redes sanitarias.
              </p>
            </div>

            {/* Card 4: Electricidad Autorizada */}
            <div className="flex flex-col items-center text-center p-5 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md rounded-2xl transition">
              <div className="p-3 bg-purple-100/60 text-purple-600 rounded-xl mb-4 shrink-0">
                <Bolt className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-950 text-base mb-2">Electricidad Autorizada</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Diagnósticos seguros de apagones, aumentos de potencia con boletines CIE y reformas de cuadros eléctricos según normativa RBT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services and Rates Explorer */}
      <ServiceExplorer
        selectedServiceId={selectedServiceId}
        onServiceSelect={handleServiceSelect}
        onIssueSelect={handleIssueSelect}
      />

      {/* 6. Legalizations & Certificates spotlight poster */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="font-display font-black text-slate-950 text-2xl md:text-3xl text-center mb-10 tracking-tight">
            Servicios Destacados de Certificación e Instalaciones
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Poster Card 1 */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg h-80 md:h-[380px] border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80"
                alt="Legalizaciones Luz y Gas"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col justify-end p-6 md:p-8">
                <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase mb-1">Boletines Oficiales</span>
                <h4 className="font-display font-extrabold text-white text-lg md:text-xl leading-tight">
                  LEGALIZACIONES DE LUZ, AGUA Y GAS
                </h4>
                <p className="text-slate-300 text-xs mt-2 max-w-md leading-relaxed">
                  Emitimos certificados oficiales de instalaciones eléctricas (CIE), boletines de agua y certificados de subsanación de anomalías de inspecciones periódicas de gas.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleOpenBookingWizard}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:text-white transition cursor-pointer"
                  >
                    <span>Solicitar certificado técnico</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Poster Card 2 */}
            <div className="group relative rounded-2xl overflow-hidden shadow-lg h-80 md:h-[380px] border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80"
                alt="Servicio de fontanería"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col justify-end p-6 md:p-8">
                <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase mb-1">Asistencia Rápida</span>
                <h4 className="font-display font-extrabold text-white text-lg md:text-xl leading-tight">
                  FONTANERÍA Y SANEAMIENTO PROFESIONAL
                </h4>
                <p className="text-slate-300 text-xs mt-2 max-w-md leading-relaxed">
                  Técnicos especialistas equipados con cámaras térmicas y herramientas avanzadas de detección de fugas para reparar averías de fontanería sin romper de forma innecesaria.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSelectedServiceId('fontaneria');
                      const element = document.getElementById('services-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:text-white transition cursor-pointer"
                  >
                    <span>Ver tarifas de fontanería</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. About section (NOSOTROS) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Trayectoria y Confianza
            </span>
            
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-none">
              Nosotros
            </h3>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              En <strong className="text-slate-950 font-semibold">Urge Ya</strong> nos esforzamos diariamente para consolidarnos como el servicio de asistencia técnica de referencia en Barcelona, Madrid y Valencia. Nuestro equipo está compuesto por fontaneros, electricistas y operarios de gas homologados por industria con dilatada experiencia práctica.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              Entendemos que una avería en el hogar o negocio altera tu rutina y genera incomodidad. Por ello, nuestra misión principal radica en ofrecer una respuesta rápida, tarifas justas informadas de antemano por escrito, y resultados de máxima garantía.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 text-sm">Experiencia y Profesionalidad</span>
                  <p className="text-[11px] text-slate-500">Operarios certificados por industria con más de 25 años en el sector.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 text-sm">Atención Inmediata</span>
                  <p className="text-[11px] text-slate-500">Unidades móviles localizadas estratégicamente en toda la provincia.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 text-sm">Garantías y Seguros</span>
                  <p className="text-[11px] text-slate-500">Garantía legal por escrito y seguro de responsabilidad civil integral.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 text-sm">Transparencia Total</span>
                  <p className="text-[11px] text-slate-500">Presupuestos detallados antes de trabajar. Sin costes ocultos.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80 md:h-96 lg:h-[450px]">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a268e?auto=format&fit=crop&w=800&q=80"
              alt="Servicio técnico Urge Ya"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/20"></div>
          </div>
        </div>
      </section>

      {/* 8. Interactive Reviews section */}
      <ReviewsHub
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* 9. Interactive FAQ Section */}
      <FAQSection />

      {/* 10. Footer */}
      <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
              <span className="text-white">URGE <span className="text-amber-400">YA</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Servicio de asistencia técnica domiciliaria integral y urgente las 24 horas. Electricistas, fontaneros y técnicos homologados cerca de ti en Barcelona, Madrid y Valencia.
            </p>
            <p className="text-xs text-slate-500 font-semibold font-mono">
              Atención Directa: Llame hoy mismo a nuestras oficinas locales.
            </p>
          </div>

          {/* Col 2: Delegations */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">Delegaciones Activas</h5>
            <div className="space-y-3">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <p className="font-bold text-xs text-slate-200">Barcelona Central</p>
                <p className="text-[10px] text-slate-500">Telf: 696 669 689</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <p className="font-bold text-xs text-slate-200">Madrid Central</p>
                <p className="text-[10px] text-slate-500">Telf: 611 223 344</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <p className="font-bold text-xs text-slate-200">Valencia Central</p>
                <p className="text-[10px] text-slate-500">Telf: 633 445 566</p>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Enlaces de interés</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services-section" className="hover:text-amber-400 transition">Boletín Eléctrico CIE</a></li>
              <li><a href="#services-section" className="hover:text-amber-400 transition">Corrección de Anomalías de Gas</a></li>
              <li><a href="#services-section" className="hover:text-amber-400 transition">Localización de Fugas de Agua</a></li>
              <li><a href="#services-section" className="hover:text-amber-400 transition">Reparación de Calderas Multimarca</a></li>
              <li><a href="#" className="underline hover:text-amber-400 transition">Blog Técnico & Consejos del Hogar</a></li>
            </ul>
          </div>

          {/* Col 4: Trust Seal */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Empresa Homologada</h5>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3 items-center">
              <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Certificación Oficial</p>
                <p className="text-[10px] text-slate-500 leading-snug">Técnicos certificados por el Ministerio de Industria.</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-500">
              Seguro de Responsabilidad Civil de hasta 1.200.000€ contratado para la total protección de su propiedad durante las obras.
            </div>
          </div>

        </div>

        {/* Legal Disclaimer Sub-footer */}
        <div className="max-w-7xl mx-auto px-4 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest text-center">
          <div>
            © {new Date().getFullYear()} URGE YA. TODOS LOS DERECHOS RESERVADOS.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition underline">AVISO LEGAL</a>
            <a href="#" className="hover:text-slate-300 transition underline">POLÍTICA DE PRIVACIDAD</a>
            <a href="#" className="hover:text-slate-300 transition underline">POLÍTICA DE COOKIES</a>
          </div>
        </div>
      </footer>

      {/* 11. Custom widgets: Floating actions at corners (AIAssistant and Whatsapp) */}
      <AIAssistant
        currentCity={currentCity}
        onOpenBookingWizard={(serviceId, issue) => {
          if (serviceId) setSelectedServiceId(serviceId as any);
          if (issue) setSelectedIssue(issue as any);
          setIsBookingOpen(true);
        }}
      />

      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="#"
          onClick={handleWhatsappClick}
          className="flex flex-col items-center justify-center bg-[#25D366] hover:bg-[#20ba59] text-white h-16 w-16 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
          title="WhatsApp Urgente"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.592 1.97 14.12 1.018 11.5 1.017c-5.441 0-9.866 4.372-9.87 9.802 0 1.698.455 3.356 1.32 4.819L1.921 20.3l4.726-1.146zm11.233-5.263c-.312-.156-1.843-.91-2.128-1.014-.283-.103-.49-.156-.694.156-.205.312-.79.99-.968 1.196-.178.205-.357.23-.669.074-1.962-.976-3.136-2.14-3.987-3.6-.23-.396.23-.367.657-1.22.073-.153.037-.287-.018-.396-.056-.109-.49-1.18-.671-1.617-.176-.424-.356-.366-.49-.373-.127-.007-.272-.008-.418-.008-.145 0-.382.055-.582.273-.201.218-.764.747-.764 1.821 0 1.074.782 2.112.891 2.26.11.149 1.539 2.35 3.728 3.292.519.224.925.358 1.242.459.522.166.997.142 1.373.087.419-.061 1.843-.753 2.128-1.445.284-.693.284-1.288.199-1.446-.084-.158-.312-.25-.624-.406z" />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-wider -mt-0.5">Urgente</span>
        </a>
      </div>

      {/* 12. Booking Wizard Modal */}
      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServiceId={selectedServiceId}
        selectedIssue={selectedIssue}
        currentCityId={currentCityId}
        onSubmit={handleBookingSubmit}
      />

      {/* 13. Persistent Consent Cookie Banner */}
      <CookieBanner />

    </div>
  );
}
