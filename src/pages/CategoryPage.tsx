
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type Product = {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  original_price: number | null;
  image: string;
  slug: string;
  is_new: boolean | null;
  is_on_sale: boolean | null;
};

type Category = {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  image: string | null;
  parent_id: string | null;
};

const CategoryPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { addToCart } = useCart();
  const { slug } = useParams<{ slug: string }>();

  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Category;
    }
  });

  // Fetch products in this category
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['categoryProducts', category?.id],
    queryFn: async () => {
      if (!category) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Product[];
    },
    enabled: !!category
  });

  const isLoading = categoryLoading || productsLoading;

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id, // Add the id property here
      product_id: product.id,
      quantity: 1,
      name: product.name,
      name_ar: product.name_ar,
      price: product.price,
      image: product.image
    });
    
    toast({
      title: t('product.addedToCart'),
      description: t('product.addedToCartDescription')
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="animate-pulse">
          <div className="h-8 w-1/2 bg-muted rounded mb-4"></div>
          <div className="h-4 w-1/3 bg-muted rounded mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-muted rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{t('category.notFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('category.notFoundDescription')}</p>
          <Button asChild>
            <Link to="/categories">{t('category.browseCategories')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayName = i18n.language === 'ar' ? category.name_ar : category.name;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/categories" className="flex items-center gap-1">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t('common.backToCategories')}
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
        <p className="text-muted-foreground">
          {products?.length
            ? t('category.productsCount', { count: products.length })
            : t('category.noProducts')}
        </p>
      </div>
      
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="product-card group">
              <div className="relative">
                <Link to={`/product/${product.slug}`}>
                  <img 
                    src={product.image} 
                    alt={i18n.language === 'ar' ? product.name_ar : product.name}
                    className="w-full aspect-square object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </Link>
                {product.is_new && (
                  <Badge className="absolute top-2 right-2" variant="default">
                    {t('product.new')}
                  </Badge>
                )}
                {product.is_on_sale && (
                  <Badge className="absolute top-2 left-2" variant="destructive">
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
                <Button className="w-full" size="sm" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                  {t('product.addToCart')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">{t('category.noProducts')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {t('category.noProductsDescription')}
          </p>
          <Button asChild>
            <Link to="/products">{t('category.browseAllProducts')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
