
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="container pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-foreground">
              {t('common.appName')}
            </h3>
            <p className="mb-4">
              Curating authentic treasures from around the world, delivered with care to your doorstep.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-foreground">
              {t('common.categories')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/jewelry" className="hover:text-primary transition-colors">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link to="/category/textiles" className="hover:text-primary transition-colors">
                  Textiles
                </Link>
              </li>
              <li>
                <Link to="/category/ceramics" className="hover:text-primary transition-colors">
                  Ceramics
                </Link>
              </li>
              <li>
                <Link to="/category/spices" className="hover:text-primary transition-colors">
                  Spices
                </Link>
              </li>
              <li>
                <Link to="/category/home-decor" className="hover:text-primary transition-colors">
                  Home Decor
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-foreground">
              {t('common.menu')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  {t('common.products')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-primary transition-colors">
                  {t('common.categories')}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary transition-colors">
                  {t('common.profile')}
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-primary transition-colors">
                  {t('common.signIn')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-foreground">
              {t('common.contact')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span>123 Market St, Suite 456<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>info@oasisbazaar.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pattern-divider my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p>
            &copy; {currentYear} {t('common.appName')}. {t('footer.allRightsReserved')}
          </p>
          <p className="mt-4 sm:mt-0 flex items-center">
            {t('footer.madeWith')} <Heart className="h-4 w-4 mx-1 text-destructive animate-pulse" /> {t('footer.forYou')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
