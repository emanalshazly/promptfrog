'use client';

import { Prompt } from '@/lib/types';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Copy, Eye, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
  onClick?: () => void;
}

export function PromptCard({ prompt, onClick }: PromptCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useStore();
  const isLiked = isFavorite(prompt.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      removeFavorite(prompt.id);
    } else {
      addFavorite(prompt.id);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    // TODO: Add toast notification
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{prompt.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {prompt.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleFavorite}
          >
            <Star
              className={cn(
                "w-4 h-4",
                isLiked && "fill-yellow-400 text-yellow-400"
              )}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{prompt.aiTool}</Badge>
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {prompt.content}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{prompt.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{prompt.usageCount}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4 mr-1" />
            نسخ
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
          >
            <Eye className="w-4 h-4 mr-1" />
            عرض
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
