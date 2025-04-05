
import { useTranslation } from 'react-i18next';

const ProductsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('products.title')}</h1>
      <p className="text-muted-foreground">Products page coming soon...</p>
    </div>
  );
};

export default ProductsPage;
