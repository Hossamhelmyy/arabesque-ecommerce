
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CreditCard, CreditCardIcon, ShoppingBag, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  phone: z.string().min(5, 'Phone must be at least 5 characters'),
  sameAsBilling: z.boolean().default(true),
  paymentMethod: z.enum(['creditCard', 'paypal', 'applePay']),
  shippingMethod: z.enum(['standard', 'express']),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState('shipping'); // 'shipping', 'payment', 'confirmation'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      sameAsBilling: true,
      paymentMethod: 'creditCard',
      shippingMethod: 'standard',
    },
  });

  // Calculate order summary
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = form.watch('shippingMethod') === 'express' ? 15 : 5;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shippingCost + tax;

  const onSubmit = async (data: FormValues) => {
    if (step === 'shipping') {
      setStep('payment');
      return;
    }

    if (step === 'payment') {
      // Final submission
      setIsSubmitting(true);
      
      try {
        if (!user) {
          throw new Error('You must be logged in to complete checkout');
        }

        // Create an order in Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            total: total,
            status: 'pending',
            payment_method: data.paymentMethod,
            shipping_address: {
              firstName: data.firstName,
              lastName: data.lastName,
              addressLine1: data.addressLine1,
              addressLine2: data.addressLine2,
              city: data.city,
              state: data.state,
              postalCode: data.postalCode,
              country: data.country,
              phone: data.phone,
              shippingMethod: data.shippingMethod
            }
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Add order items
        const orderItems = cartItems.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Clear cart
        await clearCart();
        
        // Navigate to confirmation
        setStep('confirmation');
        
      } catch (error) {
        console.error('Checkout error:', error);
        toast({
          title: t('common.error'),
          description: error instanceof Error ? error.message : 'Failed to process your order',
          variant: 'destructive'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (cartItems.length === 0 && step !== 'confirmation') {
    return (
      <div className="container py-12">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">{t('cart.empty')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {t('cart.emptyMessage')}
          </p>
          <Button asChild>
            <Link to="/products">{t('cart.startShopping')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('checkout.orderSuccess')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('checkout.orderSuccessMessage')}
          </p>
          <Button asChild>
            <Link to="/">{t('checkout.returnToHome')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/cart" className="flex items-center gap-1">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t('cart.title')}
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{t('checkout.title')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 'shipping' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {t('checkout.shippingAddress')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('checkout.firstName')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('checkout.lastName')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.addressLine1')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.addressLine2')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('checkout.city')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('checkout.postalCode')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} />
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
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sameAsBilling"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {t('checkout.sameAsShipping')}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="font-medium">{t('checkout.shippingOptions')}</h3>
                      <FormField
                        control={form.control}
                        name="shippingMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2 space-y-0">
                                  <RadioGroupItem value="standard" id="standard" />
                                  <FormLabel htmlFor="standard" className="font-normal">
                                    {t('checkout.standardShipping')} - $5.00
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-2 space-y-0">
                                  <RadioGroupItem value="express" id="express" />
                                  <FormLabel htmlFor="express" className="font-normal">
                                    {t('checkout.expressShipping')} - $15.00
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="ml-auto">
                      {t('common.continue')}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCardIcon className="h-5 w-5" />
                      {t('checkout.paymentMethod')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Tabs 
                              defaultValue={field.value} 
                              onValueChange={field.onChange}
                              className="w-full"
                            >
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="creditCard">
                                  {t('checkout.creditCard')}
                                </TabsTrigger>
                                <TabsTrigger value="paypal">
                                  {t('checkout.paypal')}
                                </TabsTrigger>
                                <TabsTrigger value="applePay">
                                  {t('checkout.applePay')}
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="creditCard" className="pt-4">
                                <div className="space-y-3">
                                  <FormField
                                    control={form.control}
                                    name="cardNumber"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t('checkout.cardNumber')}</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="4242 4242 4242 4242" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="cardName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t('checkout.cardName')}</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="cardExpiry"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>{t('checkout.expiryDate')}</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="MM/YY" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="cardCvv"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>{t('checkout.cvv')}</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="123" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="paypal" className="pt-4">
                                <div className="flex items-center justify-center py-8 px-4 border rounded-md bg-muted/50">
                                  <p className="text-muted-foreground">PayPal integration will be available soon</p>
                                </div>
                              </TabsContent>
                              <TabsContent value="applePay" className="pt-4">
                                <div className="flex items-center justify-center py-8 px-4 border rounded-md bg-muted/50">
                                  <p className="text-muted-foreground">Apple Pay integration will be available soon</p>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => setStep('shipping')}>
                      {t('common.back')}
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
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
              )}
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('checkout.orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded overflow-hidden mr-2">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {t('product.quantity')}: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <p>{t('cart.subtotal')}</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>{t('cart.shipping')}</p>
                  <p>${shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>{t('cart.tax')}</p>
                  <p>${tax.toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <p>{t('cart.total')}</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
