import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe, Feedback } from '../../types';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  
  const { data: recipe, loading, error, execute } = useApi<Recipe>(
    api.recipes.getDetail
  );

  useEffect(() => {
    if (id) {
      execute(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">레시피를 불러오는 중 오류가 발생했습니다.</p>
        <button
          onClick={() => navigate('/recipes')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/recipes')}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← 목록으로
        </button>
        
        <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
        
        {recipe.description && (
          <p className="text-gray-600 text-lg">{recipe.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 이미지 및 기본 정보 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
              </div>
            )}
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">난이도</span>
                  <span className="font-medium">{recipe.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">준비 시간</span>
                  <span className="font-medium">{recipe.prep_time}분</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">조리 시간</span>
                  <span className="font-medium">{recipe.cook_time}분</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">인분</span>
                  <span className="font-medium">{recipe.servings}인분</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">식사 유형</span>
                  <span className="font-medium">{recipe.meal_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">요리 종류</span>
                  <span className="font-medium">{recipe.cuisine_type}</span>
                </div>
              </div>

              {/* 태그 */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽: 상세 정보 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {/* 탭 메뉴 */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'ingredients'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  재료
                </button>
                <button
                  onClick={() => setActiveTab('instructions')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'instructions'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  조리법
                </button>
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'nutrition'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  영양정보
                </button>
              </div>
            </div>

            {/* 탭 내용 */}
            <div className="p-6">
              {activeTab === 'ingredients' && (
                <div className="space-y-6">
                  {recipe.main_ingredients && recipe.main_ingredients.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">주재료</h3>
                      <ul className="space-y-2">
                        {recipe.main_ingredients.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            {typeof item === 'string' ? item : item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recipe.sub_ingredients && recipe.sub_ingredients.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">부재료</h3>
                      <ul className="space-y-2">
                        {recipe.sub_ingredients.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                            {typeof item === 'string' ? item : item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recipe.seasonings && recipe.seasonings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">양념</h3>
                      <ul className="space-y-2">
                        {recipe.seasonings.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                            {typeof item === 'string' ? item : item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'instructions' && (
                <div className="space-y-4">
                  {recipe.instructions && recipe.instructions.length > 0 ? (
                    <ol className="space-y-4">
                      {recipe.instructions.map((step, index) => (
                        <li key={index} className="flex">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                            {index + 1}
                          </span>
                          <p className="pt-1">{step}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500">조리법 정보가 없습니다.</p>
                  )}
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {recipe.calories_per_serving || 0}
                    </div>
                    <div className="text-gray-600">칼로리</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {recipe.protein_g || 0}g
                    </div>
                    <div className="text-gray-600">단백질</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {recipe.carb_g || 0}g
                    </div>
                    <div className="text-gray-600">탄수화물</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {recipe.fat_g || 0}g
                    </div>
                    <div className="text-gray-600">지방</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {recipe.fiber_g || 0}g
                    </div>
                    <div className="text-gray-600">식이섬유</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">
                      {recipe.sodium_mg || 0}mg
                    </div>
                    <div className="text-gray-600">나트륨</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 건강 팁 */}
          {recipe.health_tips && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">건강 팁</h3>
              <p className="text-gray-700">{recipe.health_tips}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;