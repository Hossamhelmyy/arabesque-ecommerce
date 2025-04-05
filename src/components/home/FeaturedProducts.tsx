
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
              <Card key={product.id} className="product-card group">
                <div className="relative">
                  <Link to={`/product/${product.slug}`}>
                    <img 
                      src={product.image} 
                      alt={i18n.language === 'ar' ? product.name_ar : product.name}
                      className="w-full aspect-square object-cover"
                    />
                  </Link>
                  {product.is_new && (
                    <Badge className="absolute top-2 right-2" variant="default">
                      {t('product.new')}
                    </Badge>
                  )}
                  {product.is_on_sale && (
                    <Badge className="absolute top-2 right-2" variant="destructive">
                      {t('product.sale')}
                    </Badge>
                  )}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Add to favorites</span>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link to={`/product/${product.slug}`} className="block">
                    <h3 className="font-medium text-foreground line-clamp-2 min-h-[50px]">
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
                  <Button className="w-full" size="sm">
                    <ShoppingCart className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                    {t('product.addToCart')}
                  </Button>
                </CardFooter>
              </Card>
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
