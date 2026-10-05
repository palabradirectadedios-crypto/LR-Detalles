import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { Category, Product, StoreSettings, FilterState } from '../types/catalog';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_STORE_SETTINGS,
} from '../data/defaultCatalog';
import { db, testFirestoreConnection } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

interface CatalogContextType {
  categories: Category[];
  products: Product[];
  settings: StoreSettings;
  wishlist: string[];
  activeFilter: FilterState;
  setActiveFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;
  filteredProducts: Product[];
  featuredProducts: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isOwnerAuthenticated: boolean;
  setIsOwnerAuthenticated: (auth: boolean) => void;
  isCloudConnected: boolean;
  syncToCloud: () => Promise<void>;
  // Category management
  addCategory: (name: string, description?: string, iconName?: string) => Category;
  updateCategory: (id: string, name: string, description?: string, iconName?: string) => void;
  deleteCategory: (id: string) => { success: boolean; message?: string };
  // Product management
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  // Store Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistProducts: Product[];
  // Backup / Reset
  exportCatalogData: () => string;
  importCatalogData: (jsonData: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
  // WhatsApp & Social Helpers
  getWhatsAppUrl: (message?: string) => string;
  getInstagramUrl: () => string;
  getWhatsAppLinkForProduct: (product: Product) => string;
  getWhatsAppLinkForWishlist: () => string;
  formatPrice: (amount: number) => string;
}

const STORAGE_KEYS = {
  CATEGORIES: 'lr_detalles_categories_v3',
  PRODUCTS: 'lr_detalles_products_v3',
  SETTINGS: 'lr_detalles_settings_v3',
  WISHLIST: 'lr_detalles_wishlist_v2',
  AUTH: 'lr_detalles_auth_session',
};

// Fallback loader to ensure any changes the user made in previous sessions are preserved
const loadSavedData = <T,>(primaryKey: string, fallbackKeys: string[], defaultValue: T): T => {
  try {
    const primary = localStorage.getItem(primaryKey);
    if (primary) return JSON.parse(primary);

    for (const key of fallbackKeys) {
      const fallback = localStorage.getItem(key);
      if (fallback) {
        // Migrate to primary key immediately
        localStorage.setItem(primaryKey, fallback);
        return JSON.parse(fallback);
      }
    }
  } catch (err) {
    console.warn('Error reading from localStorage', err);
  }
  return defaultValue;
};

const initialFilter: FilterState = {
  categoryId: 'all',
  searchQuery: '',
  priceRange: 'all',
  selectedTag: 'all',
  sortBy: 'featured',
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage with version fallbacks so user edits are never lost
  const [categories, setCategories] = useState<Category[]>(() => {
    const raw = loadSavedData(
      STORAGE_KEYS.CATEGORIES,
      ['lr_detalles_categories_v2', 'lr_detalles_categories_v1', 'lr_detalles_categories'],
      DEFAULT_CATEGORIES
    );
    // Filter out desayunos and globos
    const filtered = (raw && raw.length > 0 ? raw : DEFAULT_CATEGORIES).filter(
      (c: Category) =>
        c.id !== 'cat-desayunos' &&
        !c.slug?.includes('desayuno') &&
        !c.name?.toLowerCase().includes('desayuno') &&
        c.id !== 'cat-globos' &&
        !c.slug?.includes('globos')
    );

    // Ensure 'cat-limpiapipas' exists
    const hasLimpiapipas = filtered.some((c: Category) => c.id === 'cat-limpiapipas' || c.slug === 'flores-en-limpiapipas');
    const fullCategories = hasLimpiapipas
      ? filtered
      : [
          ...filtered,
          {
            id: 'cat-limpiapipas',
            name: 'Flores en Limpiapipas',
            slug: 'flores-en-limpiapipas',
            description: 'Hermosos ramos y flores artesanales moldeadas en limpiapipas de colores con detalles únicos.',
            iconName: 'Sparkles',
            order: 2,
          },
        ];

    // Enforce user requested order: 1. Flores Eternas, 2. Flores en Limpiapipas, 3. Anchetas, 4. Cajas de Regalo
    return fullCategories.map((c: Category) => {
      if (c.id === 'cat-flores-eternas' || c.slug === 'flores-eternas') {
        return {
          ...c,
          name: 'Flores Eternas',
          order: 1,
        };
      }
      if (c.id === 'cat-limpiapipas' || c.slug === 'flores-en-limpiapipas') {
        return {
          ...c,
          name: 'Flores en Limpiapipas',
          order: 2,
        };
      }
      if (c.id === 'cat-anchetas' || c.slug === 'anchetas') {
        return {
          ...c,
          name: 'Anchetas',
          description: 'Cajas decoradas a tu gusto con peluches, flores, globos y hermosos detalles pensados para sorprender.',
          order: 3,
        };
      }
      if (c.id === 'cat-cajas-regalo' || c.slug?.includes('cajas-de-regalo')) {
        return {
          ...c,
          name: 'Cajas de Regalo',
          description: 'Cajas sorpresa con fotografías, dedicatorias, dulces, luces cálidas y detalles únicos.',
          order: 4,
        };
      }
      return c;
    }).sort((a: Category, b: Category) => a.order - b.order);
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const raw = loadSavedData(
      STORAGE_KEYS.PRODUCTS,
      ['lr_detalles_products_v2', 'lr_detalles_products_v1', 'lr_detalles_products'],
      DEFAULT_PRODUCTS
    );
    // Filter out any products from cat-desayunos and reassign limpiapipas and globos products
    return (raw && raw.length > 0 ? raw : DEFAULT_PRODUCTS)
      .filter((p: Product) => p.categoryId !== 'cat-desayunos' && !p.title?.toLowerCase().includes('desayuno'))
      .map((p: Product) => {
        if (p.id === 'prod-3' || p.title?.toLowerCase().includes('limpiapipas')) {
          return { ...p, categoryId: 'cat-limpiapipas' };
        }
        if (p.categoryId === 'cat-globos') {
          return { ...p, categoryId: 'cat-flores-eternas' };
        }
        return p;
      });
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const loaded = loadSavedData(
      STORAGE_KEYS.SETTINGS,
      ['lr_detalles_settings_v3', 'lr_detalles_settings_v2', 'lr_detalles_settings_v1', 'lr_detalles_settings'],
      DEFAULT_STORE_SETTINGS
    );
    const merged = { ...DEFAULT_STORE_SETTINGS, ...loaded };
    // Enforce new tagline and correct tildes
    merged.tagline = 'Sorprende. Regala. Enamora.';
    if (merged.deliveryCoverage === 'Envios personalizados solo en la ciudad de Monteria' || !merged.deliveryCoverage?.includes('í')) {
      merged.deliveryCoverage = 'Envíos personalizados solo en la ciudad de Montería';
    }
    // Guarantee active Instagram URL from user instruction
    if (!merged.instagramUrl || merged.instagramUsername === 'lrdetalles_oficial') {
      merged.instagramUrl = 'https://www.instagram.com/lr_detalles0?stkn=MWx1aHcyYWttMGNtaA==';
      merged.instagramUsername = 'lr_detalles0';
    }
    return merged;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [activeFilter, setActiveFilterState] = useState<FilterState>(initialFilter);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const isSyncingRef = useRef(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed saving categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed saving products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed saving wishlist to localStorage', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, isOwnerAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed saving auth state', e);
    }
  }, [isOwnerAuthenticated]);

