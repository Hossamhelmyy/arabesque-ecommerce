
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Heart, 
  Loader2, 
  ShoppingBag, 
  ShoppingCart,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type FavoriteProduct = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products: {
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
};

const FavoritesPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Fetch favorites
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('wish_list')
        .select(`
          id, 
          user_id, 
          product_id, 
          created_at,
          products (
            id, 
            name, 
            name_ar, 
            price, 
            original_price, 
            image, 
            slug,
            is_new,
            is_on_sale
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as FavoriteProduct[];
    },
    enabled: !!user
  });

  // Remove from favorites mutation
  const removeMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from('wish_list')
        .delete()
        .eq('id', favoriteId);
      
      if (error) {
        throw error;
      }
      
      return favoriteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      toast({
        title: t('product.removedFromFavorites'),
        description: t('product.removedFromFavoritesDescription')
      });
    },
    onError: (error) => {
      console.error('Error removing from favorites:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to remove from favorites',
        variant: 'destructive'
      });
    }
  });

  const clearAllFavorites = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('wish_list')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      
      toast({
        title: t('favorites.removeAll'),
        description: 'All favorites have been removed'
      });
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to clear favorites',
        variant: 'destructive'
      });
    }
  };

  const handleAddToCart = (product: FavoriteProduct['products']) => {
    addToCart({
      id: product.id,
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

  const handleRemoveFromFavorites = (favoriteId: string) => {
    removeMutation.mutate(favoriteId);
  };

  if (!user) {
    return (
      <div className="container py-12">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">{t('profile.notLoggedIn')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {t('profile.notLoggedInMessage')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/auth">{t('profile.signInButton')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth?signup=true">{t('profile.createAccountButton')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <div className="text-destructive mb-4">
          <span className="sr-only">{t('common.error')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mx-auto">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-muted-foreground">{t('common.error')}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">{t('favorites.empty')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {t('favorites.emptyMessage')}
          </p>
          <Button asChild>
            <Link to="/products">{t('favorites.startBrowsing')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('favorites.title')}</h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? t('cart.item') : t('cart.items')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearAllFavorites}>
          <Trash2 className="mr-2 h-4 w-4" />
          {t('favorites.removeAll')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => {
          const product = favorite.products;
          const isHovered = hoveredProductId === product.id;
          const displayName = i18n.language === 'ar' ? product.name_ar : product.name;
          
          return (
            <Card 
              key={favorite.id} 
              className="product-card group relative"
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <div className="relative">
                <Link to={`/product/${product.slug}`}>
                  <img 
                    src={product.image} 
                    alt={displayName}
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
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  onClick={() => handleRemoveFromFavorites(favorite.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                  <span className="sr-only">Remove from favorites</span>
                </Button>
              </div>
              <CardContent className="p-4">
                <Link to={`/product/${product.slug}`} className="block">
                  <h3 className="font-medium text-foreground line-clamp-2 min-h-[50px]">
                    {displayName}
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
                  className="w-full" 
                  size="sm" 
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                  {t('product.addToCart')}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPage;
