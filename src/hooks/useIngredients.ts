import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Ingredient } from '../data/mockData';

export function useIngredients() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bake_ingredients')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data) {
        const mapped = data.map(item => ({
          id: item.id,
          name: item.name,
          packagePrice: item.package_price,
          packageSize: item.package_size,
          unit: item.unit as any
        }));
        setIngredients(mapped);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching ingredients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIngredients();
    } else {
      setIngredients([]);
      setLoading(false);
    }
  }, [user]);

  const addIngredient = async (ingredient: Omit<Ingredient, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('bake_ingredients')
        .insert([{
          name: ingredient.name,
          package_price: ingredient.packagePrice,
          package_size: ingredient.packageSize,
          unit: ingredient.unit
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newIng = {
          id: data.id,
          name: data.name,
          packagePrice: data.package_price,
          packageSize: data.package_size,
          unit: data.unit as any
        };
        setIngredients(prev => [...prev, newIng].sort((a, b) => a.name.localeCompare(b.name)));
        return newIng;
      }
    } catch (err: any) {
      console.error('Error adding ingredient:', err);
      throw err;
    }
  };

  const updateIngredient = async (id: string, updates: Partial<Ingredient>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.packagePrice !== undefined) dbUpdates.package_price = updates.packagePrice;
      if (updates.packageSize !== undefined) dbUpdates.package_size = updates.packageSize;
      if (updates.unit !== undefined) dbUpdates.unit = updates.unit;

      const { data, error } = await supabase
        .from('bake_ingredients')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setIngredients(prev => prev.map(i => i.id === id ? {
          id: data.id,
          name: data.name,
          packagePrice: data.package_price,
          packageSize: data.package_size,
          unit: data.unit as any
        } : i));
      }
    } catch (err: any) {
      console.error('Error updating ingredient:', err);
      throw err;
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bake_ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIngredients(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      console.error('Error deleting ingredient:', err);
      throw err;
    }
  };

  return { ingredients, loading, error, addIngredient, updateIngredient, deleteIngredient, refresh: fetchIngredients };
}
