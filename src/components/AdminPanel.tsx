import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Save,
  Copy,
  Settings,
  FolderPlus,
  PackagePlus,
  RefreshCw,
  Eye,
  Download,
  FileUp,
  AlertCircle,
  HelpCircle,
  Layers,
  MessageCircle,
  Instagram,
  ExternalLink,
  Cloud,
  Database,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { Product, Category, ProductAvailability } from '../types/catalog';
import { PRESET_GALLERY_IMAGES, AVAILABLE_TAGS } from '../data/defaultCatalog';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isOwnerAuthenticated,
    setIsOwnerAuthenticated,
    settings,
    updateSettings,
    getWhatsAppUrl,
    getInstagramUrl,
    isCloudConnected,
    syncToCloud,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    formatPrice,
    exportCatalogData,
    importCatalogData,
    resetToDefaults,
  } = useCatalog();

  // Active Tab: 'sections' | 'products' | 'settings'
  const [activeTab, setActiveTab] = useState<'sections' | 'products' | 'settings'>('products');

  // Owner PIN check
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // New/Edit Category state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('Sparkles');

  // Product Form State
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(100000);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodAvailability, setProdAvailability] = useState<ProductAvailability>('disponible');
  const [prodLeadTime, setProdLeadTime] = useState(24);
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodTags, setProdTags] = useState<string[]>([]);
  const [prodIncludes, setProdIncludes] = useState<string[]>([]);
  const [newIncludeItem, setNewIncludeItem] = useState('');

  // File upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const priceFileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      await syncToCloud();
      showToast('¡Catálogo sincronizado exitosamente con Firestore!');
    } catch (e) {
      alert('Hubo un inconveniente al sincronizar con la nube.');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  if (!isAdminOpen) return null;

  // Handle PIN authentication (Password: 1991)
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1991' || pinInput.trim() === settings.adminPin) {
      setIsOwnerAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen del logo es muy pesada. Por favor selecciona una imagen menor a 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateSettings({ logoUrl: result });
      showToast('¡Logo de la empresa actualizado con éxito!');
    };
    reader.readAsDataURL(file);
  };

  // Flower prices image upload handler
  const handlePriceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('La imagen es muy pesada. Por favor selecciona una imagen menor a 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateSettings({ flowerPricesImageUrl: result });
      showToast('¡Imagen de precios de flores actualizada!');
    };
    reader.readAsDataURL(file);
  };

  // Category Actions
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, categoryName, categoryDesc, categoryIcon);
      showToast('Sección actualizada con éxito');
    } else {
      addCategory(categoryName, categoryDesc, categoryIcon);
      showToast('Nueva sección creada con éxito');
    }

    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryDesc('');
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
    setCategoryDesc(cat.description || '');
    setCategoryIcon(cat.iconName || 'Sparkles');
  };

  const handleDeleteCategory = (catId: string) => {
    const res = deleteCategory(catId);
    if (!res.success) {
      alert(res.message);
    } else {
      showToast('Sección eliminada');
    }
  };

  // Product Form Actions
  const resetProductForm = () => {
    setEditingProductId(null);
    setProdTitle('');
    setProdCategoryId(categories[0]?.id || '');
    setProdPrice(120000);
    setProdDesc('');
    setProdImageUrl('');
    setProdAvailability('disponible');
    setProdLeadTime(24);
    setProdIsFeatured(false);
    setProdTags([]);
    setProdIncludes([]);
    setNewIncludeItem('');
    setIsProductFormOpen(false);
  };

  const handleOpenAddProduct = () => {
    resetProductForm();
    setProdCategoryId(categories[0]?.id || '');
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdTitle(prod.title);
    setProdCategoryId(prod.categoryId);
    setProdPrice(prod.suggestedPrice);
    setProdDesc(prod.description);
    setProdImageUrl(prod.imageUrl);
    setProdAvailability(prod.availability);
    setProdLeadTime(prod.leadTimeHours || 24);
    setProdIsFeatured(Boolean(prod.isFeatured));
    setProdTags(prod.tags || []);
    setProdIncludes(prod.includes || []);
    setIsProductFormOpen(true);
  };

  // File Upload to Data URL
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max ~5MB for localStorage friendliness)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy pesada. Por favor selecciona una imagen menor a 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setProdImageUrl(result);
      showToast('Imagen cargada con éxito');
    };
    reader.readAsDataURL(file);
  };

  const handleAddIncludeItem = () => {
    if (!newIncludeItem.trim()) return;
    setProdIncludes((prev) => [...prev, newIncludeItem.trim()]);
    setNewIncludeItem('');
  };

  const handleRemoveIncludeItem = (idx: number) => {
    setProdIncludes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleToggleTag = (tag: string) => {
    setProdTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) {
      alert('Ingresa el nombre del producto');
      return;
    }
    if (!prodCategoryId) {
      alert('Selecciona una sección o categoría');
      return;
    }

    // Default image fallback if none provided
    const finalImg =
      prodImageUrl ||
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';

    const productPayload = {
      title: prodTitle.trim(),
      categoryId: prodCategoryId,
      description: prodDesc.trim() || 'Hermoso detalle elaborado con productos de la más alta calidad.',
      suggestedPrice: Number(prodPrice) || 0,
      currency: 'COP',
      imageUrl: finalImg,
      includes: prodIncludes,
      tags: prodTags,
      availability: prodAvailability,
      leadTimeHours: Number(prodLeadTime) || 24,
      isFeatured: prodIsFeatured,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
      showToast('Producto actualizado correctamente');
    } else {
      addProduct(productPayload);
      showToast('Nuevo producto agregado al catálogo');
    }

    resetProductForm();
  };

  // JSON Import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importCatalogData(content);
      if (res.success) {
        showToast('Catálogo importado exitosamente');
      } else {
        alert(res.error || 'Error al importar catálogo');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const dataStr = exportCatalogData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `catalogo_lr_detalles_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Copia de catálogo descargada');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={() => setIsAdminOpen(false)} />

      {/* Modal Main Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-pink-200 z-10 flex flex-col max-h-[92vh]">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#331C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg border border-[#D4AF37] flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 bg-[#FFF8FA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-[#B8860B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A161E]">
                Panel de Administración · Dueño
              </h3>
              <p className="text-xs text-[#8C5D6C]">
                Administra tus secciones, productos, fotos y datos de contacto
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerAuthenticated && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guardado automático activo</span>
              </div>
            )}
            {isOwnerAuthenticated && (
              <button
                type="button"
                onClick={() => setIsOwnerAuthenticated(false)}
                className="text-xs text-[#7A5B66] hover:text-[#2A161E] px-2 py-1 rounded-md border border-pink-200"
                title="Bloquear sesión"
              >
                Bloquear
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full text-[#5C3A46] hover:bg-pink-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Check Screen */}
        {!isOwnerAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center text-[#B8860B] mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#2A161E] mb-2">
              Modo Administrador
            </h4>
            <p className="text-xs text-[#7A5B66] mb-6 leading-relaxed">
              Introduce el PIN de seguridad para acceder al panel de administración de tu catálogo.
            </p>

            <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Introduce PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl tracking-widest rounded-xl bg-pink-50 border border-pink-200 focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
                  autoFocus
                />
                {pinError && (
                  <span className="text-xs text-red-500 mt-2 block font-medium">
                    PIN incorrecto. Por favor verifica e intenta nuevamente.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-medium text-sm shadow-md transition-all cursor-pointer"
              >
                Entrar al Administrador
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Panel Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs Header */}
            <div className="flex border-b border-pink-100 bg-pink-50/50 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('products');
                  setIsProductFormOpen(false);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-pink-600 text-pink-700'
                    : 'border-transparent text-[#7A5B66] hover:text-[#2A161E]'
                }`}
              >
                <PackagePlus className="w-4 h-4" />
                <span>Productos ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sections')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'sections'
                    ? 'border-pink-600 text-pink-700'
                    : 'border-transparent text-[#7A5B66] hover:text-[#2A161E]'
                }`}
              >
                <FolderPlus className="w-4 h-4" />
                <span>Secciones / Categorías ({categories.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-pink-600 text-pink-700'
                    : 'border-transparent text-[#7A5B66] hover:text-[#2A161E]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Ajustes & Contacto</span>
              </button>
            </div>

            {/* Quick Logo Changer Banner */}
            <div className="bg-gradient-to-r from-pink-50 via-white to-pink-50 border-b border-pink-100 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 shadow-2xs bg-white shrink-0">
                  <img src={settings.logoUrl} alt={settings.storeName} className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <span className="text-xs font-serif font-bold text-[#2A161E] block">Logo de la Empresa</span>
                  <span className="text-[11px] text-[#7A5B66]">Carga una imagen nueva para actualizar el logo en toda la página</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={logoFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Cambiar Logo (Cargar Imagen)</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: SECTIONS */}
            {activeTab === 'sections' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Create/Edit Section Form */}
                <div className="p-4 sm:p-5 rounded-2xl bg-pink-50/60 border border-pink-200">
                  <h4 className="font-serif text-lg font-bold text-[#2A161E] mb-3 flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-[#B8860B]" />
                    <span>{editingCategoryId ? 'Editar Sección' : 'Crear Nueva Sección'}</span>
                  </h4>
                  <form onSubmit={handleSaveCategory} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                          Nombre de la Sección *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Anchetas, Ramos, Cajas, etc."
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                          Ícono representativo
                        </label>
                        <select
                          value={categoryIcon}
                          onChange={(e) => setCategoryIcon(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                        >
                          <option value="Gift">Canasta / Regalo (Gift)</option>
                          <option value="Flower2">Flores / Ramos (Flower2)</option>
                          <option value="HeartHandshake">Corazón & Amor (HeartHandshake)</option>
                          <option value="Sparkles">Globos / Destellos (Sparkles)</option>
                          <option value="Package">Caja Sorpresa (Package)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                        Descripción corta (opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Breve detalle sobre lo que encontrarán en esta sección..."
                        value={categoryDesc}
                        onChange={(e) => setCategoryDesc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      {editingCategoryId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(null);
                            setCategoryName('');
                            setCategoryDesc('');
                          }}
                          className="px-3.5 py-2 text-xs font-medium text-[#7A5B66] hover:bg-pink-100 rounded-xl"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingCategoryId ? 'Actualizar Sección' : 'Guardar Sección'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* List of Existing Sections */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#8C5D6C] mb-3">
                    Secciones Actuales del Catálogo
                  </h4>
                  <div className="space-y-2">
                    {categories.slice().sort((a, b) => a.order - b.order).map((cat) => {
                      const count = products.filter((p) => p.categoryId === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          className="p-3.5 rounded-xl bg-white border border-pink-100 hover:border-pink-300 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-8 h-8 rounded-lg bg-pink-100 text-[#B8860B] flex items-center justify-center font-bold text-xs shrink-0">
                              {cat.name.charAt(0)}
                            </span>
                            <div className="min-w-0">
                              <h5 className="font-serif font-semibold text-sm text-[#2A161E] truncate">
                                {cat.name}
                              </h5>
                              <p className="text-[11px] text-[#7A5B66] truncate">
                                {count} productos asignados {cat.description ? `· ${cat.description}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(cat)}
                              className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                              title="Editar sección"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar sección"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: PRODUCTS */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                
                {/* Top Action bar */}
                {!isProductFormOpen ? (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h4 className="font-serif text-xl font-bold text-[#2A161E]">
                          Inventario del Catálogo ({products.length})
                        </h4>
                        <p className="text-xs text-[#7A5B66]">
                          Crea productos, sube fotos y define precios sugeridos
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenAddProduct}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-xs shadow-md transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Nuevo Producto</span>
                      </button>
                    </div>

                    {/* Products Grid / Table */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((prod) => {
                        const cat = categories.find((c) => c.id === prod.categoryId);
                        return (
                          <div
                            key={prod.id}
                            className="bg-white rounded-2xl border border-pink-100 p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={prod.imageUrl}
                                alt={prod.title}
                                className="w-16 h-16 rounded-xl object-cover bg-pink-50 shrink-0 border border-pink-100"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] uppercase font-bold text-[#B8860B] block truncate">
                                  {cat?.name || 'Sin Sección'}
                                </span>
                                <h5 className="font-serif font-semibold text-sm text-[#2A161E] truncate">
                                  {prod.title}
                                </h5>
                                <span className="font-serif text-sm font-bold text-[#331C24]">
                                  {formatPrice(prod.suggestedPrice)}
                                </span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-pink-100/70 flex items-center justify-between">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  prod.availability === 'disponible'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {prod.availability === 'disponible' ? 'Disponible' : 'Por encargo'}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => duplicateProduct(prod.id)}
                                  className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors"
                                  title="Duplicar producto"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                                  title="Editar producto"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`¿Eliminar "${prod.title}"?`)) {
                                      deleteProduct(prod.id);
                                      showToast('Producto eliminado');
                                    }
                                  }}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  title="Eliminar producto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* PRODUCT CREATE / EDIT FORM */
                  <div className="bg-white rounded-2xl border border-pink-200 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-5 border-b border-pink-100 pb-3">
                      <h4 className="font-serif text-xl font-bold text-[#2A161E]">
                        {editingProductId ? 'Editar Producto' : 'Subir Nuevo Producto al Catálogo'}
                      </h4>
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="text-xs text-[#7A5B66] hover:text-black"
                      >
                        Volver a la lista
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-5">
                      
                      {/* Title & Section & Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                            Título del Producto *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Ramo de Flores Eternas con Luces LED"
                            value={prodTitle}
                            onChange={(e) => setProdTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                            Sección / Categoría *
                          </label>
                          <select
                            required
                            value={prodCategoryId}
                            onChange={(e) => setProdCategoryId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
                          >
                            <option value="">Selecciona sección...</option>
                            {categories.slice().sort((a, b) => a.order - b.order).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Price, Availability, Lead Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                            Precio Sugerido (COP) *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            step={1000}
                            placeholder="120000"
                            value={prodPrice}
                            onChange={(e) => setProdPrice(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-sm font-semibold text-[#2A161E] focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
                          />
                          <span className="text-[10px] text-[#7A5B66] mt-0.5 block">
                            Vista previa: {formatPrice(prodPrice || 0)}
                          </span>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                            Disponibilidad
                          </label>
                          <select
                            value={prodAvailability}
                            onChange={(e) => setProdAvailability(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
                          >
                            <option value="disponible">Disponible Inmediato</option>
                            <option value="por_encargo">Por Encargo</option>
                            <option value="agotado">Agotado Temporalmente</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                            Tiempo de Encargo (Horas)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={prodLeadTime}
                            onChange={(e) => setProdLeadTime(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* IMAGE UPLOAD SECTION */}
                      <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-200">
                        <label className="text-xs font-semibold text-[#5C3A46] block mb-2 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#B8860B]" />
                          <span>Foto del Producto (Subir archivo o URL) *</span>
                        </label>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {/* Image preview box */}
                          <div className="w-32 h-32 rounded-xl bg-white border border-pink-200 overflow-hidden relative shrink-0 shadow-2xs">
                            {prodImageUrl ? (
                              <img
                                src={prodImageUrl}
                                alt="Vista previa"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-pink-300 text-xs p-2 text-center">
                                <ImageIcon className="w-6 h-6 mb-1" />
                                <span>Sin imagen</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-3 w-full">
                            {/* File Upload Button */}
                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileUpload}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-pink-200 hover:border-pink-300 text-[#5C3A46] text-xs font-semibold shadow-2xs hover:bg-pink-50 transition-colors"
                              >
                                <Upload className="w-3.5 h-3.5 text-pink-500" />
                                <span>Subir Foto desde tu Computador o Celular</span>
                              </button>
                              <span className="text-[11px] text-[#8C5D6C] block mt-1">
                                Admite fotos JPG, PNG o WebP. Se guarda en el catálogo interactivo.
                              </span>
                            </div>

                            {/* Or direct URL */}
                            <div>
                              <label className="text-[11px] text-[#7A5B66] block mb-1">
                                O escribe la URL directa de la imagen:
                              </label>
                              <input
                                type="url"
                                placeholder="https://ejemplo.com/foto.jpg"
                                value={prodImageUrl}
                                onChange={(e) => setProdImageUrl(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-white border border-pink-200 text-xs focus:outline-hidden focus:border-[#D4AF37]"
                              />
                            </div>

                            {/* Preset Quick Images */}
                            <div>
                              <span className="text-[11px] text-[#7A5B66] block mb-1.5">
                                O elige una foto preseleccionada de alta calidad:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {PRESET_GALLERY_IMAGES.slice(0, 6).map((img, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setProdImageUrl(img.url)}
                                    className="text-[10px] px-2 py-1 rounded bg-white hover:bg-pink-100 border border-pink-200 text-[#5C3A46]"
                                  >
                                    {img.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                          Descripción del Producto
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe detalladamente los componentes, frescura floral, presentación, etc."
                          value={prodDesc}
                          onChange={(e) => setProdDesc(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37] focus:bg-white"
                        />
                      </div>

                      {/* Included Items Checklist Builder */}
                      <div>
                        <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                          ¿Qué incluye este detalle? (Opcional, viñetas individuales)
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Ej: Peluche tierno, Taza personalizada, Luces LED cálidas, Flores eternas..."
                            value={newIncludeItem}
                            onChange={(e) => setNewIncludeItem(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddIncludeItem();
                              }
                            }}
                            className="flex-1 px-3.5 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-xs focus:outline-hidden focus:border-[#D4AF37]"
                          />
                          <button
                            type="button"
                            onClick={handleAddIncludeItem}
                            className="px-3.5 py-2 rounded-xl bg-[#331C24] text-white text-xs font-semibold hover:bg-black"
                          >
                            Agregar
                          </button>
                        </div>

                        {prodIncludes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 p-2 bg-pink-50/30 rounded-xl border border-pink-100">
                            {prodIncludes.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 text-xs bg-white px-2.5 py-1 rounded-lg border border-pink-200 text-[#5C3A46]"
                              >
                                <span>{item}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveIncludeItem(idx)}
                                  className="text-pink-400 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Tags / Occasions */}
                      <div>
                        <label className="text-xs font-semibold text-[#5C3A46] block mb-1.5">
                          Etiquetas y Ocasiones
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {AVAILABLE_TAGS.map((tag) => {
                            const isSelected = prodTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleToggleTag(tag)}
                                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                                  isSelected
                                    ? 'bg-pink-600 text-white font-medium'
                                    : 'bg-pink-50 border border-pink-200 text-[#6B4450] hover:bg-pink-100'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Featured Checkbox */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={prodIsFeatured}
                          onChange={(e) => setProdIsFeatured(e.target.checked)}
                          className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-pink-300"
                        />
                        <label
                          htmlFor="isFeatured"
                          className="text-xs font-medium text-[#4A2D36] cursor-pointer"
                        >
                          Destacar este producto en la parte superior del catálogo
                        </label>
                      </div>

                      {/* Submit & Cancel Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
                        <button
                          type="button"
                          onClick={resetProductForm}
                          className="px-4 py-2 text-xs font-semibold text-[#7A5B66] hover:bg-pink-50 rounded-xl"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs shadow-md transition-all"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingProductId ? 'Guardar Cambios' : 'Publicar Producto'}</span>
                        </button>
                      </div>

                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SETTINGS & BACKUP */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Logo Management Card */}
                <div className="p-5 rounded-2xl bg-white border border-pink-200 space-y-4 shadow-2xs">
                  <h4 className="font-serif text-lg font-bold text-[#2A161E] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#B8860B]" />
                    <span>Logo de la Empresa</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-pink-50/50 border border-pink-100">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 shadow-sm bg-white shrink-0">
                      <img
                        src={settings.logoUrl}
                        alt={settings.storeName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <p className="text-xs text-[#5C3A46] font-medium">
                        Cambia la imagen del logo cargando una foto o diseño desde tu computador o celular.
                      </p>
                      <p className="text-[11px] text-[#8C5D6C]">
                        Formatos soportados: PNG, JPG, JPEG o WebP. Se actualiza inmediatamente en toda la página web.
                      </p>
                      <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir Nuevo Archivo de Logo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flower Prices Image Management Card */}
                <div className="p-5 rounded-2xl bg-white border border-pink-200 space-y-4 shadow-2xs">
                  <h4 className="font-serif text-lg font-bold text-[#2A161E] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B8860B]" />
                    <span>Imagen de Precios de Flores Eternas</span>
                  </h4>

                  <input
                    ref={priceFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePriceImageUpload}
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-pink-50/50 border border-pink-100">
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-pink-200 shadow-2xs bg-white shrink-0 flex items-center justify-center">
                      {settings.flowerPricesImageUrl ? (
                        <img
                          src={settings.flowerPricesImageUrl}
                          alt="Precios de Flores"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-pink-400 text-center px-1">Sin imagen</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <p className="text-xs text-[#5C3A46] font-medium">
                        Esta imagen se mostrará en la sección "Precios de flores" cuando los clientes naveguen por la sección de Flores Eternas.
                      </p>
                      <p className="text-[11px] text-[#8C5D6C]">
                        Puedes subir tu volante, tabla de precios o foto diseñada con los valores de tus ramos.
                      </p>
                      <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => priceFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir Imagen de Precios</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Profile Information */}
                <div className="p-5 rounded-2xl bg-white border border-pink-200 space-y-4 shadow-2xs">
                  <h4 className="font-serif text-lg font-bold text-[#2A161E] flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#B8860B]" />
                    <span>Datos de Contacto & WhatsApp</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                        Nombre de la Empresa
                      </label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={(e) => updateSettings({ storeName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                        Eslogan
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Sorprende. Regala. Enamora."
                        value={settings.tagline}
                        onChange={(e) => updateSettings({ tagline: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#5C3A46] flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Número de WhatsApp para Pedidos</span>
                        </label>
                        <a
                          href={getWhatsAppUrl('¡Hola! Prueba de conexión desde el panel de administración.')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                          title="Probar apertura del chat en WhatsApp"
                        >
                          <span>Probar chat</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <input
                        type="text"
                        placeholder="Ej: 3105551234 o 573105551234"
                        value={settings.whatsappNumber}
                        onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                      />
                      <span className="text-[10px] text-[#7A5B66] mt-1 block">
                        Al hacer clic en el ícono de WhatsApp se abrirá directamente este chat. Puedes colocar tu número con o sin el 57 (ej: 3105551234).
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#5C3A46] flex items-center gap-1.5">
                          <Instagram className="w-3.5 h-3.5 text-pink-600" />
                          <span>Enlace o Perfil de Instagram</span>
                        </label>
                        <a
                          href={getInstagramUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-pink-700 hover:text-pink-800 hover:underline"
                          title="Probar apertura del perfil de Instagram"
                        >
                          <span>Ver perfil</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <input
                        type="text"
                        placeholder="https://www.instagram.com/lr_detalles0..."
                        value={settings.instagramUrl || settings.instagramUsername}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateSettings({
                            instagramUrl: val,
                            instagramUsername: val.includes('instagram.com')
                              ? val.split('instagram.com/')[1]?.split('/')[0]?.split('?')[0] || val
                              : val,
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                      />
                      <span className="text-[10px] text-[#7A5B66] mt-1 block">
                        Al hacer clic en el ícono de Instagram, redirige a esta URL directamente.
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                        Cobertura de Entregas y Domicilios
                      </label>
                      <input
                        type="text"
                        value={settings.deliveryCoverage}
                        onChange={(e) => updateSettings({ deliveryCoverage: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#5C3A46] block mb-1">
                        PIN de Seguridad del Dueño
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        value={settings.adminPin}
                        onChange={(e) => updateSettings({ adminPin: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-pink-50/50 border border-pink-200 text-sm focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Cloud Database (Firebase Firestore) */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-emerald-50/70 border border-emerald-200/90 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#1B4332] flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>Base de Datos en la Nube (Google Firestore)</span>
                    </h4>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                      isCloudConnected
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      {isCloudConnected ? 'Conectado a la Nube' : 'Modo Local / Conectando'}
                    </span>
                  </div>
                  <p className="text-xs text-[#2D6A4F] leading-relaxed">
                    Tus categorías, detalles y ajustes se guardan automáticamente en tiempo real en la base de datos en la nube (Google Firebase Firestore). Esto permite que tus cambios se vean instantáneamente en cualquier teléfono, tablet o computadora conectada a internet.
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={isSyncingCloud}
                      onClick={handleCloudSync}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all"
                    >
                      <Cloud className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-bounce' : ''}`} />
                      <span>{isSyncingCloud ? 'Sincronizando...' : 'Forzar Sincronización a la Nube'}</span>
                    </button>
                    <span className="text-[11px] text-[#52796F]">
                      Sincronización en tiempo real activa
                    </span>
                  </div>
                </div>

                {/* Backup & Restore */}
                <div className="p-5 rounded-2xl bg-pink-50/40 border border-pink-200 space-y-4">
                  <h4 className="font-serif text-lg font-bold text-[#2A161E] flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#B8860B]" />
                    <span>Copia de Seguridad del Catálogo</span>
                  </h4>
                  <p className="text-xs text-[#7A5B66] leading-relaxed">
                    Puedes descargar una copia de seguridad en formato JSON de todas tus secciones, productos y fotos para respaldar o restaurar en cualquier momento.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleExport}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-pink-200 hover:border-pink-300 text-xs font-semibold text-[#5C3A46] shadow-2xs hover:bg-pink-50"
                    >
                      <Download className="w-3.5 h-3.5 text-pink-600" />
                      <span>Descargar Copia JSON</span>
                    </button>

                    <input
                      ref={jsonImportRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => jsonImportRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-pink-200 hover:border-pink-300 text-xs font-semibold text-[#5C3A46] shadow-2xs hover:bg-pink-50"
                    >
                      <FileUp className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Restaurar desde JSON</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('¿Restablecer todo a los datos iniciales de demostración?')) {
                          resetToDefaults();
                          showToast('Catálogo restablecido');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-semibold text-rose-700 ml-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restablecer Demo Inicial</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
