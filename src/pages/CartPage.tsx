
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const CartPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const { cartItems, removeFromCart, updateCartItemQuantity, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to auth page
    if (!user && !cartLoading) {
      toast({
        title: t('common.authRequired'),
        description: t('cart.loginToView'),
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, cartLoading, navigate, toast, t]);

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast({
      title: t('cart.itemRemoved'),
      description: t('cart.itemRemovedDesc')
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartItemQuantity(id, quantity);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Shipping cost calculation (simplified for example)
  const shippingCost = cartItems.length > 0 ? 10 : 0;
  
  // Tax calculation (simplified for example)
  const taxRate = 0.05; // 5% tax
  const taxAmount = calculateSubtotal() * taxRate;
  
  // Total calculation
  const totalAmount = calculateSubtotal() + shippingCost + taxAmount;

  if (cartLoading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t('common.cart')}</h1>
      
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-4 text-left">{t('product.product')}</th>
                      <th className="p-4 text-center">{t('product.price')}</th>
                      <th className="p-4 text-center">{t('product.quantity')}</th>
                      <th className="p-4 text-right">{t('product.total')}</th>
                      <th className="p-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={isRTL && item.name_ar ? item.name_ar : item.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-muted">
                                  <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {isRTL && item.name_ar ? item.name_ar : item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground md:hidden">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center hidden md:table-cell">
                          <span>${item.price.toFixed(2)}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button 
                              className="h-8 w-8 flex items-center justify-center rounded border"
                              onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button 
                              className="h-8 w-8 flex items-center justify-center rounded border"
                              onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleRemoveItem(item.product_id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={t('cart.remove')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-between gap-4">
              <Button variant="outline" asChild>
                <Link to="/products">
                  {t('cart.continueShopping')}
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">{t('cart.orderSummary')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span className="font-medium">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.tax')}</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>{t('cart.total')}</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full" size="lg" asChild>
                <Link to="/checkout" className="flex items-center justify-center gap-2">
                  {t('cart.proceedToCheckout')}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-medium mb-4">{t('cart.empty')}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t('cart.emptyMessage')}
          </p>
          <Button asChild>
            <Link to="/products">{t('cart.startShopping')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
