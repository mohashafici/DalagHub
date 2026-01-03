import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { Product } from '@/contexts/ProductContext';
import { CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const categoryInfo = CATEGORIES[product.category];
  const timeAgo = getTimeAgo(product.created_at);

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-2 top-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            {categoryInfo.icon} {product.subcategory}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="mb-1 line-clamp-1 text-base font-semibold text-foreground">
          {product.title}
        </h3>

        <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{product.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {product.quantity}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {product.price && (
          <div className="mt-2 text-base font-bold text-accent">
            {product.price}
          </div>
        )}
      </div>
    </Link>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}
