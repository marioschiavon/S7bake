import { useState, useEffect } from 'react';
import { MOCK_CATEGORIES } from '../data/mockData';
import type { Category } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load categories from local storage
    const localCategoriesStr = localStorage.getItem('s7bake_user_categories');
    let localCategories: Category[] = [];
    if (localCategoriesStr) {
      try {
        localCategories = JSON.parse(localCategoriesStr);
      } catch (e) {
        console.error('Failed to parse local categories', e);
      }
    }

    // Combine mock categories (public/templates) with the user's own categories
    // For now, let's assume we don't have a userId on Category, but we only load categories created by the user from localStorage.
    const combined = [
      ...MOCK_CATEGORIES,
      ...localCategories
    ];
    setCategories(combined);
  }, [user]);

  const addCategory = (name: string) => {
    if (!user) return;

    const newCategory: Category = {
      id: `category_${Date.now()}`,
      name
    };

    const localCategoriesStr = localStorage.getItem('s7bake_user_categories');
    let localCategories: Category[] = [];
    if (localCategoriesStr) {
      try {
        localCategories = JSON.parse(localCategoriesStr);
      } catch (e) {}
    }

    localCategories.push(newCategory);
    localStorage.setItem('s7bake_user_categories', JSON.stringify(localCategories));

    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, newName: string) => {
    if (!user) return;

    // We only update local storage categories. Mock categories are readonly in this MVP.
    const localCategoriesStr = localStorage.getItem('s7bake_user_categories');
    let localCategories: Category[] = [];
    if (localCategoriesStr) {
      try {
        localCategories = JSON.parse(localCategoriesStr);
      } catch (e) {}
    }

    const updatedLocal = localCategories.map(c => c.id === id ? { ...c, name: newName } : c);
    localStorage.setItem('s7bake_user_categories', JSON.stringify(updatedLocal));

    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const deleteCategory = (id: string) => {
    if (!user) return;

    // Remove from local storage
    const localCategoriesStr = localStorage.getItem('s7bake_user_categories');
    let localCategories: Category[] = [];
    if (localCategoriesStr) {
      try {
        localCategories = JSON.parse(localCategoriesStr);
      } catch (e) {}
    }

    const updatedLocal = localCategories.filter(c => c.id !== id);
    localStorage.setItem('s7bake_user_categories', JSON.stringify(updatedLocal));

    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return { categories, addCategory, updateCategory, deleteCategory };
}
