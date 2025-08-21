import { create } from 'zustand';
import { RecipeState } from './types';
import { recipeApi } from '../services/api';

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  currentRecipe: null,
  isLoading: false,
  error: null,

  fetchRecipes: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await recipeApi.getAll(params);
      set({ recipes: response.data.items, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || '레시피를 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  fetchRecipeById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await recipeApi.getById(id);
      set({ currentRecipe: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || '레시피를 찾을 수 없습니다.',
        isLoading: false 
      });
    }
  },

  searchRecipes: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await recipeApi.search(query);
      set({ recipes: response.data.items, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || '검색에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));