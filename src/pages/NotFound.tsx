import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 text-7xl">🌾</div>
      <h1 className="mb-2 text-3xl font-bold text-foreground">Page Not Found</h1>
      <p className="mb-8 max-w-sm text-muted-foreground">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Link>
        </Button>
        <Button asChild>
          <Link to="/home">
            <Home className="h-5 w-5" />
            Browse Products
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
