
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedInput } from '@/components/common/EnhancedInput';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Filter, Search, X, RotateCcw } from 'lucide-react';

interface FilterModalProps {
  trigger?: React.ReactNode;
  onFiltersApply?: (filters: any) => void;
  initialFilters?: any;
  filterType?: 'legal' | 'procedure' | 'general';
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterModal({ 
  trigger, 
  onFiltersApply, 
  initialFilters = {}, 
  filterType = 'general',
  isOpen = false,
  onClose
}: FilterModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    status: '',
    dateRange: '',
    tags: [],
    ...initialFilters
  });

  // Sync external isOpen prop with internal state
  useEffect(() => {
    if (isOpen !== undefined) {
      setInternalIsOpen(isOpen);
    }
  }, [isOpen]);

  const categories = [
    { value: 'legal', label: 'Textes juridiques' },
    { value: 'procedure', label: 'Procédures' },
    { value: 'forms', label: 'Formulaires' },
    { value: 'templates', label: 'Modèles' }
  ];

  const statuses = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'pending', label: 'En attente' },
    { value: 'archived', label: 'Archivé' }
  ];

  const availableTags = [
    'Urgent', 'Important', 'Brouillon', 'Validé', 'En cours', 'Terminé'
  ];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleApplyFilters = () => {
    onFiltersApply?.(filters);
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      status: '',
      dateRange: '',
      tags: []
    });
  };

  const handleOpenChange = (open: boolean) => {
    setInternalIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== '';
    }).length;
  };

  const modalContent = (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtres avancés
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Terme de recherche */}
        <div>
          <Label htmlFor="search-term">Terme de recherche</Label>
          <EnhancedInput
            id="search-term"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            placeholder="Rechercher dans le contenu..."
            context="search"
            enableVoice={true}
          />
        </div>

        {/* Catégorie */}
        <div>
          <Label>Catégorie</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les catégories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Statut */}
        <div>
          <Label>Statut</Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Période */}
        <div>
          <Label htmlFor="date-range">Période</Label>
          <EnhancedInput
            id="date-range"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            placeholder="Ex: Derniers 30 jours, 2024..."
            context="general"
            enableVoice={true}
          />
        </div>

        {/* Tags */}
        <div>
          <Label>Étiquettes</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableTags.map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={filters.tags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <Label htmlFor={`tag-${tag}`} className="text-sm">
                  {tag}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Filtres actifs */}
        {getActiveFiltersCount() > 0 && (
          <div>
            <Label>Filtres actifs</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleFilterChange(key, Array.isArray(value) ? [] : '')}
                    />
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleApplyFilters} className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Appliquer les filtres
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  // If using external control (isOpen/onClose), render without trigger
  if (isOpen !== undefined && onClose) {
    return (
      <Dialog open={internalIsOpen} onOpenChange={handleOpenChange}>
        {modalContent}
      </Dialog>
    );
  }

  // Default trigger-based usage
  return (
    <Dialog open={internalIsOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtres
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      {modalContent}
    </Dialog>
  );
}
