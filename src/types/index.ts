// Recipe 타입 정의
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  servings: number;
  difficulty: string;
  prep_time: number;
  cook_time: number;
  calories_per_serving?: number;
  protein_g?: number;
  carb_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sodium_mg?: number;
  main_ingredients: any[];
  sub_ingredients: any[];
  seasonings: any[];
  instructions: string[];
  instructions_formatted: any[];
  hashtags: string[];
  tags: string[];
  meal_type: string;
  cuisine_type: string;
  health_tips?: string;
  image_url?: string;
  step1_image_url?: string;
  step2_image_url?: string;
  step3_image_url?: string;
  step4_image_url?: string;
  created_at: string;
  updated_at: string;
  avg_rating?: number;
  total_ratings?: number;
}

// Survey 타입 정의
export interface SurveyResponse {
  id: string;
  age: string;
  gender?: string;
  height?: number;
  weight?: number;
  diagnosed_diseases: string[];
  health_interests: string[];
  activity_level?: string;
  health_status?: string;
  meal_target?: string;
  diet_goal?: string;
  weekly_budget?: string;
  household_size?: number;
  dietary_restrictions: string[];
  nutrition_preferences: string[];
  cooking_styles: string[];
  preferred_meats: string[];
  preferred_seafoods: string[];
  avoid_foods: string[];
  allergens: string[];
  cooking_experience?: string;
  cooking_frequency?: string;
  available_equipment: string[];
  email: string;
  name?: string;
  phone?: string;
  spice_tolerance?: string;
  preferred_cuisines: string[];
  meal_times: Record<string, string>;
  wellness_score?: number;
  created_at: string;
  updated_at: string;
}

// Feedback 타입 정의
export interface Feedback {
  id: string;
  recipe_id?: string;
  survey_response_id?: string;
  feedback_type: 'recipe' | 'survey' | 'general';
  rating?: number;
  difficulty_rating?: number;
  taste_rating?: number;
  health_rating?: number;
  comment?: string;
  improvements?: string;
  made_recipe: boolean;
  would_make_again?: boolean;
  cooking_time_accurate?: boolean;
  instructions_clear?: boolean;
  ingredients_available?: boolean;
  user_email: string;
  user_name?: string;
  category?: 'bug' | 'suggestion' | 'compliment' | 'complaint';
  priority?: 'low' | 'medium' | 'high';
  status: 'new' | 'reviewed' | 'resolved';
  admin_response?: string;
  created_at: string;
  updated_at: string;
}

// Wellness 결과 타입
export interface WellnessResult {
  survey_id: string;
  wellness_score: number;
  health_category: string;
  recommendations: string[];
  risk_factors: string[];
  improvement_areas: string[];
}

// 페이지네이션 타입
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}