import React, { useEffect, useState } from 'react';
import { feedbackApi } from '../../services/api';

interface FeedbackSummaryProps {
  recipeId: string;
}

interface SummaryData {
  average_rating: number;
  total_feedbacks: number;
  rating_distribution: Record<string, number>;
  made_recipe_count: number;
  would_make_again_percentage: number;
}

const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ recipeId }) => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [recipeId]);

  const fetchSummary = async () => {
    try {
      const response = await feedbackApi.getRecipeSummary(recipeId);
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch feedback summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= fullStars 
                ? 'text-yellow-400' 
                : star === fullStars + 1 && hasHalfStar
                ? 'text-yellow-400 opacity-50'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {summary.average_rating.toFixed(1)} ({summary.total_feedbacks}개 리뷰)
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">평가 요약</h3>
      
      <div className="space-y-3">
        {/* Average Rating */}
        <div>
          {renderStars(summary.average_rating)}
        </div>

        {/* Rating Distribution */}
        {summary.rating_distribution && (
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = summary.rating_distribution[rating] || 0;
              const percentage = summary.total_feedbacks > 0 
                ? (count / summary.total_feedbacks) * 100 
                : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-3">{rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-10 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Recipe Stats */}
        {summary.made_recipe_count > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">직접 만들어본 사용자</span>
              <span className="font-medium">{summary.made_recipe_count}명</span>
            </div>
            {summary.would_make_again_percentage > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">다시 만들고 싶다고 응답</span>
                <span className="font-medium">
                  {summary.would_make_again_percentage.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSummary;