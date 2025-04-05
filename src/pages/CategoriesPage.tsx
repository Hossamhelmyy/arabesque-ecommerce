
import { useTranslation } from 'react-i18next';

const CategoriesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('categories.title')}</h1>
      <p className="text-muted-foreground">Categories page coming soon...</p>
    </div>
  );
};

export default CategoriesPage;
