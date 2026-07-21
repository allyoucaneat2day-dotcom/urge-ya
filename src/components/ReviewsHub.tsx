import React, { useState } from 'react';
import { Star, MessageSquarePlus, User, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Review, CityId } from '../types';
import { CITIES } from '../data';

interface ReviewsHubProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ReviewsHub({ reviews, onAddReview }: ReviewsHubProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('Barcelona');
  const [service, setService] = useState('Fontanería');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    onAddReview({
      name,
      city,
      rating,
      text,
      service
    });

    // Reset Form
    setName('');
    setText('');
    setRating(5);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setIsFormOpen(false);
    }, 2000);
  };

  // Calculate stats
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header section with overall scores */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-[#0174BE]/10 px-3 py-1 rounded-full">
              Testimonios Reales
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary mt-4 tracking-tight">
              Opiniones de Nuestros Clientes
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
              Nuestra prioridad absoluta es ofrecer una atención de la máxima calidad. Conozca las experiencias reales de propietarios a los que hemos asistido recientemente.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-bg-light border border-slate-200 p-5 rounded-2xl w-full md:w-auto shadow-sm">
            <div className="text-center shrink-0 border-r border-slate-200 pr-5">
              <span className="text-4xl font-black font-display text-primary tracking-tight">{averageRating}</span>
              <span className="text-slate-400 font-bold text-sm">/5</span>
              <div className="flex gap-0.5 text-[#FFC436] mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">De {reviews.length} opiniones</p>
            </div>

            <div className="flex-1">
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="w-full bg-primary hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Dejar mi Opinión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Review slide-down panel */}
        {isFormOpen && (
          <div className="bg-bg-light border border-slate-200 rounded-2xl p-6 mb-10 max-w-xl mx-auto animate-in fade-in slide-in-from-top-3 duration-200 shadow-md">
            {successMsg ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto animate-bounce" />
                <h4 className="font-extrabold text-slate-950 text-base">¡Reseña Publicada con Éxito!</h4>
                <p className="text-xs text-slate-500 font-medium">Gracias por su comentario. Ayuda enormemente a otros clientes en su elección.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-display font-extrabold text-primary text-sm uppercase tracking-wide">
                  Escribe tu Reseña sobre Urge Ya
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Manuel García"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Servicio Realizado</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-secondary"
                    >
                      <option>Fontanería</option>
                      <option>Electricidad</option>
                      <option>Calentadores</option>
                      <option>Aire Acondicionado</option>
                      <option>Gas</option>
                      <option>Manitas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Población / Ciudad</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-secondary"
                    >
                      {Object.values(CITIES).map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Calificación</label>
                    <div className="flex items-center gap-1.5 h-8">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isFilled = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
                        return (
                          <button
                            type="button"
                            key={starValue}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="text-[#FFC436] hover:scale-110 cursor-pointer transition focus:outline-none"
                          >
                            <Star className={`w-5 h-5 ${isFilled ? 'fill-current' : 'text-slate-300'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Tu Comentario</label>
                  <textarea
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Cuéntanos qué problema tenías y cómo fue la atención del técnico de guardia..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-secondary"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-lg text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-secondary hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs cursor-pointer shadow-sm"
                  >
                    Enviar Comentario
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews list grid layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-slate-200 hover:border-secondary/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Star rating and category tag */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-0.5 text-[#FFC436]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-current' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-secondary bg-[#0174BE]/10 px-2.5 py-1 rounded-full">
                    {review.service}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-xs leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="border-t border-slate-150 mt-4 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{review.name}</span>
                </div>
                <div className="flex items-center gap-1 font-bold">
                  <MapPin className="w-2.5 h-2.5 text-slate-400" />
                  <span>{review.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
