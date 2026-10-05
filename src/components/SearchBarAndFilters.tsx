import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Search,
  X,
  ArrowUpDown,
  Tag,
  CircleDollarSign,
  RotateCcw,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { AVAILABLE_TAGS } from '../data/defaultCatalog';

export const SearchBarAndFilters: React.FC = () => {
  const { activeFilter, setActiveFilter, resetFilters, filteredProducts, products } = useCatalog();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    activeFilter.categoryId !== 'all' ||
    Boolean(activeFilter.searchQuery.trim()) ||
    activeFilter.priceRange !== 'all' ||
    activeFilter.selectedTag !== 'all' ||
    activeFilter.sortBy !== 'featured';

  return (
    <div className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-pink-100/90 shadow-2xs mb-8">
      {/* Top row: search + toggle advanced + sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, flores eternas, limpiapipas, ancheta, peluche..."
            value={activeFilter.searchQuery}
            onChange={(e) => setActiveFilter({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-pink-50/60 border border-pink-200/80 text-sm text-[#38222A] placeholder-pink-400/80 focus:outline-hidden focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-pink-200/40 transition-all"
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

        {/* Buttons: Filters toggle & Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${
              showAdvanced || activeFilter.priceRange !== 'all' || activeFilter.selectedTag !== 'all'
                ? 'bg-pink-100/80 border-pink-300 text-pink-900'
                : 'bg-white border-pink-200/90 text-[#5C3A46] hover:bg-pink-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-pink-500" />
            <span>Filtros {activeFilter.priceRange !== 'all' || activeFilter.selectedTag !== 'all' ? '(Activos)' : ''}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <div className="flex items-center bg-white border border-pink-200/90 rounded-xl px-3 py-2 text-xs text-[#5C3A46]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#B8860B] mr-1.5" />
              <select
                value={activeFilter.sortBy}
                onChange={(e) => setActiveFilter({ sortBy: e.target.value as any })}
                aria-label="Ordenar productos"
                className="bg-transparent focus:outline-hidden text-xs font-medium cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre: A - Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Collapse: Occasion & Price Range */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-pink-100 flex flex-col gap-4 animate-in fade-in duration-200">
          
          {/* Price Range Selector */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#663A47] mb-2">
              <CircleDollarSign className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Rango de Precio Sugerido:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Todos los precios' },
                { id: 'under-50', label: 'Hasta $50.000' },
                { id: '50-100', label: '$50.000 - $100.000' },
                { id: '100-200', label: '$100.000 - $200.000' },
                { id: 'over-200', label: 'Más de $200.000' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveFilter({ priceRange: p.id as any })}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    activeFilter.priceRange === p.id
                      ? 'bg-pink-600 text-white font-medium shadow-2xs'
                      : 'bg-pink-50/80 hover:bg-pink-100/70 text-[#6B4450]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion / Tag Selector */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#663A47] mb-2">
              <Tag className="w-3.5 h-3.5 text-pink-500" />
              <span>Ocasión o Etiqueta:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setActiveFilter({ selectedTag: 'all' })}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter.selectedTag === 'all'
                    ? 'bg-pink-600 text-white font-medium'
                    : 'bg-pink-50/80 hover:bg-pink-100/70 text-[#6B4450]'
                }`}
              >
                Todas las ocasiones
              </button>
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveFilter({ selectedTag: tag })}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    activeFilter.selectedTag === tag
                      ? 'bg-pink-600 text-white font-medium'
                      : 'bg-pink-50/80 hover:bg-pink-100/70 text-[#6B4450]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary status and reset */}
      <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[#7A5B66] border-t border-pink-100/60">
        <div>
          Mostrando <strong className="text-[#381D26]">{filteredProducts.length}</strong> de{' '}
          {products.length} detalles disponibles
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
