'use client';

import { useState } from 'react';
import { Prompt, PromptVariable } from '@/lib/types';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy, Star, X, Sparkles, Clock,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptEditorProps {
  prompt: Prompt;
  onClose: () => void;
}

function extractVariables(content: string): PromptVariable[] {
  const matches = Array.from(content.matchAll(/\{\{([^}]+)\}\}/g));
  return Array.from(new Set(matches.map((match) => match[1]))).map((name) => ({
    name,
    value: '',
    description: `أدخل قيمة ${name}`,
  }));
}

function applyVariables(content: string, variables: PromptVariable[]): string {
  let processed = content;
  for (const variable of variables) {
    if (variable.value) {
      processed = processed.replace(new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g'), variable.value);
    }
  }
  return processed;
}

export function PromptEditor({ prompt, onClose }: PromptEditorProps) {
  const { addFavorite, removeFavorite, isFavorite, addToHistory } = useStore();
  const [variables, setVariables] = useState<PromptVariable[]>(() => extractVariables(prompt.content));
  const [processedContent, setProcessedContent] = useState(prompt.content);
  const [copied, setCopied] = useState(false);

  const isLiked = isFavorite(prompt.id);

  const handleVariableChange = (name: string, value: string) => {
    const nextVariables = variables.map((variable) =>
      variable.name === name ? { ...variable, value } : variable,
    );
    setVariables(nextVariables);
    setProcessedContent(applyVariables(prompt.content, nextVariables));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(processedContent);
    setCopied(true);
    addToHistory(prompt.id);
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
