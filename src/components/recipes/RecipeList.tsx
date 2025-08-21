import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import { Recipe, PaginatedResponse } from '../../types';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';

const RecipeList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [mealType, setMealType] = useState('');
  const [cuisineType, setCuisineType] = useState('');

  const { data, loading, error, execute } = useApi<PaginatedResponse<Recipe>>(
    api.recipes.getList
  );

  useEffect(() => {
    fetchRecipes();
  }, [page, mealType, cuisineType]);

  const fetchRecipes = () => {
    const params = {
      page,
      size: 12,
      meal_type: mealType || undefined,
      cuisine_type: cuisineType || undefined,
      search: searchTerm || undefined,
    };
    execute(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes();
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">레시피를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">레시피 목록</h1>

      {/* 검색 및 필터 */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="레시피 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 식사</option>
            <option value="아침">아침</option>
            <option value="점심">점심</option>
            <option value="저녁">저녁</option>
            <option value="간식">간식</option>
          </select>

          <select
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 요리</option>
            <option value="한식">한식</option>
            <option value="중식">중식</option>
            <option value="일식">일식</option>
            <option value="양식">양식</option>
            <option value="기타">기타</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
        </form>
      </div>

      {/* 레시피 그리드 */}
      {data && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.id)}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {data.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                이전
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, data.pages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-md ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">레시피가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;