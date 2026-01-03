import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts, Product } from '@/contexts/ProductContext';
import { User, MapPin, Mail, LogOut, ChevronRight, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, roles, logout, isSeller } = useAuth();
  const { allUserProducts, deleteProduct, updateProductStatus, isLoading } = useProducts();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const myListings = allUserProducts;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setDeletingId(productId);
    const result = await deleteProduct(productId);
    
    if (result.success) {
      toast.success('Product deleted');
    } else {
      toast.error(result.error || 'Failed to delete product');
    }
    setDeletingId(null);
  };

  const handleToggleSold = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'sold' ? 'active' : 'sold';
    setUpdatingId(productId);
    const result = await updateProductStatus(productId, newStatus);
    
    if (result.success) {
      toast.success(newStatus === 'sold' ? 'Marked as sold' : 'Marked as active');
    } else {
      toast.error(result.error || 'Failed to update status');
    }
    setUpdatingId(null);
  };

  if (!user || !profile) {
    return (
      <AppLayout>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Not Signed In</h2>
          <p className="mb-6 text-muted-foreground">
            Sign in to manage your listings and profile
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background px-4 pb-6 pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="mb-1 text-xl font-bold text-foreground">{profile.name}</h1>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
          {profile.email && (
            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{profile.email}</span>
            </div>
          )}
          
          {/* Roles */}
          <div className="mt-3 flex gap-2">
            {roles.map(role => (
              <Badge key={role} variant={role === 'seller' ? 'default' : 'secondary'}>
                {role === 'seller' ? '🌾 Seller' : '🛒 Buyer'}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      {isSeller && (
        <div className="px-4 py-4">
          <Button asChild variant="default" size="lg" className="w-full">
            <Link to="/add-product">
              <Plus className="h-5 w-5" />
              Add New Product
            </Link>
          </Button>
        </div>
      )}

      {/* My Listings */}
      {isSeller && (
        <section className="px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">My Listings</h2>
            <span className="text-sm text-muted-foreground">
              {myListings.length} product{myListings.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : myListings.length > 0 ? (
            <div className="space-y-4">
              {myListings.map((product: Product) => (
                <div key={product.id} className="relative rounded-xl bg-card p-4 shadow-card">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img 
                        src={product.images[0] || '/placeholder.svg'} 
                        alt={product.title}
                        className={`h-20 w-20 rounded-lg object-cover ${product.status === 'sold' ? 'opacity-50' : ''}`}
                      />
                      {product.status === 'sold' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="rounded bg-muted/90 px-2 py-1 text-xs font-medium">SOLD</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">{product.subcategory}</p>
                      <p className="text-sm text-muted-foreground">{product.location}</p>
                      <p className="text-sm font-medium text-accent">{product.price}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleToggleSold(product.id, product.status)}
                        disabled={updatingId === product.id}
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
                          product.status === 'sold' 
                            ? 'bg-success/10 text-success hover:bg-success/20' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                        title={product.status === 'sold' ? 'Mark as active' : 'Mark as sold'}
                      >
                        {updatingId === product.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deletingId === product.id}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-50"
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-card py-12 text-center shadow-card">
              <div className="mb-3 text-4xl">📦</div>
              <h3 className="mb-1 font-semibold text-foreground">No Listings Yet</h3>
              <p className="text-sm text-muted-foreground">
                Start selling by adding your first product
              </p>
            </div>
          )}
        </section>
      )}

      {/* Settings */}
      <section className="px-4 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-xl bg-card p-4 shadow-card transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-3 text-destructive">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </section>
    </AppLayout>
  );
}
