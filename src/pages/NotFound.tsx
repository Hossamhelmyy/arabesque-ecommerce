
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 text-7xl font-bold text-primary">404</div>
      <h1 className="mb-4 text-3xl font-heading font-bold">
        {t('error.pageNotFound')}
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        {t('error.pageNotFoundDesc')}
      </p>
      <Button asChild size="lg">
        <Link to="/">
          {t('error.backToHome')}
        </Link>
      </Button>
      <div className="pattern-divider mt-12 w-full max-w-md" />
    </div>
  );
};

export default NotFound;
