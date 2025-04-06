
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
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, isRTL } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useIsMobile();
  
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

        {!isMobile && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  {t('common.home')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-2">
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/">{t('common.home')}</Link>
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>{t('common.products')}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <div className="relative aspect-square overflow-hidden rounded-md">
                        <img
                          src="https://images.unsplash.com/photo-1596025959570-be1f91c9ebba"
                          alt="Featured product"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button variant="ghost" asChild className="justify-start h-auto py-2 px-3">
                        <Link
                          to="/products"
                          className={cn(
                            "block select-none space-y-1 rounded-md leading-none no-underline outline-none"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{t('home.featured')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Discover our featured products
                          </p>
                        </Link>
                      </Button>
                      
                      <Button variant="ghost" asChild className="justify-start h-auto py-2 px-3">
                        <Link
                          to="/products?filter=new"
                          className={cn(
                            "block select-none space-y-1 rounded-md leading-none no-underline outline-none"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{t('home.newArrivals')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Our latest additions
                          </p>
                        </Link>
                      </Button>
                      
                      <Button variant="ghost" asChild className="justify-start h-auto py-2 px-3">
                        <Link
                          to="/products?filter=sale"
                          className={cn(
                            "block select-none space-y-1 rounded-md leading-none no-underline outline-none"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{t('home.sale')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Limited time offers
                          </p>
                        </Link>
                      </Button>
                      
                      <Button variant="ghost" asChild className="justify-start h-auto py-2 px-3">
                        <Link
                          to="/products?filter=trending"
                          className={cn(
                            "block select-none space-y-1 rounded-md leading-none no-underline outline-none"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{t('home.trending')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Popular right now
                          </p>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  {t('common.categories')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-2">
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/categories">{t('common.categories')}</Link>
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex relative mx-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-2.5" />
            <Input 
              type="search" 
              placeholder={t('common.search')} 
              className="w-[150px] md:w-[200px] pl-8 rtl:pl-3 rtl:pr-8" 
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
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

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:flex">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link to="/favorites" className="hidden sm:block">
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
