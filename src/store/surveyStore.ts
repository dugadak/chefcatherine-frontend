import { create } from 'zustand';
import { SurveyState } from './types';
import { surveyApi } from '../services/api';

export const useSurveyStore = create<SurveyState>((set, get) => ({
  currentSurvey: null,
  surveyHistory: [],
  isSubmitting: false,
  error: null,

  submitSurvey: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await surveyApi.submit(data);
      set({ 
        currentSurvey: response.data,
        isSubmitting: false 
      });
      return response.data.id;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || '설문 제출에 실패했습니다.',
        isSubmitting: false 
      });
      throw error;
    }
  },

  fetchSurveyHistory: async () => {
    try {
      const response = await surveyApi.getHistory();
      set({ surveyHistory: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || '설문 기록을 불러오는데 실패했습니다.' 
      });
    }
  },

  clearCurrentSurvey: () => {
    set({ currentSurvey: null, error: null });
  }
}));