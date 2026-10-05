import React from 'react';
import { Heart, MessageCircle, Instagram, MapPin, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export const Footer: React.FC = () => {
  const { settings, getWhatsAppUrl, getInstagramUrl } = useCatalog();

  return (
    <footer className="bg-gradient-to-b from-white via-pink-50/40 to-pink-100/60 border-t border-pink-200/80 pt-16 pb-12 mt-20 relative overflow-hidden">
      
      {/* Decorative diffuse elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-pink-200/20 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-pink-200/60">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-xs bg-white p-0.5">
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#2A161E] block">
                  {settings.storeName}
                </span>
                <span className="font-script text-lg sm:text-xl text-[#B8860B] font-medium block">
                  {settings.tagline || 'Sorprende. Regala. Enamora.'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6B4B57] max-w-md font-light leading-relaxed">
              Creamos momentos inolvidables con flores, anchetas y detalles personalizados hechos con amor para celebrar aniversarios, cumpleaños, grados y toda ocasión especial.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl('¡Hola LR Detalles! 🌸 Me gustaría solicitar información sobre sus anchetas y detalles especiales.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105"
                title="Escríbenos por WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
              </a>

              <a
                href={getInstagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105"
                title="Síguenos en Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links / Navigation */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-[#2A161E] uppercase tracking-wider mb-4">
              Atención & Envíos
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B4B57]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>{settings.deliveryCoverage}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <span>Atención WhatsApp: Lunes a Domingo 8:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>Encargos y pedidos con anticipación</span>
              </li>
            </ul>
          </div>

          {/* Boutique Note */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-[#2A161E] uppercase tracking-wider mb-4">
              Información del Catálogo
            </h4>
            <p className="text-xs text-[#7A5B66] leading-relaxed mb-4">
              Los precios presentados en este catálogo interactivo son valores sugeridos de referencia y pueden variar según personalizaciones específicas del cliente.
            </p>
            <p className="text-xs text-[#B8860B] font-medium">
              Montería, Córdoba · Atención personalizada
            </p>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C5D6C] gap-3">
          <p>© {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>para endulzar tus momentos especiales</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
