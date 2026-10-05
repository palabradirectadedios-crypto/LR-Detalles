import React from 'react';
import {
  Sparkles,
  Gift,
  Check,
  MessageCircle,
  Heart,
  Palette,
  Candy,
  Sparkle,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { Category } from '../types/catalog';

interface AnchetaPriceBannerProps {
  category: Category;
}

export const AnchetaPriceBanner: React.FC<AnchetaPriceBannerProps> = ({ category }) => {
  const { getWhatsAppUrl } = useCatalog();

  const whatsappMessage = '¡Hola LR Detalles! 🌸 Me gustaría armar y cotizar una ancheta personalizada a mi gusto.';

  return (
    <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-pink-50/90 via-white to-pink-50/90 border border-pink-200/90 shadow-sm relative overflow-hidden">
      {/* Decorative gold glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* TOP PART: Sección Activa */}
      <div className="mb-6 pb-6 border-b border-pink-200/70">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B] block mb-1">
          Sección Activa
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#2A161E]">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-sm text-[#664C56] font-light mt-1">
            {category.description}
          </p>
        )}
      </div>

      {/* SECOND PART: Guía de Valor & Personalización de Anchetas */}
      <div className="rounded-2xl p-5 sm:p-6 bg-white/95 border border-pink-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#B8860B] text-xs font-semibold uppercase tracking-wider mb-2">
              <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Presupuesto a Tu Medida</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A161E]">
              ¿Cómo se calcula el precio de tu ancheta?
            </h3>
          </div>

          <span className="text-xs text-[#8C5D6C] bg-pink-50/80 px-3 py-1.5 rounded-full border border-pink-100 self-start md:self-auto font-medium">
            100% Personalizable
          </span>
        </div>

        {/* Highlighted exact quote box requested by the user */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-pink-50/60 to-amber-50/70 border border-amber-200/80 mb-5">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-white text-[#B8860B] shadow-2xs shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </span>
            <div>
              <p className="font-serif text-base sm:text-lg text-[#2A161E] font-bold leading-snug">
                El valor: depende de lo que quiera agregar (decoración + cantidad monetaria de dulces, maquillaje, peluches, flores, etc.)
              </p>
              <p className="text-xs text-[#7A5B66] font-light mt-1">
                Tú eliges el presupuesto y nosotros nos encargamos de que luzca espectacular y transmita todo tu cariño.
              </p>
            </div>
          </div>
        </div>

        {/* Elements you can add */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
              <Candy className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#4A2E38]">
              Dulces y chocolates favoritos
            </span>
          </div>

          <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
              <Sparkle className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#4A2E38]">
              Maquillaje o skincare
            </span>
          </div>

          <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#4A2E38]">
              Peluches y flores eternas
            </span>
          </div>

          <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
              <Palette className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#4A2E38]">
              Cajas decoradas
            </span>
          </div>
        </div>

        {/* WhatsApp Custom Quote Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-pink-100/80">
          <span className="text-xs text-[#7A5B66] text-center sm:text-left">
            ¿Tienes una idea en mente o un presupuesto específico? Escríbenos y te asesoramos al instante.
          </span>
          <a
            href={getWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-medium text-xs shadow-md transition-all shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Cotizar mi Ancheta por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
