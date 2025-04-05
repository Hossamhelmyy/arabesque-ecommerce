
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

type Category = {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  slug: string;
};

const FeaturedCategories = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  
  // Mock categories data (will be replaced with data from Supabase)
  const categories: Category[] = [
    {
      id: '1',
      name: 'Jewelry',
      nameAr: 'مجوهرات',
      image: 'https://images.unsplash.com/photo-1600949864238-2c76a535f70d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'jewelry'
    },
    {
      id: '2',
      name: 'Textiles',
      nameAr: 'منسوجات',
      image: 'https://images.unsplash.com/photo-1588350100803-01aad7a517c7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'textiles'
    },
    {
      id: '3',
      name: 'Ceramics',
      nameAr: 'سيراميك',
      image: 'https://images.unsplash.com/photo-1605883705077-8d3d848f69a4?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'ceramics'
    },
    {
      id: '4',
      name: 'Spices',
      nameAr: 'توابل',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'spices'
    },
    {
      id: '5',
      name: 'Home Decor',
      nameAr: 'ديكور المنزل',
      image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'home-decor'
    },
    {
      id: '6',
      name: 'Perfumes',
      nameAr: 'عطور',
      image: 'https://images.unsplash.com/photo-1618330896236-8ae55f8c18ab?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'perfumes'
    }
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center">
          {t('home.categories')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link to={`/category/${category.slug}`} key={category.id}>
              <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={i18n.language === 'ar' ? category.nameAr : category.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <h3 className="text-white font-medium text-lg">
                      {i18n.language === 'ar' ? category.nameAr : category.name}
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
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
