import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FAQS } from '../data';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-bg-light">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Title and subtitle */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-[#0174BE]/10 px-3 py-1 rounded-full">
            Resolviendo Dudas
          </span>
          <h2 className="font-display text-3xl font-extrabold text-primary mt-4 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-600 text-xs md:text-sm mt-3 leading-relaxed">
            Consulte las respuestas rápidas a las consultas más habituales de nuestros clientes sobre el servicio técnico urgente y los presupuestos.
          </p>
        </div>

        {/* Collapsible Accordion Grid */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-250 ${
                  isOpen ? 'border-secondary/40 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full text-left p-5 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-secondary' : 'text-slate-400'}`} />
                    <span className="font-extrabold text-primary text-sm md:text-base tracking-tight leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-lg transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-secondary bg-[#0174BE]/10' : 'text-slate-400 bg-slate-50'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer utilizing motion/react */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.23, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-1.5 border-t border-slate-100 text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Quick Contact Banner */}
        <div className="mt-12 bg-primary text-white rounded-2xl p-8 border border-primary text-center space-y-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent"></div>
          <h4 className="font-display font-extrabold text-sm uppercase tracking-widest text-accent">¿Tiene otra consulta técnica o comercial?</h4>
          <p className="text-blue-100 text-xs max-w-lg mx-auto font-semibold">
            Nuestros operadores telefónicos de guardia están listos para responderle al instante sin compromiso alguno.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 font-mono text-xs px-5 py-2.5 rounded-xl text-white font-bold shadow-inner">
              Línea Directa Soporte Cliente: Llame a su delegación más cercana
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
