
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Heart, ShoppingCart, Search, Filter, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  original_price: number | null;
  image: string;
  slug: string;
  is_featured: boolean | null;
  is_new: boolean | null;
  is_on_sale: boolean | null;
  category_id: string | null;
};

type Category = {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
};

type FilterState = {
  search: string;
  category: string;
  priceRange: [number, number];
  isNew: boolean;
  isOnSale: boolean;
  isFeatured: boolean;
};

const ProductsPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize filters from URL parameters
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialFilters = searchParams.get('filter') || '';
  
  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: initialCategory,
    priceRange: [0, 1000],
    isNew: initialFilters.includes('new'),
    isOnSale: initialFilters.includes('sale'),
    isFeatured: initialFilters.includes('featured'),
  });

  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  
  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, name_ar, slug')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    }
  });
  
  // Fetch products with filters
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', filters, sort],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');
      
      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,name_ar.ilike.%${filters.search}%`);
      }
      
      if (filters.category) {
        const categoryObj = categories?.find(c => c.slug === filters.category);
        if (categoryObj) {
          query = query.eq('category_id', categoryObj.id);
        }
      }
      
      if (filters.isNew) {
        query = query.eq('is_new', true);
      }
      
      if (filters.isOnSale) {
        query = query.eq('is_on_sale', true);
      }
      
      if (filters.isFeatured) {
        query = query.eq('is_featured', true);
      }
      
      // Apply price range filter
      query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      
      // Apply sorting
      switch (sort) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: t('common.error'),
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as Product[];
    },
    enabled: !!categories
  });
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    
    const activeFilters = [];
    if (filters.isNew) activeFilters.push('new');
    if (filters.isOnSale) activeFilters.push('sale');
    if (filters.isFeatured) activeFilters.push('featured');
    
    if (activeFilters.length > 0) {
      params.set('filter', activeFilters.join(','));
    }
    
    if (sort !== 'newest') {
      params.set('sort', sort);
    }
    
    setSearchParams(params);
  }, [filters, sort, setSearchParams]);
  
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleQuickSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The search input updates filters.search directly
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: [0, 1000],
      isNew: false,
      isOnSale: false,
      isFeatured: false,
    });
    setSort('newest');
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart({
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
  
  const countActiveFilters = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.isNew) count++;
    if (filters.isOnSale) count++;
    if (filters.isFeatured) count++;
    return count;
  };
  
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">{t('products.title')}</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="font-medium mb-3">{t('products.categories')}</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start px-2 ${!filters.category ? 'font-bold text-primary' : ''}`}
                    onClick={() => handleFilterChange('category', '')}
                  >
                    {t('products.allCategories')}
                  </Button>
                </div>
                {categories?.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start px-2 ${filters.category === category.slug ? 'font-bold text-primary' : ''}`}
                      onClick={() => handleFilterChange('category', category.slug)}
                    >
                      {i18n.language === 'ar' ? category.name_ar : category.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">{t('products.filters')}</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="filter-new" 
                    checked={filters.isNew}
                    onCheckedChange={(checked) => 
                      handleFilterChange('isNew', checked === true)
                    } 
                  />
                  <label htmlFor="filter-new" className="text-sm cursor-pointer">
                    {t('product.new')}
                  </label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="filter-sale" 
                    checked={filters.isOnSale}
                    onCheckedChange={(checked) => 
                      handleFilterChange('isOnSale', checked === true)
                    } 
                  />
                  <label htmlFor="filter-sale" className="text-sm cursor-pointer">
                    {t('product.sale')}
                  </label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="filter-featured" 
                    checked={filters.isFeatured}
                    onCheckedChange={(checked) => 
                      handleFilterChange('isFeatured', checked === true)
                    } 
                  />
                  <label htmlFor="filter-featured" className="text-sm cursor-pointer">
                    {t('home.featured')}
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                disabled={countActiveFilters() === 0}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t('products.clearFilters')}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <form onSubmit={handleQuickSearch} className="relative w-full sm:w-auto sm:min-w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-2.5" />
                <Input 
                  type="search" 
                  placeholder={t('common.search')} 
                  className="pl-8 rtl:pl-3 rtl:pr-8"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </form>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t('products.filters')}
                  {countActiveFilters() > 0 && (
                    <Badge variant="secondary" className="ml-2 rtl:mr-2 rtl:ml-0">
                      {countActiveFilters()}
                    </Badge>
                  )}
                </Button>
                
                <div className="flex items-center gap-2 ml-auto rtl:mr-auto rtl:ml-0">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t('products.sortBy')}:
                  </span>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('products.sortNewest')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t('products.sortNewest')}</SelectItem>
                      <SelectItem value="oldest">{t('products.sortOldest')}</SelectItem>
                      <SelectItem value="price_asc">{t('products.sortPriceLow')}</SelectItem>
                      <SelectItem value="price_desc">{t('products.sortPriceHigh')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Mobile Filters */}
            {showFilters && (
              <div className="md:hidden border rounded-md p-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-3">{t('products.categories')}</h3>
                  <Select 
                    value={filters.category} 
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('products.allCategories')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('products.allCategories')}</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {i18n.language === 'ar' ? category.name_ar : category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">{t('products.filters')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox 
                        id="mobile-filter-new" 
                        checked={filters.isNew}
                        onCheckedChange={(checked) => 
                          handleFilterChange('isNew', checked === true)
                        } 
                      />
                      <label htmlFor="mobile-filter-new" className="text-sm cursor-pointer">
                        {t('product.new')}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox 
                        id="mobile-filter-sale" 
                        checked={filters.isOnSale}
                        onCheckedChange={(checked) => 
                          handleFilterChange('isOnSale', checked === true)
                        } 
                      />
                      <label htmlFor="mobile-filter-sale" className="text-sm cursor-pointer">
                        {t('product.sale')}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox 
                        id="mobile-filter-featured" 
                        checked={filters.isFeatured}
                        onCheckedChange={(checked) => 
                          handleFilterChange('isFeatured', checked === true)
                        } 
                      />
                      <label htmlFor="mobile-filter-featured" className="text-sm cursor-pointer">
                        {t('home.featured')}
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    disabled={countActiveFilters() === 0}
                  >
                    <X className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t('products.clearFilters')}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    onClick={() => setShowFilters(false)}
                  >
                    {t('common.apply')}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Active filters display */}
            {countActiveFilters() > 0 && (
              <div className="flex flex-wrap gap-2 items-center text-sm">
                <span className="text-muted-foreground">{t('products.activeFilters')}:</span>
                
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t('products.search')}: {filters.search}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange('search', '')}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('products.remove')}</span>
                    </Button>
                  </Badge>
                )}
                
                {filters.category && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t('products.category')}: {
                      categories?.find(c => c.slug === filters.category)
                        ? i18n.language === 'ar' 
                          ? categories.find(c => c.slug === filters.category)?.name_ar
                          : categories.find(c => c.slug === filters.category)?.name
                        : filters.category
                    }
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange('category', '')}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('products.remove')}</span>
                    </Button>
                  </Badge>
                )}
                
                {filters.isNew && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t('product.new')}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange('isNew', false)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('products.remove')}</span>
                    </Button>
                  </Badge>
                )}
                
                {filters.isOnSale && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t('product.sale')}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange('isOnSale', false)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('products.remove')}</span>
                    </Button>
                  </Badge>
                )}
                
                {filters.isFeatured && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t('home.featured')}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange('isFeatured', false)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('products.remove')}</span>
                    </Button>
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7 px-2"
                  onClick={clearFilters}
                >
                  {t('products.clearAll')}
                </Button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          ) : products && products.length > 0 ? (
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
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">{t('products.noResults')}</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {t('products.noResultsDescription')}
              </p>
              <Button onClick={clearFilters}>
                {t('products.clearFilters')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
