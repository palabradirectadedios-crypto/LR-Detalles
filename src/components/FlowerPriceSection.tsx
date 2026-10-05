import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  ZoomIn,
  X,
  MessageCircle,
  Image as ImageIcon,
  Check,
  Edit3,
  Lock,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { Category } from '../types/catalog';

interface FlowerPriceSectionProps {
  category: Category;
}

export const FlowerPriceSection: React.FC<FlowerPriceSectionProps> = ({ category }) => {
  const {
    settings,
    updateSettings,
    updateCategory,
    isOwnerAuthenticated,
    setIsOwnerAuthenticated,
    getWhatsAppUrl,
  } = useCatalog();

  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Image source: category priceListImageUrl or settings flowerPricesImageUrl
  const currentPriceImage =
    category.priceListImageUrl ||
    settings.flowerPricesImageUrl ||
    '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('La imagen es muy pesada. Por favor selecciona una imagen menor a 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateSettings({ flowerPricesImageUrl: dataUrl });
      updateCategory(category.id, category.name, category.description, category.iconName);
      showToast('¡Imagen de precios de flores actualizada con éxito!');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    if (isOwnerAuthenticated) {
      fileInputRef.current?.click();
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1991' || pinInput.trim() === settings.adminPin) {
      setIsOwnerAuthenticated(true);
      setShowPinModal(false);
      setPinError(false);
      setPinInput('');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 200);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-pink-50/90 via-white to-pink-50/90 border border-pink-200/90 shadow-sm relative overflow-hidden">
      
      {/* Decorative subtle gold glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Toast */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-20 bg-[#331C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg border border-[#D4AF37] flex items-center gap-2 animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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

      {/* SECOND PART: Precios de flores */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-pink-200 text-[#B8860B] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Lista Oficial</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A161E] leading-tight">
            Precios de flores
          </h3>
          <p className="text-xs sm:text-sm text-[#664C56] font-light mt-1">
            Guía de precios sugeridos
          </p>
        </div>

        {/* Upload Button: ONLY visible in administrator mode */}
        {isOwnerAuthenticated && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Cambiar la imagen de precios (Modo Administrador)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{currentPriceImage ? 'Cambiar Imagen de Precios' : 'Subir Imagen de Precios'}</span>
          </button>
        )}
      </div>

      {/* Price Image Showcase Container - Full and Cohesive */}
      {currentPriceImage ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: Flyer Poster Card (edge-to-edge image, zero white side bars) */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden shadow-md border-2 border-pink-200 bg-white flex flex-col justify-between group">
              <div
                className="cursor-pointer relative overflow-hidden bg-gradient-to-b from-pink-100/40 to-pink-50/40 flex items-center justify-center"
                onClick={() => setIsZoomOpen(true)}
              >
                <img
                  src={currentPriceImage}
                  alt="Lista oficial de precios de flores eternas"
                  className="w-full h-auto block object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-white font-medium text-xs pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                    <ZoomIn className="w-4 h-4" />
                    <span>Ampliar pantalla completa</span>
                  </span>
                </div>
              </div>

              {/* Bottom bar of the flyer card */}
              <div className="p-3 bg-white border-t border-pink-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-[#8C5D6C] text-[11px] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Precios en pesos colombianos (COP)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#5C3A46] font-medium text-[11px] cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-pink-500" />
                  <span>Ampliar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Companion Highlights & Direct WhatsApp CTA */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between gap-4">
            <div className="rounded-2xl p-5 sm:p-6 bg-white/95 border border-pink-200/90 shadow-2xs flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[11px] font-semibold tracking-wide">
                    Atención Inmediata
                  </span>
                  <span className="text-xs text-[#8C5D6C]">Montería, Córdoba</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#2A161E] mb-1.5">
                  Elige la cantidad de rosas para tu ramo
                </h4>
                <p className="text-xs sm:text-sm text-[#664C56] font-light leading-relaxed">
                  Cada ramo es una obra de arte elaborada minuciosamente en cinta satinada, diseñada para durar para siempre y sorprender en cualquier ocasión especial.
                </p>
              </div>

              {/* Quick reference price grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                <div className="p-2 sm:p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-center">
                  <span className="text-[11px] font-medium text-[#7A5B66] block">1 Rosa</span>
                  <span className="text-sm font-bold text-pink-700">$15.000</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-center">
                  <span className="text-[11px] font-medium text-[#7A5B66] block">3 Rosas</span>
                  <span className="text-sm font-bold text-pink-700">$25.000</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-center">
                  <span className="text-[11px] font-medium text-[#7A5B66] block">6 Rosas</span>
                  <span className="text-sm font-bold text-pink-700">$40.000</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-center">
                  <span className="text-[11px] font-medium text-[#7A5B66] block">10 Rosas</span>
                  <span className="text-sm font-bold text-pink-700">$60.000</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-center">
                  <span className="text-[11px] font-medium text-[#7A5B66] block">12 Rosas</span>
                  <span className="text-sm font-bold text-pink-700">$70.000</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-center">
                  <span className="text-[11px] font-medium text-[#7A5B66] block">15 Rosas</span>
                  <span className="text-sm font-bold text-pink-700">$85.000</span>
                </div>
              </div>

              {/* Included features */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-50/80 via-white to-pink-50/80 border border-pink-100/90 text-xs space-y-1.5 text-[#5C3A46]">
                <div className="font-semibold text-[#2A161E] text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Todos nuestros ramos de rosas eternas incluyen:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Envoltura coreana de lujo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Mariposa dorada decorativa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tarjeta con dedicatoria</span>
                  </div>
                </div>
              </div>

              {/* Big WhatsApp CTA Button */}
              <a
                href={getWhatsAppUrl(
                  '¡Hola LR Detalles! 🌸 Vi la lista de precios de flores eternas y me gustaría encargar un ramo personalizado.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-center"
              >
                <MessageCircle className="w-4 h-4 fill-white/20 group-hover:scale-110 transition-transform" />
                <span>Cotizar o Pedir este Ramo por WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      ) : (
        /* Empty upload state - ONLY visible in admin mode */
        isOwnerAuthenticated ? (
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-pink-200 hover:border-pink-400 bg-white/70 rounded-2xl p-8 text-center cursor-pointer transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-pink-50 border border-pink-200 text-pink-400 flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2A161E] mb-1">
              Sube aquí la imagen de Precios de Flores
            </h4>
            <p className="text-xs text-[#7A5B66] max-w-md mx-auto mb-4">
              Carga una foto, volante o tabla gráfica con los precios de tus ramos de flores eternas para que tus clientes la consulten directamente.
            </p>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-semibold shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Seleccionar Imagen desde mi Dispositivo</span>
            </span>
          </div>
        ) : null
      )}

      {/* Lightbox / Zoom Modal */}
      {isZoomOpen && currentPriceImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setIsZoomOpen(false)} />
          
          <div className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center z-10">
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
              title="Cerrar vista completa"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={currentPriceImage}
              alt="Precios de flores - Pantalla completa"
              className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl bg-white"
            />

            <div className="mt-4 flex items-center gap-3">
              <a
                href={getWhatsAppUrl(
                  '¡Hola LR Detalles! 🌸 Estuve viendo la lista de Precios de Flores y me gustaría hacer un encargo.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Pedir o cotizar este precio por WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin PIN Verification Modal for Price Image Upload */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setShowPinModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-pink-200 z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-[#B8860B] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#2A161E] mb-1">
              Modo Administrador
            </h4>
            <p className="text-xs text-[#7A5B66] mb-4">
              Ingresa el PIN de seguridad (1991) para subir o cambiar la imagen de precios.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={6}
                placeholder="Introduce PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-3 py-2 text-center text-lg tracking-widest rounded-xl bg-pink-50 border border-pink-200 focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
                autoFocus
              />
              {pinError && (
                <span className="text-xs text-red-500 block font-medium">
                  PIN incorrecto. Intenta con 1991.
                </span>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-[#7A5B66] hover:bg-pink-50 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs shadow-xs"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
