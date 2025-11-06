import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt, Folder } from '@/lib/types';
import { allPrompts } from '@/data/prompts';

interface PromptStore {
  prompts: Prompt[];
  favorites: string[];
  folders: Folder[];
  usageHistory: { promptId: string; timestamp: string }[];
  selectedPrompt: Prompt | null;
  searchQuery: string;
  selectedCategory: string | null;
  selectedSubcategory: string | null;

  // Actions
  setPrompts: (prompts: Prompt[]) => void;
  addFavorite: (promptId: string) => void;
  removeFavorite: (promptId: string) => void;
  isFavorite: (promptId: string) => boolean;

  addFolder: (folder: Folder) => void;
  deleteFolder: (folderId: string) => void;
  addPromptToFolder: (folderId: string, promptId: string) => void;
  removePromptFromFolder: (folderId: string, promptId: string) => void;

  addToHistory: (promptId: string) => void;
  incrementUsage: (promptId: string) => void;

  setSelectedPrompt: (prompt: Prompt | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubcategory: (subcategory: string | null) => void;

  exportData: () => string;
  importData: (data: string) => void;
}

export const useStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      prompts: allPrompts,
      favorites: [],
      folders: [],
      usageHistory: [],
      selectedPrompt: null,
      searchQuery: '',
      selectedCategory: null,
      selectedSubcategory: null,

      setPrompts: (prompts) => set({ prompts }),

      addFavorite: (promptId) =>
        set((state) => ({
          favorites: [...state.favorites, promptId],
        })),

      removeFavorite: (promptId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== promptId),
        })),

      isFavorite: (promptId) => get().favorites.includes(promptId),

      addFolder: (folder) =>
        set((state) => ({
          folders: [...state.folders, folder],
        })),

      deleteFolder: (folderId) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== folderId),
        })),

      addPromptToFolder: (folderId, promptId) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId
              ? { ...f, promptIds: [...f.promptIds, promptId] }
              : f
          ),
        })),

      removePromptFromFolder: (folderId, promptId) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId
              ? { ...f, promptIds: f.promptIds.filter((id) => id !== promptId) }
              : f
          ),
        })),

      addToHistory: (promptId) =>
        set((state) => ({
          usageHistory: [
            { promptId, timestamp: new Date().toISOString() },
            ...state.usageHistory,
          ].slice(0, 100), // Keep last 100
        })),

      incrementUsage: (promptId) =>
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === promptId ? { ...p, usageCount: p.usageCount + 1 } : p
          ),
        })),

      setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedSubcategory: (subcategory) => set({ selectedSubcategory: subcategory }),

      exportData: () => {
        const state = get();
        return JSON.stringify({
          favorites: state.favorites,
          folders: state.folders,
          customPrompts: state.prompts.filter((p) => parseInt(p.id) > 10000),
        });
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set((state) => ({
            favorites: [...state.favorites, ...(parsed.favorites || [])],
            folders: [...state.folders, ...(parsed.folders || [])],
            prompts: [...state.prompts, ...(parsed.customPrompts || [])],
          }));
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },
    }),
    {
      name: 'promptfrog-storage',
    }
  )
);
