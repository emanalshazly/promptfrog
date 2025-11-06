export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  subcategory: string;
  tags: string[];
  aiTool: 'ChatGPT' | 'Claude' | 'Midjourney' | 'Stable Diffusion' | 'Universal';
  example?: string;
  expectedOutput?: string;
  rating: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  count: number;
}

export interface Folder {
  id: string;
  name: string;
  promptIds: string[];
  createdAt: string;
}

export interface PromptVariable {
  name: string;
  value: string;
  description?: string;
}
