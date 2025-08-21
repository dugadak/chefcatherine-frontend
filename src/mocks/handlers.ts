import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const handlers = [
  // Auth handlers
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-jwt-token',
        token_type: 'bearer'
      })
    );
  }),

  rest.post(`${API_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'testuser',
        full_name: 'Test User'
      })
    );
  }),

  rest.get(`${API_URL}/auth/me`, (req, res, ctx) => {
    const token = req.headers.get('Authorization');
    
    if (!token) {
      return res(ctx.status(401));
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'testuser',
        full_name: 'Test User'
      })
    );
  }),

  // Recipe handlers
  rest.get(`${API_URL}/recipes`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [
          {
            id: '1',
            title: '김치찌개',
            description: '맛있는 김치찌개',
            calories_per_serving: 250,
            prep_time: 10,
            cook_time: 20,
            difficulty: 'easy',
            meal_type: 'lunch',
            cuisine_type: 'korean'
          }
        ],
        total: 1,
        page: 1,
        size: 20,
        pages: 1
      })
    );
  }),

  rest.get(`${API_URL}/recipes/:id`, (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        id,
        title: '김치찌개',
        description: '맛있는 김치찌개',
        servings: 2,
        difficulty: 'easy',
        prep_time: 10,
        cook_time: 20,
        calories_per_serving: 250,
        main_ingredients: ['김치', '돼지고기', '두부'],
        instructions: ['재료 준비', '볶기', '끓이기'],
        meal_type: 'lunch',
        cuisine_type: 'korean'
      })
    );
  }),

  // Survey handlers
  rest.post(`${API_URL}/survey/submit`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '123e4567-e89b-12d3-a456-426614174001',
        wellness_score: 75,
        email: 'survey@example.com'
      })
    );
  }),

  rest.get(`${API_URL}/survey/results/:id`, (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        id,
        wellness_score: 75,
        health_category: 'Good',
        recommendations: ['운동을 늘리세요', '채소를 더 드세요']
      })
    );
  }),

  // Feedback handlers
  rest.post(`${API_URL}/feedback/submit`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '123e4567-e89b-12d3-a456-426614174002',
        message: 'Feedback submitted successfully'
      })
    );
  })
];