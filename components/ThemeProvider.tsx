'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    // Apply theme on mount and when it changes
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    
    // Also update body classes for better styling
    document.body.className = theme === 'dark' 
      ? 'min-h-screen bg-slate-950 text-slate-100 antialiased'
      : 'min-h-screen bg-slate-50 text-slate-900 antialiased';
  }, [theme]);

  return <>{children}</>;
}
