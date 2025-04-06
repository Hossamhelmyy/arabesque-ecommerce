
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Loader2, 
  ShoppingBag, 
  ArrowLeft
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Category = {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  image: string | null;
  parent_id: string | null;
};

const CategoriesPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as Category[];
    }
  });

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

  const renderPlaceholderImage = (category: Category) => {
    const displayName = i18n.language === 'ar' ? category.name_ar : category.name;
    
    return (
      <div className="flex items-center justify-center bg-muted h-full">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <span className="sr-only">{displayName}</span>
      </div>
    );
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('categories.title')}</h1>
        <p className="text-muted-foreground max-w-2xl">
          {t('categories.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories && categories.map((category) => {
          const displayName = i18n.language === 'ar' ? category.name_ar : category.name;
          const isHovered = hoveredCategory === category.id;
          
          return (
            <Card 
              key={category.id} 
              className="group overflow-hidden cursor-pointer transition-all hover:shadow-md"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link to={`/category/${category.slug}`} className="block h-full">
                <div className="aspect-square overflow-hidden">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={displayName}
                      className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling!.style.display = 'flex';
                      }}
                    />
                  ) : (
                    renderPlaceholderImage(category)
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">{displayName}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 rounded-full transition-transform ${isHovered ? 'translate-x-1 rtl:-translate-x-1' : ''}`}
                    >
                      {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      <Separator className="my-12" />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('categories.browseAll')}</h2>
        <p className="text-muted-foreground">{t('categories.viewProducts')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories && categories.map((category) => {
          const displayName = i18n.language === 'ar' ? category.name_ar : category.name;
          
          return (
            <Button 
              key={category.id}
              variant="outline" 
              className="justify-between h-auto py-3"
              asChild
            >
              <Link to={`/category/${category.slug}`}>
                <span>{displayName}</span>
                {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
