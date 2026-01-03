import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { SearchBar } from '@/components/products/SearchBar';
import { useProducts } from '@/contexts/ProductContext';
import { LOCATIONS, CATEGORIES } from '@/types';
import { Filter, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const { products } = useProducts();

  const allSubcategories = [
    ...CATEGORIES.crops.subcategories,
    ...CATEGORIES.livestock.subcategories,
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !selectedLocation || product.location === selectedLocation;
      const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
      return matchesSearch && matchesLocation && matchesSubcategory;
    });
  }, [products, searchQuery, selectedLocation, selectedSubcategory]);

  const hasActiveFilters = selectedLocation || selectedSubcategory;

  const clearFilters = () => {
    setSelectedLocation('');
    setSelectedSubcategory('');
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 px-4 py-4 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search products..."
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'secondary'}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="relative shrink-0"
          >
            <Filter className="h-5 w-5" />
            {hasActiveFilters && (
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent" />
            )}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 animate-fade-in space-y-4 rounded-xl bg-card p-4 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  <X className="h-4 w-4" />
                  Clear all
                </button>
              )}
            </div>

            {/* Location Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                <MapPin className="mr-1 inline h-4 w-4" />
                Location
              </label>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(selectedLocation === loc ? '' : loc)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      selectedLocation === loc
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Product Type
              </label>
              <div className="flex flex-wrap gap-2">
                {allSubcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? '' : sub)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      selectedSubcategory === sub
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Results */}
      <section className="px-4 py-4">
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
