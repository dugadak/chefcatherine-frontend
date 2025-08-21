import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SurveyResponse, WellnessResult } from '../../types';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';

const SurveyResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: surveyData, loading: surveyLoading, execute: fetchSurvey } = useApi<SurveyResponse>(
    api.survey.getResults
  );

  const { data: wellnessData, loading: wellnessLoading, execute: fetchWellness } = useApi<WellnessResult>(
    api.survey.getWellness
  );

  useEffect(() => {
    if (id) {
      fetchSurvey(id);
      fetchWellness(id);
    }
  }, [id]);

  if (surveyLoading || wellnessLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!surveyData || !wellnessData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">결과를 불러오는 중 오류가 발생했습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const getHealthCategoryColor = (category: string) => {
    switch (category) {
      case 'Excellent':
        return 'text-green-600';
      case 'Good':
        return 'text-blue-600';
      case 'Fair':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
    }
  };

  const getHealthCategoryKorean = (category: string) => {
    switch (category) {
      case 'Excellent':
        return '매우 좋음';
      case 'Good':
        return '좋음';
      case 'Fair':
        return '보통';
      default:
        return '개선 필요';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">설문 결과 분석</h1>

      {/* Wellness Score Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-4">웰니스 점수</h2>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-40 h-40">
              <circle
                className="text-gray-300"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="65"
                cx="80"
                cy="80"
              />
              <circle
                className="text-blue-600"
                strokeWidth="10"
                strokeDasharray={`${(wellnessData.wellness_score / 100) * 408} 408`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="65"
                cx="80"
                cy="80"
                transform="rotate(-90 80 80)"
              />
            </svg>
            <span className="absolute text-4xl font-bold">{wellnessData.wellness_score}</span>
          </div>
          <p className={`text-xl font-medium mt-4 ${getHealthCategoryColor(wellnessData.health_category)}`}>
            {getHealthCategoryKorean(wellnessData.health_category)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* 추천사항 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">추천사항</h3>
            <ul className="space-y-2">
              {wellnessData.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* 위험 요소 */}
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3">주의 사항</h3>
            <ul className="space-y-2">
              {wellnessData.risk_factors.map((risk, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-red-600 mr-2">!</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* 개선 영역 */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-3">개선 영역</h3>
            <ul className="space-y-2">
              {wellnessData.improvement_areas.map((area, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-yellow-600 mr-2">↑</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Survey Summary */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">설문 요약</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">기본 정보</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">나이:</span> {surveyData.age}</p>
              <p><span className="font-medium">성별:</span> {surveyData.gender || '미제공'}</p>
              <p><span className="font-medium">활동 수준:</span> {surveyData.activity_level || '미제공'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">식사 목표</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">식사 대상:</span> {surveyData.meal_target || '미제공'}</p>
              <p><span className="font-medium">다이어트 목표:</span> {surveyData.diet_goal || '미제공'}</p>
              <p><span className="font-medium">주간 예산:</span> {surveyData.weekly_budget || '미제공'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">건강 관심사</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {surveyData.health_interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">식이 제한</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {surveyData.dietary_restrictions.map((restriction, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                >
                  {restriction}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/recipes')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          추천 레시피 보기
        </button>
        <button
          onClick={() => navigate('/survey')}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          설문 다시하기
        </button>
      </div>
    </div>
  );
};

export default SurveyResults;