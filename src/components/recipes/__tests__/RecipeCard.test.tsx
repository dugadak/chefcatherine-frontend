import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeCard from '../RecipeCard';

const mockRecipe = {
  id: '1',
  title: '김치찌개',
  description: '맛있는 김치찌개',
  image_url: '/images/kimchi.jpg',
  calories_per_serving: 250,
  prep_time: 10,
  cook_time: 20,
  difficulty: 'easy',
  avg_rating: 4.5,
  total_ratings: 10
};

describe('RecipeCard', () => {
  const renderRecipeCard = (recipe = mockRecipe) => {
    render(
      <BrowserRouter>
        <RecipeCard recipe={recipe} />
      </BrowserRouter>
    );
  };

  it('renders recipe information', () => {
    renderRecipeCard();
    
    expect(screen.getByText('김치찌개')).toBeInTheDocument();
    expect(screen.getByText('맛있는 김치찌개')).toBeInTheDocument();
    expect(screen.getByText('250 kcal')).toBeInTheDocument();
    expect(screen.getByText('30분')).toBeInTheDocument();
    expect(screen.getByText('쉬움')).toBeInTheDocument();
  });

  it('displays rating when available', () => {
    renderRecipeCard();
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('shows default image when image_url is not provided', () => {
    const recipeWithoutImage = { ...mockRecipe, image_url: undefined };
    renderRecipeCard(recipeWithoutImage);
    
    const image = screen.getByAltText('김치찌개') as HTMLImageElement;
    expect(image.src).toContain('default-recipe.jpg');
  });

  it('displays correct difficulty badge color', () => {
    renderRecipeCard();
    
    const difficultyBadge = screen.getByText('쉬움');
    expect(difficultyBadge.className).toContain('bg-green-100');
    expect(difficultyBadge.className).toContain('text-green-800');
  });

  it('links to recipe detail page', () => {
    renderRecipeCard();
    
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/recipes/1');
  });

  it('handles missing optional fields gracefully', () => {
    const minimalRecipe = {
      id: '2',
      title: '된장찌개',
      difficulty: 'medium'
    };
    
    render(
      <BrowserRouter>
        <RecipeCard recipe={minimalRecipe} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('된장찌개')).toBeInTheDocument();
    expect(screen.queryByText('0 kcal')).toBeInTheDocument();
  });
});