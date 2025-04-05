
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  name: string;
  name_ar: string;
  price: number;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user.id || null);
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch cart items when user changes
  useEffect(() => {
    if (userId) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [userId]);

  const fetchCartItems = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          product_id,
          quantity,
          products (
            name,
            name_ar,
            price,
            image
          )
        `)
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedCartItems = data.map(item => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.products.name,
          name_ar: item.products.name_ar,
          price: item.products.price,
          image: item.products.image
        }));
        
        setCartItems(formattedCartItems);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load your cart items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Omit<CartItem, 'id'>) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Check if product already exists in cart
      const existingItem = cartItems.find(item => item.product_id === product.product_id);
      
      if (existingItem) {
        // Update quantity
        await updateCartItemQuantity(product.product_id, existingItem.quantity + product.quantity);
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart')
          .insert({
            user_id: userId,
            product_id: product.product_id,
            quantity: product.quantity
          });
        
        if (error) throw error;
        
        // Refresh cart items
        fetchCartItems();
        
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart"
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      if (error) throw error;
      
      // Update local state
      setCartItems(cartItems.filter(item => item.product_id !== productId));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart"
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    if (!userId) return;
    
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      if (error) throw error;
      
      // Update local state
      setCartItems(cartItems.map(item => 
        item.product_id === productId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setCartItems([]);
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart"
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
