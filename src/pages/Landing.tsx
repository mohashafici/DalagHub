import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, ShoppingCart, ArrowRight, Users, Phone, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-farm.jpg';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Desktop Header - only visible on larger screens */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">DalagHub</span>
        </div>
        <nav className="flex items-center gap-8">
          <Link to="/home" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Marketplace
          </Link>
          <Link to="/add-product" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Sell Products
          </Link>
          <Button asChild size="sm">
            <Link to="/auth">Get Started</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen lg:min-h-[90vh] flex-col items-center justify-center overflow-hidden lg:pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Somali farmland at sunrise"
            className="h-full w-full object-cover"
          />
          <div className="gradient-overlay absolute inset-0" />
        </div>

        {/* Content - centered on mobile, left-aligned on desktop */}
        <div className="relative z-10 flex w-full max-w-7xl flex-col items-center px-6 text-center lg:items-start lg:px-16 lg:text-left">
          {/* Logo - mobile only */}
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl lg:max-w-2xl">
            DalagHub
          </h1>

          <p className="mb-8 max-w-md text-lg text-primary-foreground/90 md:text-xl lg:text-2xl lg:max-w-xl">
            Connecting Farmers and Buyers Across Somalia
          </p>

          {/* CTA Buttons */}
          <div className="flex w-full max-w-sm flex-col gap-3 lg:flex-row lg:max-w-lg">
            <Button asChild variant="hero" size="lg" className="w-full lg:w-auto lg:px-8">
              <Link to="/home">
                <ShoppingCart className="h-5 w-5" />
                Browse Products
                <ArrowRight className="ml-auto h-5 w-5 lg:ml-2" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full lg:w-auto lg:px-8 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              <Link to="/add-product">
                <Sprout className="h-5 w-5" />
                Sell Your Product
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground lg:text-4xl">
            Why DalagHub?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground lg:text-lg">
            The easiest way to buy and sell agricultural products in Somalia
          </p>

          {/* Grid layout for features */}
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Sprout className="h-6 w-6 text-primary" />}
              title="For Farmers"
              description="List your crops and livestock easily. Reach buyers across Somalia with just a few taps."
            />
            <FeatureCard
              icon={<Phone className="h-6 w-6 text-primary" />}
              title="Direct Contact"
              description="Connect with sellers via WhatsApp or phone call instantly. No middlemen required."
            />
            <FeatureCard
              icon={<MapPin className="h-6 w-6 text-primary" />}
              title="Local Markets"
              description="Find products near you. Filter by location, category, and price to find exactly what you need."
            />
          </div>

          {/* Stats section - desktop only */}
          <div className="mt-16 hidden lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">10+</div>
              <div className="mt-2 text-muted-foreground">Regions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="mt-2 text-muted-foreground">Active Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">9</div>
              <div className="mt-2 text-muted-foreground">Product Categories</div>
            </div>
          </div>

          <div className="mt-12 text-center lg:mt-16">
            <Button asChild variant="default" size="lg" className="lg:px-12">
              <Link to="/auth">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - visible on desktop */}
      <footer className="hidden lg:block border-t border-border bg-muted/30 px-8 py-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sprout className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">DalagHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 DalagHub. Connecting farmers and buyers across Somalia.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 lg:p-8">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
