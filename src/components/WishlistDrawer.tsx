import React from 'react';
import {
  X,
  Heart,
  Trash2,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlistProducts,
    toggleWishlist,
    formatPrice,
    setSelectedProduct,
    getWhatsAppLinkForWishlist,
  } = useCatalog();

  if (!isWishlistOpen) return null;

  const totalPrice = wishlistProducts.reduce((sum, p) => sum + p.suggestedPrice, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between border-l border-pink-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-pink-100 flex items-center justify-between bg-[#FFF8FA]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <h3 className="font-serif text-xl font-bold text-[#2A161E]">
              Mis Detalles Favoritos
            </h3>
            <span className="text-xs bg-pink-100 text-pink-800 font-semibold px-2 py-0.5 rounded-full">
              {wishlistProducts.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full text-[#5C3A46] hover:bg-pink-100/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-300 mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#3D232C] mb-1">
                Aún no tienes favoritos guardados
              </h4>
              <p className="text-xs text-[#7A5B66] max-w-xs leading-relaxed mb-5">
                Haz clic en el corazón de cualquier ramo, ancheta o detalle que te encante para consultarlos juntos.
              </p>
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-medium shadow-xs"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-pink-50/40 border border-pink-100/80 hover:border-pink-200 transition-all"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-16 h-16 rounded-lg object-cover bg-pink-100 shrink-0 cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIsWishlistOpen(false);
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h4
                    className="font-serif text-sm font-semibold text-[#2A161E] truncate cursor-pointer hover:text-[#B8860B] transition-colors"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setIsWishlistOpen(false);
                    }}
                  >
                    {prod.title}
                  </h4>
                  <span className="font-serif text-sm font-bold text-[#B8860B]">
                    {formatPrice(prod.suggestedPrice)}
                  </span>
                  <span className="text-[10px] text-[#8C5D6C] block capitalize">
                    {prod.availability === 'disponible' ? 'Disponible' : 'Por encargo'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(prod.id)}
                  className="p-2 text-pink-400 hover:text-red-500 transition-colors"
                  title="Eliminar de favoritos"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with totals and WhatsApp CTA */}
        {wishlistProducts.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-pink-100 bg-[#FFF8FA]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-semibold text-[#7A5B66]">
                Total Sugerido Estimado:
              </span>
              <span className="font-serif text-2xl font-bold text-[#2A161E]">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <a
              href={getWhatsAppLinkForWishlist()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-medium text-xs shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Consultar todos mis favoritos por WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
