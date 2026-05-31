import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_RECIPES, MOCK_CATEGORIES, MOCK_INGREDIENTS } from '../data/mockData';
import type { Category } from '../data/mockData';
import { ChefHat, Clock, Tag, Plus, FolderPlus, MoreVertical } from 'lucide-react';

export default function Recipes() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const calculateRecipeCost = (recipe: typeof MOCK_RECIPES[0]) => {
    const ingredientsNode = recipe.nodes.find(n => n.type === 'ingredients');
    if (!ingredientsNode || !ingredientsNode.ingredients) return 0;
    
    return ingredientsNode.ingredients.reduce((total, req) => {
      const ing = MOCK_INGREDIENTS.find(i => i.id === req.ingredientId);
      if (!ing) return total;
      const costPerUnit = ing.packagePrice / ing.packageSize;
      return total + (costPerUnit * req.quantity);
    }, 0);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, { id: Date.now().toString(), name: newCategoryName }]);
      setNewCategoryName('');
      setShowCategoryModal(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Receitas</h1>
          <p className="text-slate-500 mt-1">Gerencie seus templates de produção agrupados por categoria.</p>
        </div>
        <button 
          onClick={() => setShowCategoryModal(true)}
          className="bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center"
        >
          <FolderPlus size={20} className="mr-2" />
          Nova Categoria
        </button>
      </div>
      
      {categories.map(category => {
        const categoryRecipes = MOCK_RECIPES.filter(r => r.categoryId === category.id);
        
        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center space-x-2 px-2">
              <Tag className="text-primary-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">{category.name}</h2>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {categoryRecipes.length}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Card Nova Receita */}
              <div 
                onClick={() => navigate(`/receitas/nova?categoryId=${category.id}`)}
                className="glass-panel p-5 min-h-[280px] flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-slate-300 hover:border-primary-400 hover:bg-primary-50/50 transition-all group rounded-2xl"
              >
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors mb-4">
                  <Plus size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-600 group-hover:text-primary-700">Nova Receita</h3>
                <p className="text-slate-400 text-sm text-center mt-2 px-4">Criar template de produção em {category.name}</p>
              </div>

              {categoryRecipes.map(recipe => {
                const totalCost = calculateRecipeCost(recipe);
                const unitCost = totalCost / recipe.yield;

                return (
                  <div key={recipe.id} className="glass-panel p-5 hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary-200 group flex flex-col rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary-50 rounded-xl text-primary-600 group-hover:bg-primary-100 transition-colors">
                        <ChefHat size={24} />
                      </div>
                      <button className="text-slate-400 hover:text-slate-700 p-1">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-xl text-slate-800 leading-tight mb-2 flex-1">{recipe.name}</h3>
                    
                    <div className="flex items-center text-slate-500 text-sm mb-5 font-medium">
                      <Clock size={16} className="mr-1.5 text-slate-400" />
                      {recipe.prepTimeMinutes} minutos
                    </div>
                    
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-500">Rendimento</span>
                        <span className="font-bold text-slate-700">{recipe.yield} {recipe.yieldUnit}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-500">Custo Total</span>
                        <span className="font-bold text-red-500">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Custo Unitário</span>
                        <span className="font-bold text-lg text-slate-900">R$ {unitCost.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Modal Nova Categoria */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Nova Categoria</h2>
              <p className="text-slate-500 mb-6">Crie uma nova categoria para agrupar suas receitas.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Categoria</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ex: Bolos de Festa"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Criar Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
