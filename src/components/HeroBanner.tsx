import React from 'react';
import { Sparkles, Heart, Clock, Gift, ShieldCheck, ArrowDown } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export const HeroBanner: React.FC = () => {
  const { settings, setActiveFilter, getWhatsAppUrl } = useCatalog();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:py-20 bg-gradient-to-b from-pink-100/70 via-pink-50/50 to-[#FFF6F8]">
      {/* Soft diffuse atmospheric glow background */}
      <div className="absolute inset-0 pointer-events-none diffuse-glow opacity-80" />
      <div className="absolute top-1/4 right-5 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-5 w-96 h-96 rounded-full bg-rose-100/50 blur-3xl pointer-events-none" />

      {/* Floating subtle decorative petal accents */}
      <div className="absolute top-12 left-10 text-pink-300/40 animate-pulse text-2xl select-none pointer-events-none">
        🌸
      </div>
      <div className="absolute top-24 right-16 text-rose-300/40 animate-bounce text-xl select-none pointer-events-none">
        ✨
      </div>
      <div className="absolute bottom-12 right-1/4 text-pink-300/30 text-3xl select-none pointer-events-none">
        🌷
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Text / Value Proposition */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-pink-200/90 shadow-2xs mb-5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8C5D6C]">
                Encuentra el regalo perfecto
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#2A161E] tracking-tight leading-[1.15] mb-5">
              Expresa lo que sientes con{' '}
              <span className="italic font-serif text-[#B8860B] font-medium block sm:inline">
                detalles inolvidables
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#61454F] max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed mb-8">
              Bienvenido al catálogo digital de LR Detalles. Descubre nuestra selección de anchetas, ramos de flores eternas y en limpiapipas, cajas de regalo personalizadas y detalles diseñados para tocar corazones.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 mb-8 w-full max-w-xs sm:max-w-none mx-auto lg:mx-0">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium text-sm shadow-md hover:shadow-lg hover:from-pink-600 hover:to-rose-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explorar Catálogo</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>

              <a
                href={getWhatsAppUrl(
                  '¡Hola LR Detalles! 🌸 Me gustaría recibir asesoría para un detalle especial.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-[#703D4E] border border-pink-200 font-medium text-sm shadow-xs hover:border-[#D4AF37] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Asesoría Personalizada</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 pt-4 border-t border-pink-200/60">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#2A161E]">100%</span>
                <span className="text-xs text-[#7A5B66]">Personalizado</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#2A161E]">Variedad</span>
                <span className="text-xs text-[#7A5B66]">de opciones para elegir</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#2A161E]">Rápido</span>
                <span className="text-xs text-[#7A5B66]">Respuesta inmediata</span>
              </div>
            </div>
          </div>

          {/* Right Logo & Boutique Presentation Graphic */}
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-md">
            <div className="relative mx-auto aspect-square p-4 sm:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-pink-200/80 shadow-xl">
              {/* Outer decorative gold ring */}
              <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#D4AF37]/40 pointer-events-none" />
              <div className="absolute inset-3 sm:inset-4 rounded-xl border border-pink-200/50 pointer-events-none" />

              {/* Logo Image */}
              <div className="w-full h-full rounded-xl overflow-hidden shadow-inner bg-pink-50 relative group">
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay Tag */}
                <div className="absolute bottom-3 left-3 right-3 py-2 px-3 bg-white/90 backdrop-blur-md rounded-lg border border-pink-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                    <span className="text-xs font-serif font-semibold text-[#3D232C]">
                      Hecho a mano con amor
                    </span>
                  </div>
                  <span className="text-[11px] text-[#B8860B] font-medium tracking-wide">
                    {settings.storeName}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
