import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CATEGORIES, MOCK_RECIPES } from '../data/mockData';
import { ChevronRight, PlayCircle } from 'lucide-react';

export default function ProductionSetup() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const filteredRecipes = selectedCategory 
    ? MOCK_RECIPES.filter(r => r.categoryId === selectedCategory)
    : [];

  const handleContinue = () => {
    if (selectedRecipe && quantity > 0) {
      navigate(`/execucao/${selectedRecipe}?qty=${quantity}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Iniciar Produção</h1>
        <p className="text-slate-500 mt-1">Siga os passos para configurar o que será produzido agora.</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Category */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">1</span>
            Escolha a Categoria
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {MOCK_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedRecipe(null);
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedCategory === category.id
                    ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-primary-300 text-slate-600'
                }`}
              >
                <div className="font-semibold text-lg">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Recipe */}
        {selectedCategory && (
          <div className="glass-panel p-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Escolha a Receita
            </h2>
            <div className="space-y-3">
              {filteredRecipes.length === 0 ? (
                <p className="text-slate-500 italic p-4 bg-slate-50 rounded-lg border border-slate-100">Nenhuma receita cadastrada nesta categoria.</p>
              ) : (
                filteredRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe.id)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                      selectedRecipe === recipe.id
                        ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-primary-300 text-slate-600'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-lg text-left">{recipe.name}</div>
                      <div className="text-sm opacity-80 text-left font-medium mt-1">Rende: {recipe.yield} {recipe.yieldUnit}</div>
                    </div>
                    {selectedRecipe === recipe.id && <ChevronRight className="text-primary-500" size={24} />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Quantity & Start */}
        {selectedRecipe && (
          <div className="glass-panel p-6 animate-in slide-in-from-top-4 fade-in duration-300 border-2 border-primary-100 bg-gradient-to-br from-white to-primary-50/30">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Quantidade de Receitas
            </h2>
            <div className="flex items-center space-x-4 mb-6">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-24 text-center text-3xl font-bold p-3 border-2 border-slate-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-slate-500 font-bold text-lg">vezes (x)</span>
                <span className="text-primary-600 text-sm font-medium">
                  Rendimento total: {MOCK_RECIPES.find(r => r.id === selectedRecipe)!.yield * quantity} {MOCK_RECIPES.find(r => r.id === selectedRecipe)!.yieldUnit}
                </span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center text-xl"
            >
              <PlayCircle className="mr-3" size={28} />
              Iniciar Produção
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
