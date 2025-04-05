
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('product.details')}</h1>
      <p className="text-muted-foreground">Product detail page for {slug} coming soon...</p>
    </div>
  );
};

export default ProductDetailPage;
