import React from 'react';
import { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* 이미지 */}
      <div className="relative h-48 bg-gray-200">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">이미지 없음</span>
          </div>
        )}
        {/* 난이도 배지 */}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
          <span className="text-sm font-medium">{recipe.difficulty}</span>
        </div>
      </div>

      {/* 내용 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{recipe.title}</h3>
        
        {recipe.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* 정보 태그들 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {recipe.meal_type}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {recipe.cuisine_type}
          </span>
        </div>

        {/* 시간 및 영양 정보 */}
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>⏱ {recipe.prep_time + recipe.cook_time}분</span>
            <span>🍽 {recipe.servings}인분</span>
          </div>
          {recipe.calories_per_serving && (
            <span>{recipe.calories_per_serving}kcal</span>
          )}
        </div>

        {/* 평점 */}
        {recipe.avg_rating !== undefined && (
          <div className="mt-3 flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(recipe.avg_rating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {recipe.avg_rating?.toFixed(1)} ({recipe.total_ratings || 0})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;