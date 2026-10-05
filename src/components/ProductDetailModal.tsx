import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Heart,
  Check,
  Share2,
  Clock,
  Sparkles,
  ShieldCheck,
  Gift,
  Calendar,
} from 'lucide-react';
import { Product } from '../types/catalog';
import { useCatalog } from '../context/CatalogContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const {
    categories,
    formatPrice,
    toggleWishlist,
    isInWishlist,
    getWhatsAppLinkForProduct,
    settings,
  } = useCatalog();

  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const category = categories.find((c) => c.id === product.categoryId);
  const isFav = isInWishlist(product.id);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(`${url}#${product.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-pink-200 z-10 my-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#4A2D36] hover:text-[#996515] hover:bg-white shadow-sm transition-all focus:outline-hidden"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image Showcase */}
          <div className="md:w-1/2 relative bg-pink-50 min-h-[300px] md:min-h-full">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover object-center max-h-[460px] md:max-h-none"
            />
            {product.isFeatured && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#331C24]/85 text-[#D4AF37] text-xs font-semibold backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Diseño Exclusivo</span>
              </div>
            )}
          </div>

          {/* Right Column: Product Information & CTAs */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#8C5D6C]">
                  {category?.name || 'Detalles'}
                </span>

                {product.availability === 'disponible' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Disponible hoy
                  </span>
                )}
                {product.availability === 'por_encargo' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Encargo con {product.leadTimeHours || 24}h
                  </span>
                )}
                {product.availability === 'agotado' && (
                  <span className="text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md font-medium">
                    Agotado
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A161E] leading-tight mb-3">
                {product.title}
              </h2>

              {/* Price Banner */}
              <div className="p-3.5 rounded-xl bg-pink-50/70 border border-pink-200/80 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#8C5D6C] block">
                    Precio Sugerido de Referencia
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2A161E]">
                    {formatPrice(product.suggestedPrice)}
                  </span>
                </div>
                <span className="text-xs text-[#8C5D6C] font-light text-right max-w-[120px]">
                  *Sujeto a personalizaciones
                </span>
              </div>

              {/* Description */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-[#52353E] uppercase tracking-wider mb-1.5">
                  Descripción
                </h4>
                <p className="text-sm text-[#5C434C] font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Included Items Checklist */}
              {product.includes && product.includes.length > 0 && (
                <div className="mb-5 p-4 rounded-xl bg-[#FFF9FA] border border-pink-100">
                  <h4 className="text-xs font-semibold text-[#52353E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>¿Qué incluye este detalle?</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {product.includes.map((inc, i) => (
                      <li key={i} className="text-xs text-[#4F363F] flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Personalization Note */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-pink-50/50 border border-pink-100 text-xs text-[#704E59] mb-5">
                <Sparkles className="w-4 h-4 text-[#B8860B] shrink-0" />
                <span>
                  Todos nuestros arreglos incluyen tarjeta con mensaje personalizado y moño de satén de lujo.
                </span>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-pink-200 text-[#7A4B58]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-pink-100 flex flex-col gap-3">
              {/* WhatsApp Primary CTA */}
              <a
                href={getWhatsAppLinkForProduct(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Consultar Disponibilidad por WhatsApp</span>
              </a>

              {/* Secondary actions: Wishlist & Share */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                    isFav
                      ? 'bg-pink-100/90 border-pink-300 text-pink-900'
                      : 'bg-white border-pink-200 text-[#52353E] hover:bg-pink-50'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${isFav ? 'fill-pink-500 text-pink-500' : 'text-[#52353E]'}`}
                  />
                  <span>{isFav ? 'En tus favoritos' : 'Guardar en Favoritos'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-white border border-pink-200 text-[#52353E] hover:bg-pink-50 transition-colors"
                  title="Copiar enlace"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
