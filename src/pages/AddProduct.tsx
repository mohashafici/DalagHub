import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { CATEGORIES, LOCATIONS } from '@/types';
import { ArrowLeft, Camera, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AddProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '' as 'crops' | 'livestock' | '',
    subcategory: '',
    quantity: '',
    price: '',
    location: user?.location || '',
    description: '',
  });

  const [images, setImages] = useState<string[]>([]);

  const updateForm = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Reset subcategory when category changes
      if (field === 'category') {
        updated.subcategory = '';
      }
      return updated;
    });
  };

  const handleImageUpload = () => {
    // For demo, add placeholder image
    if (images.length < 3) {
      setImages(prev => [...prev, '/placeholder.svg']);
      toast.success('Image added');
    } else {
      toast.error('Maximum 3 images allowed');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to add a product');
      navigate('/auth');
      return;
    }

    if (!formData.name || !formData.category || !formData.subcategory || !formData.quantity || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      addProduct({
        name: formData.name,
        category: formData.category as 'crops' | 'livestock',
        subcategory: formData.subcategory,
        quantity: formData.quantity,
        price: formData.price || 'Negotiable',
        location: formData.location,
        description: formData.description,
        images: images.length > 0 ? images : ['/placeholder.svg'],
        sellerId: user.id,
        sellerName: user.name,
        sellerPhone: user.phone,
      });

      toast.success('Product listed successfully!');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subcategories = formData.category
    ? CATEGORIES[formData.category].subcategories
    : [];

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
        <h1 className="text-lg font-semibold text-foreground">
          Add New Product
        </h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6">
        {/* Image Upload */}
        <div className="mb-6">
          <Label className="mb-2 block">Product Images (up to 3)</Label>
          <div className="flex gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative h-24 w-24 overflow-hidden rounded-xl bg-muted">
                <img src={img} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <button
                type="button"
                onClick={handleImageUpload}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Camera className="h-6 w-6" />
                <span className="text-xs">Add Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Fresh Maize Harvest"
            value={formData.name}
            onChange={(e) => updateForm('name', e.target.value)}
            className="mt-2"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => updateForm('category', e.target.value)}
            className="mt-2 flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          >
            <option value="">Select category</option>
            <option value="crops">{CATEGORIES.crops.icon} {CATEGORIES.crops.label}</option>
            <option value="livestock">{CATEGORIES.livestock.icon} {CATEGORIES.livestock.label}</option>
          </select>
        </div>

        {/* Subcategory */}
        {formData.category && (
          <div className="mb-4 animate-fade-in">
            <Label htmlFor="subcategory">Product Type *</Label>
            <select
              id="subcategory"
              value={formData.subcategory}
              onChange={(e) => updateForm('subcategory', e.target.value)}
              className="mt-2 flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="">Select type</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-4">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            placeholder="e.g., 500 kg or 25 heads"
            value={formData.quantity}
            onChange={(e) => updateForm('quantity', e.target.value)}
            className="mt-2"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <Label htmlFor="price">Price (optional)</Label>
          <Input
            id="price"
            placeholder="e.g., $3/kg or Negotiable"
            value={formData.price}
            onChange={(e) => updateForm('price', e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <Label htmlFor="location">Location *</Label>
          <select
            id="location"
            value={formData.location}
            onChange={(e) => updateForm('location', e.target.value)}
            className="mt-2 flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          >
            <option value="">Select location</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe your product..."
            value={formData.description}
            onChange={(e) => updateForm('description', e.target.value)}
            className="mt-2"
            rows={4}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5" />
          {isSubmitting ? 'Publishing...' : 'Publish Product'}
        </Button>
      </form>
    </AppLayout>
  );
}