  // Real-time Cloud Sync with Firebase Firestore
  useEffect(() => {
    let unsubscribeCats: (() => void) | undefined;
    let unsubscribeProds: (() => void) | undefined;
    let unsubscribeSettings: (() => void) | undefined;

    testFirestoreConnection().then((connected) => {
      setIsCloudConnected(connected);
      if (!connected) return;

      // Check and seed if Firestore database is empty
      getDocs(collection(db, 'categories')).then((snap) => {
        if (snap.empty) {
          categories.forEach((cat) => {
            setDoc(doc(db, 'categories', cat.id), cat).catch(console.warn);
          });
        }
      }).catch(console.warn);

      getDocs(collection(db, 'products')).then((snap) => {
        if (snap.empty) {
          products.forEach((prod) => {
            setDoc(doc(db, 'products', prod.id), prod).catch(console.warn);
          });
        }
      }).catch(console.warn);

      getDocs(collection(db, 'settings')).then((snap) => {
        if (snap.empty) {
          setDoc(doc(db, 'settings', 'global'), settings).catch(console.warn);
        }
      }).catch(console.warn);

      // Listen for remote real-time updates
      unsubscribeCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteCats: Category[] = [];
          snapshot.forEach((d) => remoteCats.push(d.data() as Category));
          remoteCats.sort((a, b) => (a.order || 0) - (b.order || 0));
          setCategories(remoteCats);
        }
      }, (err) => console.warn('Firestore categories listener:', err));

      unsubscribeProds = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteProds: Product[] = [];
          snapshot.forEach((d) => remoteProds.push(d.data() as Product));
          setProducts(remoteProds);
        }
      }, (err) => console.warn('Firestore products listener:', err));

      unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
        if (snapshot.exists()) {
          const remoteSettings = snapshot.data() as StoreSettings;
          setSettings((prev) => ({ ...prev, ...remoteSettings }));
        }
      }, (err) => console.warn('Firestore settings listener:', err));
    }).catch(console.warn);

    return () => {
      if (unsubscribeCats) unsubscribeCats();
      if (unsubscribeProds) unsubscribeProds();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, []);

  const syncToCloud = async () => {
    isSyncingRef.current = true;
    try {
      for (const cat of categories) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      for (const prod of products) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      await setDoc(doc(db, 'settings', 'global'), settings);
      setIsCloudConnected(true);
    } catch (e) {
      console.error('Error syncing catalog to cloud:', e);
      throw e;
    } finally {
      isSyncingRef.current = false;
    }
  };

  const setActiveFilter = (partial: Partial<FilterState>) => {
    setActiveFilterState((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setActiveFilterState(initialFilter);
  };

  // Category operations
  const addCategory = (name: string, description = '', iconName = 'Sparkles'): Category => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug,
      description: description.trim(),
      iconName,
      order: categories.length + 1,
    };
    setCategories((prev) => [...prev, newCategory]);
    // Save to Firestore
    setDoc(doc(db, 'categories', newCategory.id), newCategory).catch(console.warn);
    return newCategory;
  };

  const updateCategory = (id: string, name: string, description = '', iconName = 'Sparkles') => {
    const updated = {
      name: name.trim(),
      slug: name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'),
      description: description.trim(),
      iconName,
    };
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat))
    );
    // Save to Firestore
    setDoc(doc(db, 'categories', id), updated, { merge: true }).catch(console.warn);
  };

  const deleteCategory = (id: string) => {
    const hasProducts = products.some((p) => p.categoryId === id);
    if (hasProducts) {
      return {
        success: false,
        message: 'No puedes eliminar una sección con productos activos. Mueve o elimina primero los productos.',
      };
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    if (activeFilter.categoryId === id) {
      setActiveFilter({ categoryId: 'all' });
    }
    // Delete from Firestore
    deleteDoc(doc(db, 'categories', id)).catch(console.warn);
    return { success: true };
  };

  // Product operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    // Save to Firestore
    setDoc(doc(db, 'products', newProduct.id), newProduct).catch(console.warn);
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...productData } : prod))
    );
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...productData } : null));
    }
    // Save to Firestore
    setDoc(doc(db, 'products', id), productData, { merge: true }).catch(console.warn);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    setWishlist((prev) => prev.filter((prodId) => prodId !== id));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
    // Delete from Firestore
    deleteDoc(doc(db, 'products', id)).catch(console.warn);
  };

  const duplicateProduct = (id: string) => {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const duplicated: Product = {
      ...original,
      id: `prod-${Date.now()}`,
      title: `${original.title} (Copia)`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
    // Save to Firestore
    setDoc(doc(db, 'products', duplicated.id), duplicated).catch(console.warn);
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      // Save to Firestore
      setDoc(doc(db, 'settings', 'global'), merged).catch(console.warn);
      return merged;
    });
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured);
  }, [products]);

  // Filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeFilter.categoryId !== 'all' && p.categoryId !== activeFilter.categoryId) {
          return false;
        }

        // Search filter
        if (activeFilter.searchQuery.trim()) {
          const q = activeFilter.searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          const matchIncludes = p.includes?.some((inc) => inc.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTags && !matchIncludes) {
            return false;
          }
        }

        // Tag filter
        if (activeFilter.selectedTag !== 'all') {
          if (!p.tags.includes(activeFilter.selectedTag)) {
            return false;
          }
        }

        // Price range
        if (activeFilter.priceRange !== 'all') {
          const price = p.suggestedPrice;
          if (activeFilter.priceRange === 'under-50' && price >= 50000) return false;
          if (activeFilter.priceRange === '50-100' && (price < 50000 || price > 100000)) return false;
          if (activeFilter.priceRange === '100-200' && (price < 100000 || price > 200000)) return false;
          if (activeFilter.priceRange === 'over-200' && price < 200000) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (activeFilter.sortBy === 'price-asc') {
          return a.suggestedPrice - b.suggestedPrice;
        }
        if (activeFilter.sortBy === 'price-desc') {
          return b.suggestedPrice - a.suggestedPrice;
        }
        if (activeFilter.sortBy === 'name-asc') {
          return a.title.localeCompare(b.title);
        }
        // 'featured'
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, activeFilter]);

  // Export / Import
  const exportCatalogData = () => {
    const data = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      storeSettings: settings,
      categories,
      products,
    };
    return JSON.stringify(data, null, 2);
  };

  const importCatalogData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.categories || !parsed.products) {
        return { success: false, error: 'El archivo JSON no tiene la estructura de catálogo requerida.' };
      }
      setCategories(parsed.categories);
      setProducts(parsed.products);
      if (parsed.storeSettings) {
        setSettings(parsed.storeSettings);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al procesar el archivo JSON.' };
    }
  };

  const resetToDefaults = () => {
    setCategories(DEFAULT_CATEGORIES);
    setProducts(DEFAULT_PRODUCTS);
    setSettings(DEFAULT_STORE_SETTINGS);
    setWishlist([]);
    setActiveFilterState(initialFilter);
  };

  // WhatsApp Helpers
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: settings.currencyCode || 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCleanPhone = (phone: string) => {
    let clean = (phone || '').replace(/[^0-9]/g, '');
    if (!clean) return '573105551234';
    // If entered as a standard 10-digit Colombian mobile (e.g., 3101234567), automatically prepend 57
    if (clean.length === 10 && clean.startsWith('3')) {
      clean = '57' + clean;
    }
    return clean;
  };

  const getWhatsAppUrl = (message?: string): string => {
    const cleanPhone = getCleanPhone(settings.whatsappNumber);
    return message
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/${cleanPhone}`;
  };

  const getInstagramUrl = (): string => {
    if (settings.instagramUrl && settings.instagramUrl.trim()) {
      return settings.instagramUrl.trim();
    }
    if (settings.instagramUsername && settings.instagramUsername.trim()) {
      const cleanUser = settings.instagramUsername.replace(/^@/, '').trim();
      return `https://instagram.com/${cleanUser}`;
    }
    return 'https://www.instagram.com/lr_detalles0?stkn=MWx1aHcyYWttMGNtaA==';
  };

  const getWhatsAppLinkForProduct = (product: Product): string => {
    const cleanPhone = getCleanPhone(settings.whatsappNumber);
    const category = categories.find((c) => c.id === product.categoryId)?.name || 'Detalles';
    const message = `¡Hola ${settings.storeName}! 🌸✨\n\nEstuve revisando su catálogo interactivo y me encantó este detalle:\n\n*${product.title}*\n• Categoría: ${category}\n• Precio de referencia: ${formatPrice(product.suggestedPrice)}\n• Disponibilidad: ${product.availability === 'disponible' ? 'Inmediata' : 'Por encargo'}\n\n¿Me podrían confirmar si tienen disponibilidad para la fecha de mi entrega y los métodos de pago? ¡Muchas gracias!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const getWhatsAppLinkForWishlist = (): string => {
    const cleanPhone = getCleanPhone(settings.whatsappNumber);
    if (wishlistProducts.length === 0) return `https://wa.me/${cleanPhone}`;

    const itemsText = wishlistProducts
      .map((p, idx) => `${idx + 1}. *${p.title}* - ${formatPrice(p.suggestedPrice)}`)
      .join('\n');

    const total = wishlistProducts.reduce((sum, p) => sum + p.suggestedPrice, 0);

    const message = `¡Hola ${settings.storeName}! 🌸\n\nGuardé varios detalles favoritos en mi lista de deseos de su catálogo y me gustaría cotizar o recibir asesoría:\n\n${itemsText}\n\n• *Total estimado:* ${formatPrice(total)}\n\n¿Me podrían brindar información sobre cómo agendar la entrega? ¡Gracias!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CatalogContext.Provider
      value={{
        categories,
        products,
        settings,
        wishlist,
        activeFilter,
        setActiveFilter,
        resetFilters,
        filteredProducts,
        featuredProducts,
        selectedProduct,
        setSelectedProduct,
        isWishlistOpen,
        setIsWishlistOpen,
        isAdminOpen,
        setIsAdminOpen,
        isOwnerAuthenticated,
        setIsOwnerAuthenticated,
        isCloudConnected,
        syncToCloud,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateSettings,
        toggleWishlist,
        isInWishlist,
        wishlistProducts,
        exportCatalogData,
        importCatalogData,
        resetToDefaults,
        getWhatsAppUrl,
        getInstagramUrl,
        getWhatsAppLinkForProduct,
        getWhatsAppLinkForWishlist,
        formatPrice,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
