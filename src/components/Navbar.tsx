import React, { useState } from 'react';
import {
  Heart,
  Search,
  MessageCircle,
  Instagram,
  Sparkles,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Flower2,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export const Navbar: React.FC = () => {
  const {
    settings,
    getWhatsAppUrl,
    getInstagramUrl,
    wishlist,
    setIsWishlistOpen,
    isAdminOpen,
    setIsAdminOpen,
    activeFilter,
    setActiveFilter,
  } = useCatalog();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-pink-100 shadow-xs transition-all">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-pink-100/90 via-pink-50 to-pink-100/90 text-[#5C3A46] text-xs py-1 px-3 text-center border-b border-pink-200/50 flex items-center justify-center gap-1.5 overflow-hidden">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse shrink-0"></span>
        <span className="font-medium text-[11px] sm:text-xs truncate">
          Envíos personalizados solo en la ciudad de Montería
        </span>
        <span className="hidden md:inline text-pink-400">✦</span>
        <span className="hidden md:inline font-normal text-pink-700">
          Atención y pedidos directos por WhatsApp
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand Identity (Double click on company name enters admin mode) */}
          <div className="flex items-center gap-2 sm:gap-3.5 select-none min-w-0 flex-1">
            <div
              className="group flex items-center gap-2 sm:gap-3 cursor-pointer focus:outline-hidden min-w-0"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveFilter({ categoryId: 'all', searchQuery: '', priceRange: 'all', selectedTag: 'all' });
              }}
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsAdminOpen(true);
              }}
              title="LR Detalles · Doble clic para acceder al modo administrador"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 border border-[#D4AF37]/50 shadow-sm transition-transform duration-300 group-hover:scale-105 bg-white shrink-0">
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div
                className="flex flex-col min-w-0"
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsAdminOpen(true);
                }}
              >
                <span className="font-serif text-lg sm:text-2xl md:text-3xl font-semibold tracking-wide text-[#331C24] group-hover:text-[#B8860B] transition-colors leading-tight truncate">
                  {settings.storeName}
                </span>
                <span className="font-script text-xs sm:text-base md:text-lg text-[#B8860B] font-medium tracking-wide truncate">
                  Sorprende. Regala. Enamora.
                </span>
              </div>
            </div>
          </div>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <input
                type="text"
                placeholder="Buscar flores eternas, limpiapipas, anchetas, cajas..."
                value={activeFilter.searchQuery}
                onChange={(e) => setActiveFilter({ searchQuery: e.target.value })}
                className="w-full pl-10 pr-9 py-2 rounded-full bg-pink-50/70 border border-pink-200/80 text-sm text-[#38222A] placeholder-pink-400/80 focus:outline-hidden focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-pink-200/50 transition-all"
              />
              {activeFilter.searchQuery && (
                <button
                  type="button"
                  onClick={() => setActiveFilter({ searchQuery: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 p-0.5"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile search toggle */}
            <button
              type="button"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden p-1.5 sm:p-2 rounded-full text-pink-700 hover:bg-pink-100/60 transition-colors"
              aria-label="Buscar productos"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 sm:p-2.5 rounded-full text-[#4A2D36] hover:text-[#B8860B] hover:bg-pink-50 border border-pink-100/80 transition-all group"
              title="Mis detalles favoritos"
              aria-label="Ver favoritos"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${
                  wishlist.length > 0 ? 'fill-pink-500 text-pink-500' : 'text-[#4A2D36]'
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Instagram direct profile link */}
            <a
              href={getInstagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-full text-pink-700 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 border border-pink-200/80 transition-all shadow-2xs group"
              title="Síguenos en Instagram (@lr_detalles0)"
              aria-label="Instagram de LR Detalles"
            >
              <Instagram className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110" />
            </a>

            {/* WhatsApp direct chat link */}
            <a
              href={getWhatsAppUrl(
                '¡Hola LR Detalles! 🌸 Me gustaría solicitar información sobre sus anchetas y detalles especiales en Montería.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-medium hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-xs"
              title="Escríbenos directamente a WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 fill-emerald-600/20 shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Mobile search bar dropdown */}
        {isSearchExpanded && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <input
                type="text"
                placeholder="Buscar ramos, anchetas, fresas..."
                value={activeFilter.searchQuery}
                onChange={(e) => setActiveFilter({ searchQuery: e.target.value })}
                autoFocus
                className="w-full pl-10 pr-9 py-2 rounded-full bg-pink-50 border border-pink-200 text-sm text-[#38222A] placeholder-pink-400 focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
              />
              {activeFilter.searchQuery && (
                <button
                  type="button"
                  onClick={() => setActiveFilter({ searchQuery: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
