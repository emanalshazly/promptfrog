'use client';

import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/Sidebar';
import { PromptCard } from '@/components/PromptCard';
import { PromptEditor } from '@/components/PromptEditor';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import Fuse from 'fuse.js';
import { Button } from '@/components/ui/button';
import { Download, Upload, Sparkles } from 'lucide-react';

export default function Home() {
  const {
    prompts,
    selectedPrompt,
    setSelectedPrompt,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    favorites,
    usageHistory,
    exportData,
    importData,
  } = useStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Configure Fuse.js for advanced search
  const fuse = useMemo(
    () =>
      new Fuse(prompts, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'description', weight: 1.5 },
          { name: 'content', weight: 1 },
          { name: 'tags', weight: 1.5 },
          { name: 'category', weight: 0.5 },
        ],
        threshold: 0.3,
        includeScore: true,
      }),
    [prompts]
  );

  // Filter prompts based on search and category
  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    // Search filter
    if (searchQuery) {
      const results = fuse.search(searchQuery);
      filtered = results.map((result) => result.item);
    }

    // Category filter
    if (selectedCategory === 'favorites') {
      filtered = filtered.filter((p) => favorites.includes(p.id));
    } else if (selectedCategory === 'history') {
      const recentIds = usageHistory.slice(0, 50).map((h) => h.promptId);
      filtered = prompts.filter((p) => recentIds.includes(p.id));
    } else if (selectedCategory && selectedCategory !== 'folders') {
      filtered = filtered.filter((p) => p.category === selectedCategory);

      if (selectedSubcategory) {
        filtered = filtered.filter((p) => p.subcategory === selectedSubcategory);
      }
    }

    return filtered;
  }, [prompts, searchQuery, selectedCategory, selectedSubcategory, favorites, usageHistory, fuse]);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptfrog-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          importData(data);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <SearchBar />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImport}
              >
                <Upload className="w-4 h-4 mr-2" />
                استيراد
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {selectedCategory === 'favorites'
                ? 'المفضلة'
                : selectedCategory === 'history'
                ? 'السجل'
                : selectedSubcategory
                ? prompts.find((p) => p.subcategory === selectedSubcategory)?.subcategory
                : selectedCategory
                ? prompts.find((p) => p.category === selectedCategory)?.category
                : 'جميع الـPrompts'}
            </h2>
            <p className="text-muted-foreground">
              {filteredPrompts.length} prompt متاح
            </p>
          </div>

          {/* Prompts Grid */}
          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onClick={() => setSelectedPrompt(prompt)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'جرب كلمات بحث مختلفة'
                  : 'اختر تصنيفاً من القائمة الجانبية'}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Prompt Editor Modal */}
      {selectedPrompt && (
        <PromptEditor
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
}
