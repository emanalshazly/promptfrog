'use client';

import { useState, useEffect } from 'react';
import { Prompt, PromptVariable } from '@/lib/types';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy, Star, X, Sparkles, TrendingUp, Clock,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptEditorProps {
  prompt: Prompt;
  onClose: () => void;
}

export function PromptEditor({ prompt, onClose }: PromptEditorProps) {
  const { addFavorite, removeFavorite, isFavorite, addToHistory, incrementUsage } = useStore();
  const [variables, setVariables] = useState<PromptVariable[]>([]);
  const [processedContent, setProcessedContent] = useState('');
  const [copied, setCopied] = useState(false);

  const isLiked = isFavorite(prompt.id);

  useEffect(() => {
    // Extract variables from prompt content
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = Array.from(prompt.content.matchAll(regex));
    const uniqueVars = Array.from(new Set(matches.map((m) => m[1])));

    const vars: PromptVariable[] = uniqueVars.map((name) => ({
      name,
      value: '',
      description: `أدخل قيمة ${name}`,
    }));

    setVariables(vars);
    setProcessedContent(prompt.content);
  }, [prompt]);

  useEffect(() => {
    // Update processed content when variables change
    let content = prompt.content;
    variables.forEach((v) => {
      if (v.value) {
        content = content.replace(new RegExp(`\\{\\{${v.name}\\}\\}`, 'g'), v.value);
      }
    });
    setProcessedContent(content);
  }, [variables, prompt]);

  const handleVariableChange = (name: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.name === name ? { ...v, value } : v))
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(processedContent);
    setCopied(true);
    addToHistory(prompt.id);
    incrementUsage(prompt.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    if (isLiked) {
      removeFavorite(prompt.id);
    } else {
      addFavorite(prompt.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl">{prompt.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {prompt.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge>{prompt.aiTool}</Badge>
                <Badge variant="secondary">{prompt.category}</Badge>
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
              >
                <Star
                  className={cn(
                    "w-5 h-5",
                    isLiked && "fill-yellow-400 text-yellow-400"
                  )}
                />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{prompt.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{prompt.usageCount} استخدام</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(prompt.createdAt).toLocaleDateString('ar')}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="editor" className="flex-1">
                المحرر
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">
                المعاينة
              </TabsTrigger>
              <TabsTrigger value="examples" className="flex-1">
                أمثلة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4 mt-4">
              {variables.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    المتغيرات
                  </h3>
                  {variables.map((variable) => (
                    <div key={variable.name} className="space-y-1">
                      <label className="text-sm font-medium">
                        {variable.name}
                      </label>
                      <Input
                        placeholder={variable.description}
                        value={variable.value}
                        onChange={(e) =>
                          handleVariableChange(variable.name, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">المحتوى</label>
                <Textarea
                  value={processedContent}
                  onChange={(e) => setProcessedContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  dir="ltr"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="prose dark:prose-invert max-w-none">
                <div className="p-4 rounded-lg bg-muted">
                  <pre className="whitespace-pre-wrap text-sm" dir="ltr">
                    {processedContent}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="mt-4 space-y-4">
              {prompt.example && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">مثال الاستخدام:</h4>
                  <div className="p-4 rounded-lg bg-muted text-sm">
                    {prompt.example}
                  </div>
                </div>
              )}
              {prompt.expectedOutput && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">النتيجة المتوقعة:</h4>
                  <div className="p-4 rounded-lg bg-muted text-sm">
                    {prompt.expectedOutput}
                  </div>
                </div>
              )}
              {!prompt.example && !prompt.expectedOutput && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  لا توجد أمثلة متاحة لهذا الـprompt
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="border-t">
          <Button
            onClick={handleCopy}
            className="w-full"
            size="lg"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                تم النسخ!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                نسخ الـPrompt
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
