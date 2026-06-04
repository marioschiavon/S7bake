import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Recipe } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export function useRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const mapRow = (row: any): Recipe => ({
    id: row.id,
    name: row.name,
    categoryId: row.category_id,
    yield: row.yield,
    yieldUnit: row.yield_unit,
    prepTimeMinutes: row.prep_time_minutes,
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    nodes: Array.isArray(row.nodes) ? row.nodes : [],
    userId: row.user_id,
  });

  const fetchRecipes = async () => {
    if (!user) {
      setRecipes([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('bake_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      if (error) throw error;
      setRecipes((data ?? []).map(mapRow));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, [user]);

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('bake_recipes')
        .insert([{
          name: recipe.name,
          category_id: recipe.categoryId,
          yield: recipe.yield,
          yield_unit: recipe.yieldUnit,
          prep_time_minutes: recipe.prepTimeMinutes,
          ingredients: recipe.ingredients ?? [],
          nodes: recipe.nodes ?? [],
          user_id: user.id,
        }])
        .select()
        .single();
      if (error) throw error;
      setRecipes(prev => [...prev, mapRow(data)].sort((a, b) => a.name.localeCompare(b.name)));
      return mapRow(data);
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Erro ao criar receita.');
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    if (!user) return;
    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
      if (updates.yield !== undefined) dbUpdates.yield = updates.yield;
      if (updates.yieldUnit !== undefined) dbUpdates.yield_unit = updates.yieldUnit;
      if (updates.prepTimeMinutes !== undefined) dbUpdates.prep_time_minutes = updates.prepTimeMinutes;
      if (updates.ingredients !== undefined) dbUpdates.ingredients = updates.ingredients;
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
    if (!user) return;
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
