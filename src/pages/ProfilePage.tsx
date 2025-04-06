
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Heart, 
  HistoryIcon, 
  Home, 
  Loader2,
  LogOut, 
  Package, 
  Settings, 
  Settings2, 
  ShieldCheck, 
  User 
} from 'lucide-react';

// Profile schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  firstName_ar: z.string().optional(),
  lastName_ar: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  first_name_ar: string | null;
  last_name_ar: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: any | null;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      firstName_ar: '',
      lastName_ar: '',
      phone: '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Profile;
    },
    enabled: !!user
  });

  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, status, total')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Order[];
    },
    enabled: !!user
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        firstName_ar: profile.first_name_ar || '',
        lastName_ar: profile.last_name_ar || '',
        phone: profile.phone || '',
      });
    }
  }, [profile, profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          first_name_ar: data.firstName_ar,
          last_name_ar: data.lastName_ar,
          phone: data.phone,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refetchProfile();
      
      toast({
        title: t('profile.updateSuccess'),
        description: t('profile.updateSuccessMessage')
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      passwordForm.reset();
      
      toast({
        title: t('profile.passwordUpdated'),
        description: t('profile.passwordUpdatedMessage')
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update password',
        variant: 'destructive'
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-500 text-white">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (!user) {
    return (
      <div className="container py-12">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">{t('profile.notLoggedIn')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {t('profile.notLoggedInMessage')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/auth">{t('profile.signInButton')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth?signup=true">{t('profile.createAccountButton')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6 text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="text-xl">
                    {getInitials(profile?.first_name, profile?.last_name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}` 
                    : user.email}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              </div>

              <div className="space-y-1">
                <Button
                  variant={activeTab === 'profile' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  {t('profile.accountDetails')}
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('orders')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  {t('profile.myOrders')}
                </Button>
                <Button
                  variant={activeTab === 'addresses' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('addresses')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  {t('profile.addresses')}
                </Button>
                <Button
                  variant={activeTab === 'wishlist' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('wishlist')}
                  asChild
                >
                  <Link to="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    {t('profile.wishlist')}
                  </Link>
                </Button>
                <Button
                  variant={activeTab === 'security' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('security')}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {t('profile.passwordSecurity')}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('common.signOut')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:w-3/4">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.personalInfo')}</CardTitle>
                <CardDescription>
                  {t('profile.updateProfileDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('checkout.firstName')} (English)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('checkout.lastName')} (English)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName_ar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('checkout.firstName')} (العربية)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="lastName_ar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('checkout.lastName')} (العربية)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
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
                    </div>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.saving')}
                        </>
                      ) : (
                        t('profile.updateProfile')
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.orderHistory')}</CardTitle>
                <CardDescription>
                  {t('profile.viewYourOrderHistory')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">{t('profile.orderId')}</th>
                          <th className="text-left py-3 px-2">{t('profile.orderDate')}</th>
                          <th className="text-left py-3 px-2">{t('profile.orderStatus')}</th>
                          <th className="text-left py-3 px-2">{t('profile.orderAmount')}</th>
                          <th className="text-right py-3 px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-3 px-2 font-mono text-sm">
                              #{order.id.substring(0, 8)}
                            </td>
                            <td className="py-3 px-2">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="py-3 px-2">
                              {getOrderStatusBadge(order.status)}
                            </td>
                            <td className="py-3 px-2 font-medium">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Button variant="ghost" size="sm">
                                {t('profile.viewOrder')}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                      <HistoryIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-2">{t('profile.noOrders')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('profile.noOrdersMessage')}
                    </p>
                    <Button asChild>
                      <Link to="/products">{t('cart.startShopping')}</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'addresses' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.addresses')}</CardTitle>
                <CardDescription>
                  {t('profile.manageAddresses')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Home className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">{t('profile.noAddresses')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('profile.addAddressMessage')}
                  </p>
                  <Button>
                    {t('profile.addAddress')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.passwordSecurity')}</CardTitle>
                <CardDescription>
                  {t('profile.updatePasswordDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.currentPassword')}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.newPassword')}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.confirmPassword')}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.updating')}
                        </>
                      ) : (
                        t('profile.changePassword')
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
