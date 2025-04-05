
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 arabesque-pattern opacity-10" />
      
      <div className="container relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`text-center lg:text-${isRTL ? 'right' : 'left'} animate-fade-in`}>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-muted-foreground">
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
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1596025959570-be1f91c9ebba?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Elegant Arabic-inspired home decor items" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-2/3 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1596025959428-0bd5c6a5454c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Traditional Arabic pottery" 
                className="w-full h-full object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
