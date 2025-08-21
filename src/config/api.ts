export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Recipe endpoints
  recipes: {
    list: '/recipes',
    detail: (id: string) => `/recipes/${id}`,
    search: '/recipes/search',
    recommend: '/recipes/recommend',
  },
  
  // Survey endpoints
  survey: {
    submit: '/survey/submit',
    results: (id: string) => `/survey/results/${id}`,
  },
  
  // Feedback endpoints
  feedback: {
    submit: '/feedback/submit',
    list: '/feedback',
  },
  
  // Health check
  health: '/health',
  status: '/status',
};