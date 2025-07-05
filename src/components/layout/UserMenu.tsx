
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { ProfileModal } from '@/components/auth/ProfileModal';
import { User, Settings, LogOut, Shield, Briefcase, Users } from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { profile, userRoles, signOut, isAdmin, isJuriste } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const getInitials = () => {
    if (!profile?.first_name || !profile?.last_name) return 'U';
    return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || 'Utilisateur';
  };

  const getRoleIcon = () => {
    if (isAdmin()) return <Shield className="w-4 h-4" />;
    if (isJuriste()) return <Briefcase className="w-4 h-4" />;
    return <Users className="w-4 h-4" />;
  };

  const getRoleLabel = () => {
    if (isAdmin()) return 'Administrateur';
    if (isJuriste()) return 'Juriste';
    return 'Citoyen';
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || ''} alt={getDisplayName()} />
              <AvatarFallback className="bg-teal-100 text-teal-800">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
              <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
              <div className="flex items-center gap-1 mt-2">
                {getRoleIcon()}
                <span className="text-xs text-teal-600 font-medium">{getRoleLabel()}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal 
        open={profileModalOpen} 
        onOpenChange={setProfileModalOpen} 
      />
    </>
  );
};
