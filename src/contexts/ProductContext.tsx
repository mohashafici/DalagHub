import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type ProductStatus = 'active' | 'sold';

export interface Product {
  id: string;
  title: string;
  category: 'crops' | 'livestock';
  subcategory: string;
  quantity: string;
  price: string;
  description: string | null;
  images: string[];
  location: string;
  seller_id: string;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  // Joined seller profile data
  seller_name?: string;
  seller_phone?: string;
}

// Contact link generators
export function generateWhatsAppLink(phone: string, productTitle: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const message = encodeURIComponent(`Hello, I am interested in your ${productTitle} listing on DalagHub.`);
  return `https://wa.me/${cleanPhone.replace('+', '')}?text=${message}`;
}

export function generatePhoneLink(phone: string): string {
  return `tel:${phone}`;
}

export interface ContactInfo {
  phone: string;
  whatsappLink: string;
  phoneLink: string;
}

interface CreateProductInput {
  title: string;
  category: 'crops' | 'livestock';
  subcategory: string;
  quantity: string;
  price?: string;
  description?: string;
  images: string[];
  location: string;
}

interface ProductContextType {
  products: Product[];
  allUserProducts: Product[];
  isLoading: boolean;
  addProduct: (product: CreateProductInput) => Promise<{ success: boolean; error?: string }>;
  getProductById: (id: string) => Promise<Product | null>;
  getProductsByUser: (userId: string) => Product[];
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateProductStatus: (id: string, status: ProductStatus) => Promise<{ success: boolean; error?: string }>;
  reportProduct: (productId: string, reason: string, description?: string) => Promise<{ success: boolean; error?: string }>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [allUserProducts, setAllUserProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchProducts = async () => {
    setIsLoading(true);
    
    // Fetch active products for public display
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (data && !error) {
      // Fetch seller profiles separately
      const sellerIds = [...new Set(data.map(p => p.seller_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, phone')
        .in('id', sellerIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const formattedProducts: Product[] = data.map((p: any) => {
        const profile = profileMap.get(p.seller_id);
        return {
          ...p,
          seller_name: profile?.name || 'Unknown Seller',
          seller_phone: profile?.phone || '',
        };
      });
      setProducts(formattedProducts);
    }
    
    // Fetch all user products if logged in
    if (user) {
      const { data: userProducts } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      
      if (userProducts) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, phone')
          .eq('id', user.id)
          .maybeSingle();
        
        const formattedUserProducts: Product[] = userProducts.map((p: any) => ({
          ...p,
          seller_name: profile?.name || 'Unknown Seller',
          seller_phone: profile?.phone || '',
        }));
        setAllUserProducts(formattedUserProducts);
      }
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const addProduct = async (product: CreateProductInput): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'You must be logged in to add a product' };
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        title: product.title,
        category: product.category,
        subcategory: product.subcategory,
        quantity: product.quantity,
        price: product.price || 'Negotiable',
        description: product.description || null,
        images: product.images,
        location: product.location,
        seller_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }

    await fetchProducts();
    return { success: true };
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    // First check local cache
    const cachedProduct = products.find(p => p.id === id);
    if (cachedProduct) return cachedProduct;

    // Fetch from DB if not in cache
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data && !error) {
      // Fetch seller profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, phone')
        .eq('id', data.seller_id)
        .maybeSingle();
      return {
        ...data,
        seller_name: profile?.name || 'Unknown Seller',
        seller_phone: profile?.phone || '',
      } as Product;
    }

    return null;
  };

  const getProductsByUser = (userId: string): Product[] => {
    return products.filter(p => p.seller_id === userId);
  };

  const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    await fetchProducts();
    return { success: true };
  };

  const updateProductStatus = async (id: string, status: ProductStatus): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase
      .from('products')
      .update({ status })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    await fetchProducts();
    return { success: true };
  };

  const reportProduct = async (productId: string, reason: string, description?: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase
      .from('product_reports')
      .insert({
        product_id: productId,
        reporter_id: user?.id || null,
        reason,
        description: description || null,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const refreshProducts = fetchProducts;

  return (
    <ProductContext.Provider value={{ 
      products,
      allUserProducts,
      isLoading, 
      addProduct, 
      getProductById, 
      getProductsByUser,
      deleteProduct,
      updateProductStatus,
      reportProduct,
      refreshProducts 
    }}>
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
