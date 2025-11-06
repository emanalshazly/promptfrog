'use client';

import { useState } from 'react';
import { categories } from '@/data/prompts';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home, Star, Clock, FolderOpen, Settings,
  ChevronRight
} from 'lucide-react';

export function Sidebar() {
  const {
    selectedCategory,
    setSelectedCategory,
    setSelectedSubcategory,
    folders,
    favorites,
  } = useStore();

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    if (!expandedCategories.includes(categoryId)) {
      toggleCategory(categoryId);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
  };

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          🐸 Promptfrog
        </h1>
        <p className="text-xs text-muted-foreground mt-1">مكتبة Prompts احترافية</p>
      </div>

      {/* Main Navigation */}
      <div className="p-3 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
          }}
        >
          <Home className="w-4 h-4 mr-2" />
          الرئيسية
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setSelectedCategory('favorites')}
        >
          <Star className="w-4 h-4 mr-2" />
          المفضلة
          <span className="mr-auto text-xs text-muted-foreground">
            {favorites.length}
          </span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setSelectedCategory('history')}
        >
          <Clock className="w-4 h-4 mr-2" />
          السجل
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setSelectedCategory('folders')}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          المجلدات
          <span className="mr-auto text-xs text-muted-foreground">
            {folders.length}
          </span>
        </Button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
          التصنيفات
        </div>
        {categories.map((category) => (
          <div key={category.id}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                selectedCategory === category.id && "bg-accent"
              )}
              onClick={() => handleCategoryClick(category.id)}
            >
              <ChevronRight
                className={cn(
                  "w-4 h-4 mr-2 transition-transform",
                  expandedCategories.includes(category.id) && "rotate-90"
                )}
              />
              <span className="mr-2">{category.icon}</span>
              <span className="text-sm">{category.name}</span>
            </Button>

            {expandedCategories.includes(category.id) && (
              <div className="mr-6 mt-1 space-y-1">
                {category.subcategories.map((sub) => (
                  <Button
                    key={sub.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => handleSubcategoryClick(category.id, sub.id)}
                  >
                    {sub.name}
                    <span className="mr-auto text-muted-foreground">
                      {sub.count}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-border">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          الإعدادات
        </Button>
      </div>
    </div>
  );
}
