
import { useTranslation } from 'react-i18next';

const CartPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>
      <p className="text-muted-foreground">Cart page coming soon...</p>
    </div>
  );
};

export default CartPage;
