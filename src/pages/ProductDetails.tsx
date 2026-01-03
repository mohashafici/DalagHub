import { useParams, useNavigate } from 'react-router-dom';
import { useProducts, Product, generateWhatsAppLink, generatePhoneLink } from '@/contexts/ProductContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/types';
import { ArrowLeft, MapPin, Calendar, Package, Phone, MessageCircle, User, Loader2, Flag, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, reportProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setIsLoading(false);
    };
    fetchProduct();
  }, [id, getProductById]);

  if (isLoading) {
    return (
      <AppLayout showNav={false}>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

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
  const sellerPhone = product.seller_phone || '';
  const whatsappUrl = sellerPhone ? generateWhatsAppLink(sellerPhone, product.title) : '';
  const phoneUrl = sellerPhone ? generatePhoneLink(sellerPhone) : '';
  const isSold = product.status === 'sold';

  const handleReport = async () => {
    if (!reportReason || !id) return;
    setIsReporting(true);
    const result = await reportProduct(id, reportReason, reportDescription);
    setIsReporting(false);
    if (result.success) {
      toast.success('Report submitted successfully');
      setReportOpen(false);
      setReportReason('');
      setReportDescription('');
    } else {
      toast.error(result.error || 'Failed to submit report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
          src={product.images[0] || '/placeholder.svg'}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            {categoryInfo.icon} {product.subcategory}
          </span>
          {isSold && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/90 px-3 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
              <CheckCircle className="h-4 w-4" /> Sold
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Title & Price */}
        <h2 className="mb-2 text-2xl font-bold text-foreground">{product.title}</h2>
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
            <span>Posted {formatDate(product.created_at)}</span>
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
              <p className="font-medium text-foreground">{product.seller_name}</p>
              {sellerPhone && (
                <p className="text-sm text-muted-foreground">{sellerPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        {!isSold && (
          <div className="space-y-3">
            {sellerPhone && (
              <>
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
              </>
            )}
          </div>
        )}

        {isSold && (
          <div className="rounded-xl bg-muted p-4 text-center">
            <p className="font-medium text-muted-foreground">This item has been sold</p>
          </div>
        )}

        {/* Report Button */}
        <div className="mt-6 flex justify-center">
          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Flag className="h-4 w-4" />
                Report this listing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Listing</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select value={reportReason} onValueChange={setReportReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spam">Spam or fake listing</SelectItem>
                      <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                      <SelectItem value="fraud">Suspected fraud</SelectItem>
                      <SelectItem value="duplicate">Duplicate listing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Additional details (optional)</Label>
                  <Textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Provide more details about your concern..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleReport}
                  disabled={!reportReason || isReporting}
                  className="w-full"
                >
                  {isReporting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
