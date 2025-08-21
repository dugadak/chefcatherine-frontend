import axios, { AxiosInstance, AxiosError } from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 인증 오류 처리
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 메서드들
export const api = {
  // Auth 관련
  auth: {
    login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
    register: (data: any) => apiClient.post('/auth/register', data),
    logout: () => apiClient.post('/auth/logout'),
    refresh: () => apiClient.post('/auth/refresh'),
    profile: () => apiClient.get('/auth/profile'),
    updateProfile: (data: any) => apiClient.put('/auth/profile', data),
  },

  // Recipe 관련
  recipes: {
    getList: (params?: any) => apiClient.get('/recipes', { params }),
    getDetail: (id: string) => apiClient.get(`/recipes/${id}`),
    create: (data: any) => apiClient.post('/recipes', data),
    update: (id: string, data: any) => apiClient.put(`/recipes/${id}`, data),
    delete: (id: string) => apiClient.delete(`/recipes/${id}`),
    search: (data: any) => apiClient.post('/recipes/search', data),
    recommend: (data: any) => apiClient.post('/recipes/recommend', data),
  },

  // Survey 관련
  survey: {
    submit: (data: any) => apiClient.post('/survey/submit', data),
    getResults: (id: string) => apiClient.get(`/survey/results/${id}`),
    getStatistics: () => apiClient.get('/survey/statistics'),
    getWellness: (surveyId: string) => apiClient.post(`/survey/wellness`, { survey_id: surveyId }),
    getRecommendations: (data: any) => apiClient.post('/survey/recommend', data),
    getRecent: (limit?: number) => apiClient.get('/survey/recent', { params: { limit } }),
  },

  // Feedback 관련
  feedback: {
    submit: (data: any) => apiClient.post('/feedback/submit', data),
    getList: (params?: any) => apiClient.get('/feedback', { params }),
    getDetail: (id: string) => apiClient.get(`/feedback/${id}`),
    update: (id: string, data: any) => apiClient.put(`/feedback/${id}`, data),
    delete: (id: string) => apiClient.delete(`/feedback/${id}`),
    getStatistics: () => apiClient.get('/feedback/statistics'),
    submitBulk: (data: any) => apiClient.post('/feedback/bulk', data),
    getRecipeSummary: (recipeId: string) => apiClient.get(`/feedback/recipe/${recipeId}/summary`),
  },

  // Health check
  health: {
    check: () => apiClient.get('/health'),
    ready: () => apiClient.get('/health/ready'),
    live: () => apiClient.get('/health/live'),
  },
};

// Export individual API sections for store usage
export const authApi = api.auth;
export const recipeApi = {
  getAll: api.recipes.getList,
  getById: api.recipes.getDetail,
  search: (query: string) => api.recipes.search({ query }),
  recommend: api.recipes.recommend,
};
export const surveyApi = {
  submit: api.survey.submit,
  getResults: api.survey.getResults,
  getHistory: () => api.survey.getRecent(),
};
export const feedbackApi = api.feedback;

export default api;