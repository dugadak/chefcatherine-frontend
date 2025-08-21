import React, { useState } from 'react';
import { Feedback } from '../../types';
import { feedbackApi } from '../../services/api';

interface FeedbackFormProps {
  recipeId?: string;
  surveyId?: string;
  onSubmit?: (feedback: Feedback) => void;
  onCancel?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  recipeId, 
  surveyId, 
  onSubmit,
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    feedback_type: recipeId ? 'recipe' : surveyId ? 'survey' : 'general',
    rating: 5,
    difficulty_rating: 3,
    taste_rating: 5,
    health_rating: 5,
    comment: '',
    improvements: '',
    made_recipe: false,
    would_make_again: false,
    cooking_time_accurate: true,
    instructions_clear: true,
    ingredients_available: true,
    user_email: '',
    user_name: '',
    category: 'suggestion' as const
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const feedbackData = {
        ...formData,
        recipe_id: recipeId,
        survey_response_id: surveyId
      };

      const response = await feedbackApi.submit(feedbackData);
      
      if (onSubmit) {
        onSubmit(response.data);
      }

      // Reset form
      setFormData({
        ...formData,
        comment: '',
        improvements: '',
        rating: 5
      });

      alert('피드백이 성공적으로 제출되었습니다!');
    } catch (err: any) {
      setError(err.response?.data?.message || '피드백 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">피드백 작성</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Fields */}
        {recipeId && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전체 평점
              </label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  난이도
                </label>
                <input
                  type="number"
                  name="difficulty_rating"
                  min="1"
                  max="5"
                  value={formData.difficulty_rating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  맛
                </label>
                <input
                  type="number"
                  name="taste_rating"
                  min="1"
                  max="5"
                  value={formData.taste_rating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  건강도
                </label>
                <input
                  type="number"
                  name="health_rating"
                  min="1"
                  max="5"
                  value={formData.health_rating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Recipe-specific checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="made_recipe"
                  checked={formData.made_recipe}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">이 레시피를 만들어 보았습니다</span>
              </label>

              {formData.made_recipe && (
                <>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="would_make_again"
                      checked={formData.would_make_again}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">다시 만들고 싶습니다</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="cooking_time_accurate"
                      checked={formData.cooking_time_accurate}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">조리 시간이 정확했습니다</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="instructions_clear"
                      checked={formData.instructions_clear}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">조리 방법이 명확했습니다</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="ingredients_available"
                      checked={formData.ingredients_available}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">재료를 쉽게 구할 수 있었습니다</span>
                  </label>
                </>
              )}
            </div>
          </>
        )}

        {/* Comment Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            의견
          </label>
          <textarea
            name="comment"
            rows={4}
            value={formData.comment}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="레시피에 대한 의견을 자유롭게 작성해주세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            개선 사항
          </label>
          <textarea
            name="improvements"
            rows={3}
            value={formData.improvements}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="개선이 필요한 부분이 있다면 알려주세요"
          />
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 *
            </label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            피드백 유형
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="suggestion">제안</option>
            <option value="compliment">칭찬</option>
            <option value="complaint">불만</option>
            <option value="bug">버그 신고</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '제출 중...' : '피드백 제출'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;