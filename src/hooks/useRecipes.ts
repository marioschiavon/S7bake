import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_RECIPES } from '../data/mockData';
import type { Recipe } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export function useRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    if (!user) {
      setRecipes(MOCK_RECIPES);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bake_recipes')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const dbRecipes: Recipe[] = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        categoryId: row.category_id,
        yield: row.yield,
        yieldUnit: row.yield_unit,
        prepTimeMinutes: row.prep_time_minutes,
        nodes: row.nodes,
        userId: row.user_id
      }));

      setRecipes(dbRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes(MOCK_RECIPES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'userId'>) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar receitas.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bake_recipes')
        .insert([
          {
            name: recipe.name,
            category_id: recipe.categoryId,
            yield: recipe.yield,
            yield_unit: recipe.yieldUnit,
            prep_time_minutes: recipe.prepTimeMinutes,
            nodes: recipe.nodes,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newRecipe: Recipe = {
        id: data.id,
        name: data.name,
        categoryId: data.category_id,
        yield: data.yield,
        yieldUnit: data.yield_unit,
        prepTimeMinutes: data.prep_time_minutes,
        nodes: data.nodes,
        userId: data.user_id
      };

      setRecipes(prev => [...prev, newRecipe]);
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Erro ao criar receita.');
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar receitas.');
      return;
    }

    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
      if (updates.yield !== undefined) dbUpdates.yield = updates.yield;
      if (updates.yieldUnit !== undefined) dbUpdates.yield_unit = updates.yieldUnit;
      if (updates.prepTimeMinutes !== undefined) dbUpdates.prep_time_minutes = updates.prepTimeMinutes;
      if (updates.nodes !== undefined) dbUpdates.nodes = updates.nodes;

      const { error } = await supabase
        .from('bake_recipes')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Erro ao atualizar receita.');
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar receitas.');
      return;
    }

    try {
      const { error } = await supabase
        .from('bake_recipes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Erro ao excluir receita.');
    }
  };

  return { recipes, addRecipe, updateRecipe, deleteRecipe, loading, fetchRecipes };
}
