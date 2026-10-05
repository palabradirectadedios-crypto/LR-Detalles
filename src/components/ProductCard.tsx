import React from 'react';
import {
  Heart,
  MessageCircle,
  Eye,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../types/catalog';
import { useCatalog } from '../context/CatalogContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    categories,
    formatPrice,
    setSelectedProduct,
    toggleWishlist,
    isInWishlist,
    getWhatsAppLinkForProduct,
  } = useCatalog();

  const isFav = isInWishlist(product.id);
  const category = categories.find((c) => c.id === product.categoryId);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-pink-100/90 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-pink-300/80">
      
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-pink-50 cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle Dark Gradient Overlay on Bottom for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#331C24]/85 backdrop-blur-md text-[#D4AF37] text-[11px] font-semibold tracking-wide shadow-xs">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Destacado</span>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute bottom-3 left-3">
          {product.availability === 'disponible' && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-medium shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Disponible hoy
            </span>
          )}
          {product.availability === 'por_encargo' && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-amber-800 text-[10px] font-medium shadow-2xs">
              <Clock className="w-2.5 h-2.5 text-amber-600" />
              {product.leadTimeHours ? `Por encargo (${product.leadTimeHours}h)` : 'Por encargo'}
            </span>
          )}
          {product.availability === 'agotado' && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/80 backdrop-blur-md text-white text-[10px] font-medium shadow-2xs">
              Agotado temporalmente
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/85 backdrop-blur-md text-[#4A2D36] hover:text-pink-600 hover:bg-white shadow-xs transition-transform active:scale-90"
          title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-pink-500 text-pink-500' : 'text-[#5C3A46]'
            }`}
          />
        </button>

        {/* Quick View Button hover trigger */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-[#3D232C] shadow-lg pointer-events-auto hover:bg-pink-50 transition-colors">
            <Eye className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Ver Detalles</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        
        {/* Category & Tags metadata */}
        <div className="flex items-center justify-between text-xs text-[#8C5D6C] mb-1.5">
          <span className="font-medium tracking-wide uppercase text-[10px]">
            {category?.name || 'Detalle Especial'}
          </span>
          {product.tags.length > 0 && (
            <span className="text-[11px] text-[#A67584] truncate max-w-[130px]">
              {product.tags[0]}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3
          onClick={() => setSelectedProduct(product)}
          className="font-serif text-lg sm:text-xl font-semibold text-[#29171E] group-hover:text-[#996515] transition-colors leading-snug cursor-pointer line-clamp-1 mb-2"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Description Excerpt */}
        <p className="text-xs text-[#664C56] font-light leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-pink-100 flex items-end justify-between gap-2">
          
          {/* Price display */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#996515] font-semibold">
              Precio Sugerido
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#2A161E]">
              {formatPrice(product.suggestedPrice)}
            </span>
          </div>

          {/* Quick WhatsApp Inquiry CTA */}
          <a
            href={getWhatsAppLinkForProduct(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all shrink-0"
            title="Consultar este detalle por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Consultar</span>
          </a>
        </div>
      </div>
    </div>
  );
};
