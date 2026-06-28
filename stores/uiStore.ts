import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  currentWorkspace: string;
  currentEnvironment: 'development' | 'staging' | 'production';
  theme: 'dark' | 'light';
  toggleSidebar: () => void;
  setWorkspace: (workspace: string) => void;
  setEnvironment: (env: 'development' | 'staging' | 'production') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      currentWorkspace: 'workspace-1',
      currentEnvironment: 'production',
      theme: 'dark',
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      setEnvironment: (env) => set({ currentEnvironment: env }),
      setTheme: (theme) => {
        // Update HTML class
        if (typeof window !== 'undefined') {
          const html = document.documentElement;
          html.classList.remove('light', 'dark');
          html.classList.add(theme);
        }
        set({ theme });
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update HTML class
        if (typeof window !== 'undefined') {
          const html = document.documentElement;
          html.classList.remove('light', 'dark');
          html.classList.add(newTheme);
        }
        
        set({ theme: newTheme });
      },
    }),
    {
      name: 'tadpole-ui',
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydration
        if (state && typeof window !== 'undefined') {
          const html = document.documentElement;
          html.classList.remove('light', 'dark');
          html.classList.add(state.theme);
        }
      },
    }
  )
);
