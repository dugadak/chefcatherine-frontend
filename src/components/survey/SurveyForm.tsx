import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurveyResponse } from '../../types';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';

interface SurveyStep {
  title: string;
  description: string;
}

const steps: SurveyStep[] = [
  { title: '기본 정보', description: '나이, 성별 등 기본 정보를 입력해주세요' },
  { title: '건강 정보', description: '건강 상태와 관심사를 알려주세요' },
  { title: '식사 계획', description: '식사 목표와 예산을 설정해주세요' },
  { title: '음식 선호도', description: '좋아하는 음식과 제한사항을 선택해주세요' },
  { title: '요리 경험', description: '요리 경험과 주방 환경을 알려주세요' },
];

const SurveyForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<SurveyResponse>>({
    diagnosed_diseases: [],
    health_interests: [],
    dietary_restrictions: [],
    nutrition_preferences: [],
    cooking_styles: [],
    preferred_meats: [],
    preferred_seafoods: [],
    avoid_foods: [],
    allergens: [],
    available_equipment: [],
    preferred_cuisines: [],
    meal_times: {},
  });

  const { execute: submitSurvey, loading } = useApi(api.survey.submit, {
    onSuccess: (data) => {
      navigate(`/survey/results/${data.id}`);
    },
    onError: (error) => {
      console.error('Survey submission failed:', error);
      alert('설문 제출에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const array = (prev[field as keyof SurveyResponse] as string[]) || [];
      const newArray = array.includes(value)
        ? array.filter(item => item !== value)
        : [...array, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!formData.age || !formData.email) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    await submitSurvey(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // 기본 정보
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                나이 *
              </label>
              <select
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">선택하세요</option>
                <option value="10-19">10-19세</option>
                <option value="20-29">20-29세</option>
                <option value="30-39">30-39세</option>
                <option value="40-49">40-49세</option>
                <option value="50-59">50-59세</option>
                <option value="60+">60세 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                성별
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  남성
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  여성
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  기타
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                키 (cm)
              </label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="170"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                체중 (kg)
              </label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="65"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일 *
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="홍길동"
              />
            </div>
          </div>
        );

      case 1: // 건강 정보
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                진단받은 질병 (해당하는 것 모두 선택)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['당뇨병', '고혈압', '고지혈증', '심장질환', '알레르기', '위장질환', '없음'].map(disease => (
                  <label key={disease} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.diagnosed_diseases?.includes(disease)}
                      onChange={() => handleArrayToggle('diagnosed_diseases', disease)}
                      className="mr-2"
                    />
                    {disease}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                건강 관심사 (해당하는 것 모두 선택)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['체중감량', '근육증가', '면역력강화', '피부개선', '소화개선', '피로회복'].map(interest => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.health_interests?.includes(interest)}
                      onChange={() => handleArrayToggle('health_interests', interest)}
                      className="mr-2"
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                활동 수준
              </label>
              <select
                value={formData.activity_level || ''}
                onChange={(e) => handleInputChange('activity_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="sedentary">좌식 생활</option>
                <option value="light">가벼운 활동</option>
                <option value="moderate">보통 활동</option>
                <option value="active">활발한 활동</option>
                <option value="very_active">매우 활발한 활동</option>
              </select>
            </div>
          </div>
        );

      case 2: // 식사 계획
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                식사 목표
              </label>
              <select
                value={formData.meal_target || ''}
                onChange={(e) => handleInputChange('meal_target', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="self">혼자 식사</option>
                <option value="family">가족 식사</option>
                <option value="diet">다이어트 식단</option>
                <option value="bulk">벌크업 식단</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                다이어트 목표
              </label>
              <select
                value={formData.diet_goal || ''}
                onChange={(e) => handleInputChange('diet_goal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="lose_weight">체중 감량</option>
                <option value="maintain">체중 유지</option>
                <option value="gain_weight">체중 증가</option>
                <option value="health">건강 개선</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주간 식비 예산
              </label>
              <select
                value={formData.weekly_budget || ''}
                onChange={(e) => handleInputChange('weekly_budget', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="under_30000">3만원 미만</option>
                <option value="30000_50000">3-5만원</option>
                <option value="50000_70000">5-7만원</option>
                <option value="70000_100000">7-10만원</option>
                <option value="over_100000">10만원 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가구 인원수
              </label>
              <input
                type="number"
                value={formData.household_size || ''}
                onChange={(e) => handleInputChange('household_size', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
                min="1"
                max="10"
              />
            </div>
          </div>
        );

      case 3: // 음식 선호도
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                식이 제한사항
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['채식주의', '비건', '글루텐프리', '유당불내증', '할랄', '코셔', '없음'].map(restriction => (
                  <label key={restriction} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.dietary_restrictions?.includes(restriction)}
                      onChange={() => handleArrayToggle('dietary_restrictions', restriction)}
                      className="mr-2"
                    />
                    {restriction}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선호하는 요리 스타일
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['한식', '중식', '일식', '양식', '동남아', '인도요리'].map(style => (
                  <label key={style} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.cooking_styles?.includes(style)}
                      onChange={() => handleArrayToggle('cooking_styles', style)}
                      className="mr-2"
                    />
                    {style}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                알레르기
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['땅콩', '견과류', '우유', '계란', '밀', '콩', '조개류', '생선', '없음'].map(allergen => (
                  <label key={allergen} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allergens?.includes(allergen)}
                      onChange={() => handleArrayToggle('allergens', allergen)}
                      className="mr-2"
                    />
                    {allergen}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매운맛 선호도
              </label>
              <select
                value={formData.spice_tolerance || ''}
                onChange={(e) => handleInputChange('spice_tolerance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="none">못 먹음</option>
                <option value="mild">약간 매운맛</option>
                <option value="medium">중간 매운맛</option>
                <option value="hot">매운맛</option>
                <option value="very_hot">아주 매운맛</option>
              </select>
            </div>
          </div>
        );

      case 4: // 요리 경험
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요리 경험
              </label>
              <select
                value={formData.cooking_experience || ''}
                onChange={(e) => handleInputChange('cooking_experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="beginner">초보자</option>
                <option value="intermediate">중급자</option>
                <option value="advanced">고급자</option>
                <option value="expert">전문가</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요리 빈도
              </label>
              <select
                value={formData.cooking_frequency || ''}
                onChange={(e) => handleInputChange('cooking_frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="daily">매일</option>
                <option value="few_times_week">주 3-4회</option>
                <option value="weekly">주 1-2회</option>
                <option value="rarely">거의 안함</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보유 주방 기구
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['오븐', '전자레인지', '에어프라이어', '믹서기', '압력솥', '찜기'].map(equipment => (
                  <label key={equipment} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.available_equipment?.includes(equipment)}
                      onChange={() => handleArrayToggle('available_equipment', equipment)}
                      className="mr-2"
                    />
                    {equipment}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">맞춤 레시피 추천 설문</h1>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? 'bg-blue-600 text-white'
                    : index === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <p className="text-xs mt-1">{step.title}</p>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
        <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '처리중...' : currentStep === steps.length - 1 ? '제출' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;