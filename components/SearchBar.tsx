'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="ابحث عن prompts..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pr-10 pl-10"
        />
        {localQuery && (
          <button
            onClick={() => setLocalQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      <Button variant="outline" size="icon">
        <Filter className="w-5 h-5" />
      </Button>
    </div>
  );
}
