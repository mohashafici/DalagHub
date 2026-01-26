import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, User, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/add-product', label: 'Sell Product', icon: PlusCircle },
  { path: '/profile', label: 'Profile', icon: User },
];

export function DesktopSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:border-r lg:border-border lg:bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Sprout className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">DalagHub</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © 2024 DalagHub
        </p>
      </div>
    </aside>
  );
}
