import { useState, useEffect } from 'react';
import { MOCK_RECIPES } from '../data/mockData';
import type { Recipe } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export function useRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Load recipes from local storage
    const localRecipesStr = localStorage.getItem('s7bake_user_recipes');
    let localRecipes: Recipe[] = [];
    if (localRecipesStr) {
      try {
        localRecipes = JSON.parse(localRecipesStr);
      } catch (e) {
        console.error('Failed to parse local recipes', e);
      }
    }

    // Combine mock recipes (public/templates) with the user's own recipes
    const combined = [
      ...MOCK_RECIPES,
      ...(user ? localRecipes.filter(r => r.userId === user.id) : [])
    ];
    setRecipes(combined);
  }, [user]);

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'userId'>) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar receitas.');
      return;
    }

    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe_${Date.now()}`,
      userId: user.id
    };

    const localRecipesStr = localStorage.getItem('s7bake_user_recipes');
    let localRecipes: Recipe[] = [];
    if (localRecipesStr) {
      try {
        localRecipes = JSON.parse(localRecipesStr);
      } catch (e) {}
    }

    localRecipes.push(newRecipe);
    localStorage.setItem('s7bake_user_recipes', JSON.stringify(localRecipes));

    // Update state
    setRecipes(prev => [...prev, newRecipe]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar receitas.');
      return;
    }

    const localRecipesStr = localStorage.getItem('s7bake_user_recipes');
    let localRecipes: Recipe[] = [];
    if (localRecipesStr) {
      try {
        localRecipes = JSON.parse(localRecipesStr);
      } catch (e) {}
    }

    const updatedLocal = localRecipes.map(r => r.id === id ? { ...r, ...updates } : r);
    localStorage.setItem('s7bake_user_recipes', JSON.stringify(updatedLocal));

    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRecipe = (id: string) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar receitas.');
      return;
    }

    const localRecipesStr = localStorage.getItem('s7bake_user_recipes');
    let localRecipes: Recipe[] = [];
    if (localRecipesStr) {
      try {
        localRecipes = JSON.parse(localRecipesStr);
      } catch (e) {}
    }

    const updatedLocal = localRecipes.filter(r => r.id !== id);
    localStorage.setItem('s7bake_user_recipes', JSON.stringify(updatedLocal));

    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  return { recipes, addRecipe, updateRecipe, deleteRecipe };
}
