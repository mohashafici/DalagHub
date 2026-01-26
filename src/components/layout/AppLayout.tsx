import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop layout with sidebar */}
      {showNav && <DesktopSidebar />}
      <main className={`
        ${showNav ? 'pb-20 lg:pb-0 lg:ml-64' : ''}
      `}>
        {children}
      </main>
      {/* Mobile bottom nav */}
      {showNav && <BottomNav />}
    </div>
  );
}
