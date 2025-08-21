import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RecipeList from './components/recipes/RecipeList';
import RecipeDetail from './components/recipes/RecipeDetail';
import SurveyForm from './components/survey/SurveyForm';
import SurveyResults from './components/survey/SurveyResults';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/survey" element={<SurveyForm />} />
          <Route path="/survey/results/:id" element={<SurveyResults />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
