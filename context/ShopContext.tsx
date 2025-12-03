import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, ShopContextType } from '../types';
import { CATALOG } from '../constants';
import { fetchProductsFromDB, addProductToDB, deleteProductFromDB } from '../services/firebase';

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Load products from Firestore on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const dbProducts = await fetchProductsFromDB();
      if (dbProducts.length > 0) {
        setProducts(dbProducts);
      } else {
        // Fallback to constants if DB is empty or fails (for demo purposes)
        setProducts(CATALOG);
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    const newItem: CartItem = {
      ...product,
      cartId: Math.random().toString(36).substr(2, 9),
    };
    setCart((prev) => [...prev, newItem]);
  };

  // Admin Actions with Firebase
  const addProduct = async (product: Product) => {
    // Optimistic UI update
    const tempId = Math.random().toString(36);
    const productWithTempId = { ...product, id: tempId };
    setProducts(prev => [...prev, productWithTempId]);

    // Save to DB
    // Remove the ID before sending to Firestore (Firestore generates it)
    const { id, ...productData } = product;
    const newId = await addProductToDB(productData);
    
    if (newId) {
      // Update the local state with the real ID
      setProducts(prev => prev.map(p => p.id === tempId ? { ...p, id: newId } : p));
    }
  };

  const removeProduct = async (id: string) => {
    // Optimistic UI update
    setProducts(prev => prev.filter(p => p.id !== id));
    
    // Delete from DB
    await deleteProductFromDB(id);
  };

  const openConfigurator = (product: Product) => {
    setActiveProduct(product);
    setIsConfiguratorOpen(true);
  };

  const closeConfigurator = () => {
    setIsConfiguratorOpen(false);
    setTimeout(() => setActiveProduct(null), 500); // Wait for animation
  };

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      addToCart,
      addProduct,
      removeProduct,
      isConfiguratorOpen,
      isAdminOpen,
      setIsAdminOpen,
      activeProduct,
      openConfigurator,
      closeConfigurator
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
