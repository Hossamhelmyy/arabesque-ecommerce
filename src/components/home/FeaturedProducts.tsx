
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Product = {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  salePrice?: number;
  image: string;
  slug: string;
  isFeatured: boolean;
  isNew: boolean;
  isSale: boolean;
};

const FeaturedProducts = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  
  // Mock products data (will be replaced with data from Supabase)
  const products: Product[] = [
    {
      id: '1',
      name: 'Handcrafted Ceramic Vase',
      nameAr: 'مزهرية سيراميك يدوية',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'handcrafted-ceramic-vase',
      isFeatured: true,
      isNew: true,
      isSale: false
    },
    {
      id: '2',
      name: 'Moroccan Leather Pouf',
      nameAr: 'بوف جلد مغربي',
      price: 129.99,
      salePrice: 99.99,
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'moroccan-leather-pouf',
      isFeatured: true,
      isNew: false,
      isSale: true
    },
    {
      id: '3',
      name: 'Silver Filigree Earrings',
      nameAr: 'أقراط فضية فيليجرين',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'silver-filigree-earrings',
      isFeatured: true,
      isNew: false,
      isSale: false
    },
    {
      id: '4',
      name: 'Handwoven Berber Rug',
      nameAr: 'سجادة بربرية منسوجة يدويًا',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'handwoven-berber-rug',
      isFeatured: true,
      isNew: true,
      isSale: false
    },
    {
      id: '5',
      name: 'Amber & Oud Perfume',
      nameAr: 'عطر العنبر والعود',
      price: 79.99,
      salePrice: 64.99,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'amber-oud-perfume',
      isFeatured: true,
      isNew: false,
      isSale: true
    },
    {
      id: '6',
      name: 'Mosaic Table Lamp',
      nameAr: 'مصباح طاولة فسيفساء',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1560617544-b4f287789e24?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'mosaic-table-lamp',
      isFeatured: true,
      isNew: false,
      isSale: false
    },
    {
      id: '7',
      name: 'Embroidered Pillow Cover',
      nameAr: 'غطاء وسادة مطرز',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1579438272704-9eedd9a5b248?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'embroidered-pillow-cover',
      isFeatured: true,
      isNew: true,
      isSale: false
    },
    {
      id: '8',
      name: 'Organic Spice Set',
      nameAr: 'مجموعة توابل عضوية',
      price: 45.99,
      salePrice: 35.99,
      image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
      slug: 'organic-spice-set',
      isFeatured: true,
      isNew: false,
      isSale: true
    }
  ];

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center">
          {t('home.featured')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter(product => product.isFeatured).slice(0, 8).map((product) => (
            <Card key={product.id} className="product-card group">
              <div className="relative">
                <Link to={`/product/${product.slug}`}>
                  <img 
                    src={product.image} 
                    alt={i18n.language === 'ar' ? product.nameAr : product.name}
                    className="product-image"
                  />
                </Link>
                {product.isNew && (
                  <Badge className="product-badge" variant="default">
                    {t('product.new')}
                  </Badge>
                )}
                {product.isSale && (
                  <Badge className="product-badge" variant="destructive">
                    {t('product.sale')}
                  </Badge>
                )}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <Link to={`/product/${product.slug}`} className="block">
                  <h3 className="font-medium text-foreground line-clamp-2 min-h-[50px]">
                    {i18n.language === 'ar' ? product.nameAr : product.name}
                  </h3>
                </Link>
                <div className="flex items-center mt-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-destructive font-bold text-lg">
                        ${product.salePrice.toFixed(2)}
                      </span>
                      <span className="ml-2 rtl:mr-2 rtl:ml-0 text-muted-foreground line-through text-sm">
                        ${product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" size="sm">
                  <ShoppingCart className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                  {t('product.addToCart')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center h-10 px-6 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {t('common.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
