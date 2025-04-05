
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Hero = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 arabesque-pattern opacity-10" />
      
      <div className="container relative px-4 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className={`text-center lg:text-${isRTL ? 'right' : 'left'} animate-fade-in`}>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-foreground">
              {t('home.hero.title')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-muted-foreground max-w-xl mx-auto lg:mx-0">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="font-medium">
                <Link to="/products">
                  {t('home.hero.cta')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-medium">
                <Link to="/categories">
                  {t('common.categories')}
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative animate-scale-in">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <AspectRatio ratio={1/1}>
                <img 
                  src="https://images.unsplash.com/photo-1596025959570-be1f91c9ebba?q=80&w=800&auto=format&fit=crop" 
                  alt="Elegant Arabic-inspired home decor items" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </AspectRatio>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-2/3 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
              <AspectRatio ratio={16/9}>
                <img 
                  src="https://images.unsplash.com/photo-1596025959428-0bd5c6a5454c?q=80&w=800&auto=format&fit=crop" 
                  alt="Traditional Arabic pottery" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
