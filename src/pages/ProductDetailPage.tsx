
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Heart, Share2, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
  price: number;
  original_price: number | null;
  image: string;
  images: string[] | null;
  stock_quantity: number;
  is_new: boolean;
  is_on_sale: boolean;
  category_id: string | null;
  slug: string;
};

type Category = {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
};

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            id, name, name_ar, slug
          )
        `)
        .eq('slug', slug)
        .single();
      
      if (error) {
        toast({
          title: t('common.error'),
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as Product & { categories: Category };
    }
  });

  useEffect(() => {
    // Reset selected image index and quantity when product changes
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [slug]);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && (!product || newQuantity <= product.stock_quantity)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id, // Add the id property here
      product_id: product.id,
      quantity,
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

  const getImageArray = (product: Product | undefined) => {
    if (!product) return [];
    const mainImage = product.image;
    const additionalImages = product.images || [];
    return [mainImage, ...additionalImages];
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[400px] bg-muted rounded"></div>
            <div>
              <div className="h-8 w-3/4 bg-muted rounded mb-4"></div>
              <div className="h-6 w-1/4 bg-muted rounded mb-6"></div>
              <div className="h-4 w-full bg-muted rounded mb-2"></div>
              <div className="h-4 w-full bg-muted rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-muted rounded mb-6"></div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{t('product.notFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('product.notFoundDescription')}</p>
          <Button asChild>
            <Link to="/products">{t('product.browseProducts')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = getImageArray(product);
  const isOutOfStock = product.stock_quantity <= 0;
  const displayName = i18n.language === 'ar' ? product.name_ar : product.name;
  const displayDescription = i18n.language === 'ar' ? product.description_ar : product.description;
  const categoryName = product.categories ? 
    (i18n.language === 'ar' ? product.categories.name_ar : product.categories.name) : '';
  const categoryLink = product.categories ? `/category/${product.categories.slug}` : '';

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/products" className="flex items-center gap-1">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t('common.backToProducts')}
          </Link>
        </Button>
        
        {categoryName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/categories" className="hover:underline">{t('common.categories')}</Link>
            <span>/</span>
            {categoryLink ? (
              <Link to={categoryLink} className="hover:underline">{categoryName}</Link>
            ) : (
              <span>{categoryName}</span>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <AspectRatio ratio={1/1}>
              <img 
                src={images[selectedImageIndex]} 
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </AspectRatio>
            
            {product.is_new && (
              <Badge className="absolute top-2 left-2 z-10">
                {t('product.new')}
              </Badge>
            )}
            
            {product.is_on_sale && (
              <Badge variant="destructive" className="absolute top-2 right-2 z-10">
                {t('product.sale')}
              </Badge>
            )}
          </div>
          
          {images.length > 1 && (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-2 p-1">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-muted'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${displayName} - ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{displayName}</h1>
            
            <div className="mt-4 flex items-baseline gap-2">
              {product.original_price ? (
                <>
                  <span className="text-2xl font-bold text-destructive">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground line-through text-lg">
                    ${product.original_price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mt-2">
              <span className={`text-sm ${isOutOfStock ? 'text-destructive' : 'text-green-600'}`}>
                {isOutOfStock ? t('product.outOfStock') : t('product.inStock')}
              </span>
            </div>
          </div>
          
          <div>
            {displayDescription && (
              <p className="text-muted-foreground">
                {displayDescription}
              </p>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="mr-4 rtl:ml-4 rtl:mr-0 font-medium">
                {t('product.quantity')}
              </span>
              <div className="flex items-center border rounded-md">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">{t('product.decreaseQuantity')}</span>
                </Button>
                <span className="w-12 text-center">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isOutOfStock || quantity >= product.stock_quantity}
                  className="h-10 w-10 rounded-none"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">{t('product.increaseQuantity')}</span>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                {t('product.addToCart')}
              </Button>
              
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
                <span className="sr-only">{t('product.addToFavorites')}</span>
              </Button>
              
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">{t('product.share')}</span>
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="details">{t('product.details')}</TabsTrigger>
              <TabsTrigger value="shipping">{t('product.shipping')}</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium">{t('product.sku')}</div>
                <div>{product.id.substring(0, 8).toUpperCase()}</div>
                
                <div className="font-medium">{t('product.category')}</div>
                <div>{categoryName || t('product.uncategorized')}</div>
                
                <div className="font-medium">{t('product.availability')}</div>
                <div>{product.stock_quantity > 0 ? `${product.stock_quantity} ${t('product.itemsLeft')}` : t('product.outOfStock')}</div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('product.shippingDescription')}
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>{t('product.shippingPoint1')}</li>
                <li>{t('product.shippingPoint2')}</li>
                <li>{t('product.shippingPoint3')}</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
