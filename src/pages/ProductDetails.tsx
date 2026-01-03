import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/types';
import { ArrowLeft, MapPin, Calendar, Package, Phone, MessageCircle, User } from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();

  const product = getProductById(id || '');

  if (!product) {
    return (
      <AppLayout showNav={false}>
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <h1 className="mb-2 text-xl font-bold text-foreground">Product Not Found</h1>
          <p className="mb-6 text-muted-foreground">This product may have been removed</p>
          <Button onClick={() => navigate('/home')}>
            Go to Home
          </Button>
        </div>
      </AppLayout>
    );
  }

  const categoryInfo = CATEGORIES[product.category];
  const whatsappUrl = `https://wa.me/${product.sellerPhone.replace(/[^0-9]/g, '')}?text=Hi! I'm interested in your listing "${product.name}" on DalagHub.`;
  const phoneUrl = `tel:${product.sellerPhone}`;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AppLayout showNav={false}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-background/95 px-4 py-4 backdrop-blur-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 truncate text-lg font-semibold text-foreground">
          Product Details
        </h1>
      </header>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            {categoryInfo.icon} {product.subcategory}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Title & Price */}
        <h2 className="mb-2 text-2xl font-bold text-foreground">{product.name}</h2>
        {product.price && (
          <p className="mb-4 text-xl font-bold text-accent">{product.price}</p>
        )}

        {/* Details */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Package className="h-5 w-5 text-primary" />
            <span>Quantity: {product.quantity}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Posted {formatDate(product.createdAt)}</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-6">
            <h3 className="mb-2 font-semibold text-foreground">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
        )}

        {/* Seller Info */}
        <div className="mb-6 rounded-xl bg-card p-4 shadow-card">
          <h3 className="mb-3 font-semibold text-foreground">Seller Information</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{product.sellerName}</p>
              <p className="text-sm text-muted-foreground">{product.sellerPhone}</p>
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="space-y-3">
          <Button
            asChild
            variant="whatsapp"
            size="lg"
            className="w-full"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Contact on WhatsApp
            </a>
          </Button>

          <Button
            asChild
            variant="call"
            size="lg"
            className="w-full"
          >
            <a href={phoneUrl}>
              <Phone className="h-5 w-5" />
              Call Seller
            </a>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
