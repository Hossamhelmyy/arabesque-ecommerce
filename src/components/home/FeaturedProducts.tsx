
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { motion } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  original_price?: number;
  image: string;
  slug: string;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
};

const FeaturedProducts = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(8);
      
      if (error) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as Product[];
    }
  });
  
  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast({
        title: t('common.authRequired'),
        description: t('cart.loginToAdd'),
        variant: "destructive"
      });
      return;
    }
    
    try {
      setAddingToCart(product.id);
      await addToCart({
        id: '', // Will be generated on server
        product_id: product.id,
        quantity: 1,
        name: product.name,
        name_ar: product.name_ar,
        price: product.price,
        image: product.image
      });
      
      toast({
        title: t('cart.itemAdded'),
        description: t('cart.itemAddedDesc')
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: t('common.error'),
        description: t('cart.addError'),
        variant: "destructive"
      });
    } finally {
      setAddingToCart(null);
    }
  };
  
  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center">
          {t('home.featured')}
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="product-card">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-12 bg-muted animate-pulse rounded mt-2" />
                  <div className="h-6 w-24 bg-muted animate-pulse rounded mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="product-card group overflow-hidden border-2 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="relative">
                    <Link to={`/product/${product.slug}`}>
                      <div className="overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={i18n.language === 'ar' ? product.name_ar : product.name}
                          className="w-full aspect-square object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </Link>
                    
                    <div className="absolute top-0 left-0 right-0 p-2 flex justify-between">
                      {product.is_new && (
                        <Badge className="bg-primary text-primary-foreground">
                          {t('product.new')}
                        </Badge>
                      )}
                      {product.is_on_sale && (
                        <Badge variant="destructive">
                          {t('product.sale')}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        className="bg-white rounded-full p-2 shadow-md hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Add to favorites</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <Link to={`/product/${product.slug}`} className="block">
                      <h3 className="font-medium text-foreground line-clamp-2 min-h-[50px] hover:text-primary transition-colors duration-200">
                        {i18n.language === 'ar' ? product.name_ar : product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center mt-2">
                      {product.original_price ? (
                        <>
                          <span className="text-destructive font-bold text-lg">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="ml-2 rtl:mr-2 rtl:ml-0 text-muted-foreground line-through text-sm">
                            ${product.original_price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      size="sm"
                      variant="outline"
                      disabled={addingToCart === product.id}
                    >
                      {addingToCart === product.id ? (
                        <Loader2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      {t('product.addToCart')}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center h-10 px-6 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {t('common.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
