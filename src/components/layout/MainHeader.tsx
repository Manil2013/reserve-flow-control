
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { MessagesDropdown } from '@/components/MessagesDropdown';
import { LanguageSelector } from '@/components/LanguageSelector';
import { UserMenu } from './UserMenu';

interface MainHeaderProps {
  onMobileMenuToggle: () => void;
}

export function MainHeader({ onMobileMenuToggle }: MainHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ffa29c93-5539-40bf-b908-83fc3609ca61.png" 
              alt="Dalil.dz" 
              className="w-8 h-8"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">dalil.dz</h1>
              <p className="text-xs text-gray-500">République Algérienne Démocratique et Populaire</p>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Rechercher des textes, procédures..."
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <NotificationDropdown />
          <MessagesDropdown />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
