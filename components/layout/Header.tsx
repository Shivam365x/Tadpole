'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getIdenticon } from '@/lib/identicon';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentEnvironment, setEnvironment, theme, setTheme } = useUIStore();
  const [notificationCount] = useState(3);

  // Apply theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add(theme);
    }
  }, [theme]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm px-6">
      <div className="flex items-center justify-between h-full">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search services, deployments, incidents..."
              className="pl-10 bg-slate-800/50 border-slate-700 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Environment Selector */}
          <Select 
            value={currentEnvironment} 
            onValueChange={(value) => {
              if (value) setEnvironment(value as 'development' | 'staging' | 'production');
            }}
          >
            <SelectTrigger className="w-36 bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-400 hover:text-slate-200"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-400 hover:text-slate-200"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* Workspace Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="space-x-2">
                <div className="text-left">
                  <div className="text-sm font-medium">Acme Corp</div>
                  <div className="text-xs text-slate-400">Workspace</div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Acme Corp</DropdownMenuItem>
              <DropdownMenuItem>Personal</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create Workspace</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || getIdenticon(user?.email || user?.name)} alt={user?.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <div className="font-medium">{user?.name || 'User'}</div>
                  <div className="text-xs text-slate-400 font-normal">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/billing')}>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
