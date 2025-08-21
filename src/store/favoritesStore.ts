import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FavoritesState } from './types';

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (recipe) => {
        set((state) => ({
          favorites: [...state.favorites, recipe]
        }));
      },

      removeFavorite: (recipeId) => {
        set((state) => ({
          favorites: state.favorites.filter((r) => r.id !== recipeId)
        }));
      },

      isFavorite: (recipeId) => {
        return get().favorites.some((r) => r.id === recipeId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      }
    }),
    {
      name: 'favorites-storage'
    }
  )
);