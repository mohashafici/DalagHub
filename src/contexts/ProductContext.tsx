import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';
import { mockProducts } from '@/data/mockProducts';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByUser: (userId: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date(),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getProductsByUser = (userId: string) => {
    return products.filter(p => p.sellerId === userId);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, getProductById, getProductsByUser }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
