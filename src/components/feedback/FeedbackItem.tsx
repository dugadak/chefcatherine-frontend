import React from 'react';
import { Feedback } from '../../types';

interface FeedbackItemProps {
  feedback: Feedback;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getCategoryBadge = (category?: string) => {
    const colors = {
      suggestion: 'bg-blue-100 text-blue-800',
      compliment: 'bg-green-100 text-green-800',
      complaint: 'bg-red-100 text-red-800',
      bug: 'bg-orange-100 text-orange-800'
    };

    const labels = {
      suggestion: '제안',
      compliment: '칭찬',
      complaint: '불만',
      bug: '버그'
    };

    if (!category) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category as keyof typeof colors]}`}>
        {labels[category as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {feedback.user_name || '익명'}
            </span>
            {getCategoryBadge(feedback.category)}
          </div>
          <span className="text-sm text-gray-500">
            {new Date(feedback.created_at).toLocaleDateString('ko-KR')}
          </span>
        </div>
        
        {feedback.rating && renderStars(feedback.rating)}
      </div>

      {/* Detailed Ratings */}
      {feedback.feedback_type === 'recipe' && (
        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
          {feedback.difficulty_rating && (
            <div>
              <span className="text-gray-600">난이도: </span>
              <span className="font-medium">{feedback.difficulty_rating}/5</span>
            </div>
          )}
          {feedback.taste_rating && (
            <div>
              <span className="text-gray-600">맛: </span>
              <span className="font-medium">{feedback.taste_rating}/5</span>
            </div>
          )}
          {feedback.health_rating && (
            <div>
              <span className="text-gray-600">건강도: </span>
              <span className="font-medium">{feedback.health_rating}/5</span>
            </div>
          )}
        </div>
      )}

      {/* Recipe Experience Badges */}
      {feedback.made_recipe && (
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
            ✓ 직접 만들어봄
          </span>
          {feedback.would_make_again && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
              ✓ 다시 만들 예정
            </span>
          )}
          {feedback.cooking_time_accurate === false && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
              ⚠ 조리시간 부정확
            </span>
          )}
          {feedback.instructions_clear === false && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
              ⚠ 설명 불명확
            </span>
          )}
          {feedback.ingredients_available === false && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
              ⚠ 재료 구하기 어려움
            </span>
          )}
        </div>
      )}

      {feedback.comment && (
        <p className="text-gray-700 mb-2">{feedback.comment}</p>
      )}

      {feedback.improvements && (
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <span className="text-sm font-medium text-gray-600">개선 제안: </span>
          <p className="text-sm text-gray-700 mt-1">{feedback.improvements}</p>
        </div>
      )}

      {feedback.admin_response && (
        <div className="mt-3 p-3 bg-blue-50 rounded">
          <span className="text-sm font-medium text-blue-900">관리자 답변: </span>
          <p className="text-sm text-blue-800 mt-1">{feedback.admin_response}</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackItem;