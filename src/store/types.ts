import { Recipe, SurveyResponse, UserProfile } from '../types';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<UserProfile>) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  fetchRecipes: (params?: any) => Promise<void>;
  fetchRecipeById: (id: string) => Promise<void>;
  searchRecipes: (query: string) => Promise<void>;
  clearError: () => void;
}

export interface SurveyState {
  currentSurvey: SurveyResponse | null;
  surveyHistory: SurveyResponse[];
  isSubmitting: boolean;
  error: string | null;
  submitSurvey: (data: Partial<SurveyResponse>) => Promise<string>;
  fetchSurveyHistory: () => Promise<void>;
  clearCurrentSurvey: () => void;
}

export interface FavoritesState {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  clearFavorites: () => void;
}