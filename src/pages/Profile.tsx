import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { User, MapPin, Phone, LogOut, ChevronRight, Plus, Settings } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getProductsByUser } = useProducts();

  const myListings = user ? getProductsByUser(user.id) : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
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
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="mb-1 text-xl font-bold text-foreground">{user.name}</h1>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{user.location}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{user.phone}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4">
        <Button asChild variant="default" size="lg" className="w-full">
          <Link to="/add-product">
            <Plus className="h-5 w-5" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* My Listings */}
      <section className="px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">My Listings</h2>
          <span className="text-sm text-muted-foreground">
            {myListings.length} product{myListings.length !== 1 ? 's' : ''}
          </span>
        </div>

        {myListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {myListings.map((product) => (
              <ProductCard key={product.id} product={product} />
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
