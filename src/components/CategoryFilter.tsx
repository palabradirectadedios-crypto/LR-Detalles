import React from 'react';
import {
  Sparkles,
  Gift,
  Flower2,
  HeartHandshake,
  Coffee,
  Heart,
  Plus,
  Package,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

const ICON_MAP: Record<string, React.ReactNode> = {
  Gift: <Gift className="w-4 h-4" />,
  Flower2: <Flower2 className="w-4 h-4" />,
  HeartHandshake: <HeartHandshake className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
};

export const CategoryFilter: React.FC = () => {
  const { categories, products, activeFilter, setActiveFilter, setIsAdminOpen } = useCatalog();

  // Helper to count products per category
  const getProductCount = (catId: string) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.categoryId === catId).length;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8C5D6C]">
            Explorar Secciones
          </h2>
        </div>
      </div>

      {/* Horizontal scrollable categories pill list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
        {/* 'Todas' pill */}
        <button
          type="button"
          onClick={() => setActiveFilter({ categoryId: 'all' })}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
            activeFilter.categoryId === 'all'
              ? 'bg-[#331C24] text-white shadow-sm ring-1 ring-[#D4AF37]/50'
              : 'bg-white/80 hover:bg-white text-[#52353E] border border-pink-200/80 hover:border-pink-300'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeFilter.categoryId === 'all' ? 'text-[#D4AF37]' : 'text-pink-400'}`} />
          <span>Todo el Catálogo</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeFilter.categoryId === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-pink-100 text-[#7A4B58]'
            }`}
          >
            {getProductCount('all')}
          </span>
        </button>

        {/* Dynamic categories created by the owner */}
        {categories.slice().sort((a, b) => a.order - b.order).map((category) => {
          const isActive = activeFilter.categoryId === category.id;
          const count = getProductCount(category.id);
          const icon = (category.iconName && ICON_MAP[category.iconName]) || <Package className="w-4 h-4" />;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveFilter({ categoryId: category.id })}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-sm ring-1 ring-pink-300'
                  : 'bg-white/80 hover:bg-white text-[#52353E] border border-pink-200/80 hover:border-pink-300'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-[#B8860B]'}>
                {icon}
              </span>
              <span>{category.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-pink-100 text-[#7A4B58]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
