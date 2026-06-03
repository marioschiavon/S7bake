import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_CATEGORIES } from '../data/mockData';

export default function MigrationManager() {
  const { user } = useAuth();
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    const runMigration = async () => {
      if (!user) return;
      const localCategoriesStr = localStorage.getItem('s7bake_user_categories');
      const localRecipesStr = localStorage.getItem('s7bake_user_recipes');
      
      if (!localCategoriesStr && !localRecipesStr) return;

      setMigrating(true);
      try {
        const oldToNewCategoryMap: Record<string, string> = {};

        // 1. Migrate Categories (Mock + Local)
        let allCategoriesToMigrate = [...MOCK_CATEGORIES];
        if (localCategoriesStr) {
          allCategoriesToMigrate = [...allCategoriesToMigrate, ...JSON.parse(localCategoriesStr)];
        }

        for (const cat of allCategoriesToMigrate) {
          // Check if category name already exists for this user
          const { data: existingCat } = await supabase
            .from('bake_categories')
            .select('id')
            .eq('user_id', user.id)
            .eq('name', cat.name)
            .single();

          if (existingCat) {
            oldToNewCategoryMap[cat.id] = existingCat.id;
          } else {
            const { data: newCat } = await supabase
              .from('bake_categories')
              .insert([{ name: cat.name, user_id: user.id }])
              .select('id')
              .single();
            if (newCat) {
              oldToNewCategoryMap[cat.id] = newCat.id;
            }
          }
        }

        // 2. Migrate Recipes
        if (localRecipesStr) {
          const localRecipes = JSON.parse(localRecipesStr);
          for (const rec of localRecipes) {
            const mappedCategoryId = oldToNewCategoryMap[rec.categoryId];
            if (!mappedCategoryId) continue; // Skip if category couldn't be mapped

            await supabase.from('bake_recipes').insert([{
              name: rec.name,
              category_id: mappedCategoryId,
              yield: rec.yield,
              yield_unit: rec.yieldUnit,
              prep_time_minutes: rec.prepTimeMinutes,
              nodes: rec.nodes || [],
              user_id: user.id
            }]);
          }
        }

        // 3. Clean up local storage
        localStorage.removeItem('s7bake_user_categories');
        localStorage.removeItem('s7bake_user_recipes');
        
        // Reload to fetch fresh data
        window.location.reload();

      } catch (err) {
        console.error('Migration failed:', err);
      } finally {
        setMigrating(false);
      }
    };

    runMigration();
  }, [user]);

  if (migrating) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-slate-800">Sincronizando seus dados...</h2>
          <p className="text-slate-500 mt-2 text-center max-w-xs">Estamos enviando suas receitas salvas no navegador para a nuvem.</p>
        </div>
      </div>
    );
  }

  return null;
}
