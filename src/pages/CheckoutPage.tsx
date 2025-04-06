
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Loader2, CreditCard, Banknote } from 'lucide-react';

// Define form schema
const checkoutFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(3, { message: "ZIP code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  paymentMethod: z.enum(["credit_card", "cash_on_delivery"]),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Initialize form with default values
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      paymentMethod: 'credit_card',
      notes: '',
    },
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!user && !isLoadingProfile) {
      toast({
        title: t('common.authRequired'),
        description: t('checkout.loginToCheckout'),
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, isLoadingProfile, navigate, toast, t]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUserProfile(data);
        
        // Pre-fill form with user data if available
        if (data) {
          const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim();
          const address = data.address ? (typeof data.address === 'string' ? data.address : data.address.street || '') : '';
          
          form.setValue('fullName', fullName || '');
          form.setValue('email', user.email || '');
          form.setValue('phone', data.phone || '');
          form.setValue('address', address);
          form.setValue('city', data.address?.city || '');
          form.setValue('state', data.address?.state || '');
          form.setValue('zipCode', data.address?.zipCode || '');
          form.setValue('country', data.address?.country || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user, form]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !isLoadingProfile) {
      toast({
        title: t('checkout.emptyCart'),
        description: t('checkout.addItemsToCart'),
      });
      navigate('/products');
    }
  }, [cartItems, isLoadingProfile, navigate, toast, t]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const shippingCost = cartItems.length > 0 ? 10 : 0;
  const taxRate = 0.05; // 5% tax
  const taxAmount = calculateSubtotal() * taxRate;
  const totalAmount = calculateSubtotal() + shippingCost + taxAmount;

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!user) {
      toast({
        title: t('common.authRequired'),
        description: t('checkout.loginToCheckout'),
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create address object
      const shippingAddress = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        street: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
      };

      // Store order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: totalAmount,
          shipping_address: shippingAddress,
          payment_method: values.paymentMethod,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update user profile with shipping information if not already present
      if (userProfile) {
        await supabase
          .from('profiles')
          .update({
            phone: values.phone || userProfile.phone,
            address: {
              ...userProfile.address,
              street: values.address,
              city: values.city,
              state: values.state,
              zipCode: values.zipCode,
              country: values.country
            }
          })
          .eq('id', user.id);
      }

      // Clear the cart
      await clearCart();

      // Show success message
      toast({
        title: t('checkout.orderSuccess'),
        description: t('checkout.orderConfirmation'),
      });

      // Redirect to a success page or order confirmation
      navigate('/profile');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: t('common.error'),
        description: t('checkout.orderError'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!user || cartItems.length === 0) {
    return null; // Handled by useEffect redirects
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t('checkout.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('checkout.shippingInfo')}</CardTitle>
              <CardDescription>{t('checkout.shippingDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.fullName')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('checkout.fullNamePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('checkout.emailPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.phone')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('checkout.phonePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.address')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('checkout.addressPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.city')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('checkout.cityPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.state')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('checkout.statePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.zipCode')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('checkout.zipCodePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.country')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('checkout.countryPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('checkout.paymentMethod')}</h3>
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-3"
                            >
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <RadioGroupItem value="credit_card" id="credit_card" />
                                <Label htmlFor="credit_card" className="flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                  {t('checkout.creditCard')}
                                </Label>
                              </div>
                              
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                                <Label htmlFor="cash_on_delivery" className="flex items-center">
                                  <Banknote className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                  {t('checkout.cashOnDelivery')}
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.notes')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t('checkout.notesPlaceholder')} 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="lg:hidden">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.processing')}
                        </>
                      ) : (
                        t('checkout.placeOrder')
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('checkout.orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">
                        {isRTL && item.name_ar ? item.name_ar : item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('product.quantity')}: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
                
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.shipping')}</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.tax')}</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="flex justify-between w-full pb-4 mb-4 border-b font-bold">
                <span>{t('cart.total')}</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <Button type="submit" className="w-full" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.processing')}
                  </>
                ) : (
                  t('checkout.placeOrder')
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
