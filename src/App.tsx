import React from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { FlowerPriceSection } from './components/FlowerPriceSection';
import { AnchetaPriceBanner } from './components/AnchetaPriceBanner';
import {
  Sparkles,
  MessageCircle,
  Heart,
  PackageX,
  Plus,
  HelpCircle,
} from 'lucide-react';

const CatalogContent: React.FC = () => {
  const {
    filteredProducts,
    featuredProducts,
    activeFilter,
    resetFilters,
    selectedProduct,
    setSelectedProduct,
    setIsAdminOpen,
    settings,
    categories,
    getWhatsAppUrl,
  } = useCatalog();

  const currentCategory = categories.find((c) => c.id === activeFilter.categoryId);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF5F7] via-[#FFF9FA] to-[#FFF0F4] text-[#33242A]">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner with Brand Story and Atmosphere */}
        <HeroBanner />

        {/* Main Interactive Catalog Section */}
        <section id="catalogo-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          
          {/* Section Heading & Category Navigation */}
          <div className="mb-6">
            <CategoryFilter />
          </div>

          {/* Search bar & Advanced filters */}
          <SearchBarAndFilters />

          {/* Featured Spotlight if viewing All and no search query */}
          {activeFilter.categoryId === 'all' && !activeFilter.searchQuery && featuredProducts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <h3 className="font-serif text-2xl font-bold text-[#2A161E]">
                    Detalles Destacados del Mes
                  </h3>
                </div>
                <span className="text-xs text-[#8C5D6C] hidden sm:inline">
                  Los favoritos de nuestros clientes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.slice(0, 3).map((prod) => (
                  <ProductCard key={`feat-${prod.id}`} product={prod} />
                ))}
              </div>
            </div>
          )}

          {/* Section Header when specific category is chosen */}
          {activeFilter.categoryId !== 'all' && currentCategory && (
            (currentCategory.id === 'cat-flores-eternas' ||
              currentCategory.slug === 'flores-eternas' ||
              Boolean(currentCategory.priceListImageUrl)) ? (
              /* Unified single section for Flores Eternas with Precios de Flores */
              <FlowerPriceSection category={currentCategory} />
            ) : (currentCategory.id === 'cat-anchetas' || currentCategory.slug === 'anchetas') ? (
              /* Dedicated Ancheta Custom Value & Info Banner */
              <AnchetaPriceBanner category={currentCategory} />
            ) : (
              /* Standard Section Header for other categories */
              <div className="mb-6 p-6 rounded-2xl bg-white/70 border border-pink-100 shadow-2xs">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B] block mb-1">
                  Sección Activa
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#2A161E]">
                  {currentCategory.name}
                </h2>
                {currentCategory.description && (
                  <p className="text-sm text-[#664C56] font-light mt-1">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            )
          )}

          {/* Main Catalog Grid */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A161E]">
              {activeFilter.categoryId === 'all' ? 'Todos los Arreglos & Detalles' : `Catálogo de ${currentCategory?.name || 'Sección'}`}
            </h3>
            <span className="text-xs text-[#7A5B66]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'detalle' : 'detalles'}
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty state when no products match filters */
            <div className="p-12 text-center bg-white/80 rounded-3xl border border-pink-200/80 max-w-lg mx-auto shadow-sm my-8">
              <div className="w-16 h-16 rounded-full bg-pink-100/80 text-pink-400 flex items-center justify-center mx-auto mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#2A161E] mb-2">
                No encontramos detalles con esos criterios
              </h4>
              <p className="text-xs text-[#7A5B66] leading-relaxed mb-6">
                Prueba buscando con otras palabras clave o restablece los filtros para ver todo nuestro catálogo disponible.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-full bg-[#331C24] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Ver Todo el Catálogo
                </button>
                <a
                  href={getWhatsAppUrl(
                    '¡Hola LR Detalles! 🌸 Busco un detalle personalizado especial y me gustaría consultarles por WhatsApp.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200 inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Preguntar por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Floating Quick WhatsApp Assistance Button */}
      <a
        href={getWhatsAppUrl(
          '¡Hola LR Detalles! 🌸 Vi su catálogo en línea y me gustaría hacer una consulta.'
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-3 sm:p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group flex items-center gap-2"
        title="Consultar por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white/20" />
        <span className="hidden sm:inline text-xs font-semibold pr-1">
          ¿Consultas? Escríbenos
        </span>
      </a>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <WishlistDrawer />

      <AdminPanel />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <CatalogProvider>
      <CatalogContent />
    </CatalogProvider>
  );
}
