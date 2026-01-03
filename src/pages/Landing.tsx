import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, ShoppingCart, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-farm.jpg';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Somali farmland at sunrise"
            className="h-full w-full object-cover"
          />
          <div className="gradient-overlay absolute inset-0" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
            DalagHub
          </h1>

          <p className="mb-8 max-w-md text-lg text-primary-foreground/90 md:text-xl">
            Connecting Farmers and Buyers Across Somalia
          </p>

          {/* CTA Buttons */}
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Button asChild variant="hero" size="lg" className="w-full">
              <Link to="/home">
                <ShoppingCart className="h-5 w-5" />
                Browse Products
                <ArrowRight className="ml-auto h-5 w-5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              <Link to="/add-product">
                <Sprout className="h-5 w-5" />
                Sell Your Product
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background px-6 py-12">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            Why DalagHub?
          </h2>

          <div className="grid gap-4">
            <FeatureCard
              icon="🌾"
              title="For Farmers"
              description="List your crops and livestock easily. Reach buyers across Somalia."
            />
            <FeatureCard
              icon="🤝"
              title="Direct Contact"
              description="Connect with sellers via WhatsApp or phone call instantly."
            />
            <FeatureCard
              icon="📍"
              title="Local Markets"
              description="Find products near you. Filter by location and category."
            />
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="default" size="lg">
              <Link to="/auth">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-card p-4 shadow-card">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
        {icon}
      </div>
      <div>
        <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
