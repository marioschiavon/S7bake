import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Category } from '../data/mockData';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bake_categories')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const dbCategories: Category[] = data.map(row => ({
        id: row.id,
        name: row.name
      }));

      setCategories(dbCategories);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const addCategory = async (name: string) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar categorias.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bake_categories')
        .insert([
          {
            name,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newCategory: Category = {
        id: data.id,
        name: data.name
      };

      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Erro ao criar categoria.');
    }
  };

  const updateCategory = async (id: string, newName: string) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar categorias.');
      return;
    }

    try {
      const { error } = await supabase
        .from('bake_categories')
        .update({ name: newName })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Erro ao atualizar categoria.');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) {
      alert('Você precisa estar logado para gerenciar categorias.');
      return;
    }

    try {
      const { error } = await supabase
        .from('bake_categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Erro ao excluir categoria. Verifique se existem receitas vinculadas a ela.');
    }
  };

  return { categories, addCategory, updateCategory, deleteCategory, loading, error, fetchCategories };
}
