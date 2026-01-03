import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { LOCATIONS } from '@/types';
import { Sprout, ArrowLeft, Mail, Lock, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

type AuthMode = 'login' | 'register';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });
  const [selectedRoles, setSelectedRoles] = useState<('buyer' | 'seller')[]>(['buyer']);

  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    try {
      emailSchema.parse(formData.email);
    } catch (e) {
      toast.error('Please enter a valid email address');
      return false;
    }

    try {
      passwordSchema.parse(formData.password);
    } catch (e) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (mode === 'register') {
      if (!formData.name.trim()) {
        toast.error('Please enter your name');
        return false;
      }
      if (!formData.location) {
        toast.error('Please select your location');
        return false;
      }
      if (selectedRoles.length === 0) {
        toast.error('Please select at least one role');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success('Welcome back!');
          navigate('/home');
        } else {
          toast.error(result.error || 'Login failed. Please try again.');
        }
      } else {
        const result = await register(
          formData.name, 
          formData.email, 
          formData.password, 
          formData.location,
          selectedRoles
        );
        if (result.success) {
          toast.success('Account created successfully!');
          navigate('/home');
        } else {
          if (result.error?.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(result.error || 'Registration failed. Please try again.');
          }
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleRole = (role: 'buyer' | 'seller') => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-4">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-8">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Sprout className="h-9 w-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {mode === 'login' 
              ? 'Sign in to continue to DalagHub' 
              : 'Join DalagHub today'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="pl-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                className="pl-12"
                minLength={6}
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="location">Your Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 pl-12 text-base transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    <option value="">Select your city</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>I want to</Label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 rounded-lg border border-input bg-background p-4 cursor-pointer hover:border-primary/50 transition-colors">
                    <Checkbox
                      checked={selectedRoles.includes('buyer')}
                      onCheckedChange={() => toggleRole('buyer')}
                    />
                    <div>
                      <p className="font-medium text-foreground">Buy Products</p>
                      <p className="text-sm text-muted-foreground">Browse and contact sellers</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-input bg-background p-4 cursor-pointer hover:border-primary/50 transition-colors">
                    <Checkbox
                      checked={selectedRoles.includes('seller')}
                      onCheckedChange={() => toggleRole('seller')}
                    />
                    <div>
                      <p className="font-medium text-foreground">Sell Products</p>
                      <p className="text-sm text-muted-foreground">List your crops and livestock</p>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="mt-1 font-semibold text-primary hover:underline"
          >
            {mode === 'login' ? 'Create one now' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
