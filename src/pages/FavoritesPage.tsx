
import { useTranslation } from 'react-i18next';

const FavoritesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('favorites.title')}</h1>
      <p className="text-muted-foreground">Favorites page coming soon...</p>
    </div>
  );
};

export default FavoritesPage;
