
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type Category = {
  id: string;
  name: string;
  name_ar: string;
  image: string;
  slug: string;
};

const FeaturedCategories = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['featuredCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(6);
      
      if (error) {
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as Category[];
    }
  });
  
  if (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container px-4">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
          {t('home.categories')}
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categories?.map((category) => (
              <Link to={`/category/${category.slug}`} key={category.id}>
                <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={i18n.language === 'ar' ? category.name_ar : category.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <h3 className="text-white font-medium text-lg">
                        {i18n.language === 'ar' ? category.name_ar : category.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-8 md:mt-12 text-center">
          <Link 
            to="/categories" 
            className="inline-flex items-center justify-center h-10 px-6 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {t('common.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
