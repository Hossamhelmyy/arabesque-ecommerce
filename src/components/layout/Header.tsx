
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Search, Menu, ShoppingCart, Heart, User, Sun, Moon, Globe 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, isRTL } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Mock cart count - will be replaced with actual count from cart context
  const cartCount = 3;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('common.menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "right" : "left"} className="w-[80vw] sm:w-[350px]">
              <nav className="flex flex-col gap-4 py-8">
                <Link to="/" className="px-2 py-1 text-lg font-medium">
                  {t('common.home')}
                </Link>
                <Link to="/products" className="px-2 py-1 text-lg font-medium">
                  {t('common.products')}
                </Link>
                <Link to="/categories" className="px-2 py-1 text-lg font-medium">
                  {t('common.categories')}
                </Link>
                <div className="pattern-divider" />
                <Link to="/signin" className="px-2 py-1 text-lg font-medium">
                  {t('common.signIn')}
                </Link>
                <Link to="/signup" className="px-2 py-1 text-lg font-medium">
                  {t('common.signUp')}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-2xl font-heading font-bold text-primary">
              {t('common.appName')}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          <Link to="/" className="text-foreground/70 hover:text-foreground">
            {t('common.home')}
          </Link>
          <Link to="/products" className="text-foreground/70 hover:text-foreground">
            {t('common.products')}
          </Link>
          <Link to="/categories" className="text-foreground/70 hover:text-foreground">
            {t('common.categories')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex relative mx-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-2.5" />
            <Input 
              type="search" 
              placeholder={t('common.search')} 
              className="w-[200px] pl-8 rtl:pl-3 rtl:pr-8" 
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('common.language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                <span className={currentLanguage === 'en' ? 'font-bold' : ''}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ar')}>
                <span className={currentLanguage === 'ar' ? 'font-bold' : ''}>العربية</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link to="/favorites">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">{t('common.favorites')}</span>
            </Button>
          </Link>

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">{t('common.cart')}</span>
              {cartCount > 0 && (
                <Badge 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">{t('common.profile')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
