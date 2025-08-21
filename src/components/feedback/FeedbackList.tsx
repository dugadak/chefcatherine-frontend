import React, { useEffect, useState } from 'react';
import { Feedback } from '../../types';
import { feedbackApi } from '../../services/api';
import FeedbackItem from './FeedbackItem';

interface FeedbackListProps {
  recipeId?: string;
  limit?: number;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ recipeId, limit = 10 }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, [page, recipeId]);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params: any = {
        page,
        size: limit
      };

      if (recipeId) {
        params.recipe_id = recipeId;
      }

      const response = await feedbackApi.getList(params);
      const newFeedbacks = response.data.items;

      if (page === 1) {
        setFeedbacks(newFeedbacks);
      } else {
        setFeedbacks(prev => [...prev, ...newFeedbacks]);
      }

      setHasMore(newFeedbacks.length === limit);
    } catch (err: any) {
      setError(err.response?.data?.message || '피드백을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 피드백이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">사용자 피드백</h3>
      
      {feedbacks.map((feedback) => (
        <FeedbackItem key={feedback.id} feedback={feedback} />
      ))}

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;