import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../data/mockData';
import { useIngredients } from '../hooks/useIngredients';
import type { Category, Recipe } from '../data/mockData';
import { useRecipes } from '../hooks/useRecipes';
import { useCategories } from '../hooks/useCategories';
import { ChefHat, Clock, Tag, Plus, FolderPlus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function Recipes() {
  const navigate = useNavigate();
  const { recipes: allRecipes, deleteRecipe } = useRecipes();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { ingredients: dbIngredients } = useIngredients();
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');

  const calculateRecipeCost = (recipe: Recipe) => {
    const ingredientsNode = recipe.nodes.find(n => n.type === 'ingredients');
    if (!ingredientsNode || !ingredientsNode.ingredients) return 0;
    
    return ingredientsNode.ingredients.reduce((total, req) => {
      const ing = dbIngredients.find(i => i.id === req.ingredientId);
      if (!ing) return total;
      const costPerUnit = ing.packagePrice / ing.packageSize;
      return total + (costPerUnit * req.quantity);
    }, 0);
  };

  const handleSaveCategory = () => {
    if (categoryNameInput.trim()) {
      if (editingCategory) {
        updateCategory(editingCategory.id, categoryNameInput);
      } else {
        addCategory(categoryNameInput);
      }
      setCategoryNameInput('');
      setShowCategoryModal(false);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string, recipeCount: number) => {

    if (recipeCount > 0) {
      alert(`Não é possível excluir a categoria "${categoryName}" porque ela possui ${recipeCount} receita(s). Mova ou exclua as receitas primeiro.`);
      return;
    }

    if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      deleteCategory(categoryId);
    }
  };

  const handleDeleteRecipe = (recipeId: string, recipeName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a receita "${recipeName}"?`)) {
      deleteRecipe(recipeId);
    }
  };

  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCategoryNameInput('');
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryNameInput(category.name);
    setShowCategoryModal(true);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Receitas</h1>
          <p className="text-slate-500 mt-1">Gerencie seus templates de produção agrupados por categoria.</p>
        </div>
        <button 
          onClick={openNewCategoryModal}
          className="bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center"
        >
          <FolderPlus size={20} className="mr-2" />
          Nova Categoria
        </button>
      </div>
      
      {categories.map(category => {
        const categoryRecipes = allRecipes.filter(r => r.categoryId === category.id);
        
        return (
          <div key={category.id} className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center space-x-2">
                <Tag className="text-primary-500" size={24} />
                <h2 className="text-2xl font-bold text-slate-800">{category.name}</h2>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                  {categoryRecipes.length}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={() => openEditCategoryModal(category)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDeleteCategory(category.id, category.name, categoryRecipes.length)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
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
                      <div className="relative group/menu">
                        <button className="text-slate-400 hover:text-slate-700 p-1">
                          <MoreVertical size={20} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 flex flex-col overflow-hidden">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/receitas/editar/${recipe.id}`); }}
                            className="px-4 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 flex items-center"
                          >
                            <Edit2 size={14} className="mr-2" /> Editar
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe.id, recipe.name); }}
                            className="px-4 py-2 text-left text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center"
                          >
                            <Trash2 size={14} className="mr-2" /> Excluir
                          </button>
                        </div>
                      </div>
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

      {/* Modal Categoria */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <p className="text-slate-500 mb-6">
                {editingCategory ? 'Altere o nome da sua categoria.' : 'Crie uma nova categoria para agrupar suas receitas.'}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Categoria</label>
                  <input
                    type="text"
                    value={categoryNameInput}
                    onChange={(e) => setCategoryNameInput(e.target.value)}
                    placeholder="Ex: Bolos de Festa"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                }}
                className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveCategory}
                disabled={!categoryNameInput.trim()}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
