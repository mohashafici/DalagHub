import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useImageUpload } from '@/hooks/useImageUpload';
import { CATEGORIES, LOCATIONS } from '@/types';
import { ArrowLeft, Camera, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AddProductPage() {
  const navigate = useNavigate();
  const { user, profile, isSeller } = useAuth();
  const { addProduct } = useProducts();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '' as 'crops' | 'livestock' | '',
    subcategory: '',
    quantity: '',
    price: '',
    location: profile?.location || '',
    description: '',
  });

  const [images, setImages] = useState<string[]>([]);

  // Redirect non-sellers
  if (user && !isSeller) {
    return (
      <AppLayout showNav={false}>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 text-5xl">🚫</div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Seller Access Required</h2>
          <p className="mb-6 text-muted-foreground">
            You need to be a seller to add products. Update your profile to become a seller.
          </p>
          <Button onClick={() => navigate('/profile')}>
            Go to Profile
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <AppLayout showNav={false}>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 text-5xl">🔐</div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Sign In Required</h2>
          <p className="mb-6 text-muted-foreground">
            Please sign in to list your products
          </p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </AppLayout>
    );
  }

  const updateForm = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'category') {
        updated.subcategory = '';
      }
      return updated;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    const file = files[0];
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const url = await uploadImage(file);
    if (url) {
      setImages(prev => [...prev, url]);
      toast.success('Image uploaded');
    } else {
      toast.error('Failed to upload image');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.subcategory || !formData.quantity || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addProduct({
        title: formData.title,
        category: formData.category as 'crops' | 'livestock',
        subcategory: formData.subcategory,
        quantity: formData.quantity,
        price: formData.price || 'Negotiable',
        location: formData.location,
        description: formData.description,
        images: images.length > 0 ? images : ['/placeholder.svg'],
      });

      if (result.success) {
        toast.success('Product listed successfully!');
        navigate('/home');
      } else {
        toast.error(result.error || 'Failed to add product');
      }
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
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Camera className="h-6 w-6" />
                    <span className="text-xs">Add Photo</span>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Product Title */}
        <div className="mb-4">
          <Label htmlFor="title">Product Name *</Label>
          <Input
            id="title"
            placeholder="e.g., Fresh Maize Harvest"
            value={formData.title}
            onChange={(e) => updateForm('title', e.target.value)}
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
          disabled={isSubmitting || isUploading}
        >
          <Plus className="h-5 w-5" />
          {isSubmitting ? 'Publishing...' : 'Publish Product'}
        </Button>
      </form>
    </AppLayout>
  );
}
