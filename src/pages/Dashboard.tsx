import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useCategories } from '../hooks/useCategories';
import { useIngredients } from '../hooks/useIngredients';
import { useAuth } from '../contexts/AuthContext';
import { ChefHat, PlayCircle, BookOpen, Package, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recipes, loading: loadingRecipes } = useRecipes();
  const { categories } = useCategories();
  const { ingredients } = useIngredients();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Chef';

  const recentRecipes = [...recipes].slice(0, 4);

  const stats = [
    { label: 'Receitas', value: recipes.length, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'Categorias', value: categories.length, icon: ChefHat, color: 'bg-primary-50 text-primary-600' },
    { label: 'Ingredientes', value: ingredients.length, icon: Package, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Boas-vindas */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-primary-200 text-sm font-medium mb-1">Bem-vindo de volta,</p>
        <h1 className="text-3xl font-bold mb-4">{firstName} 👋</h1>
        <button
          onClick={() => navigate('/producao')}
          className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-6 rounded-xl flex items-center transition-colors shadow-sm"
        >
          <PlayCircle size={22} className="mr-2" />
          Iniciar Produção
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="glass-panel p-4 flex flex-col items-center text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Acesso rápido */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Receitas</h2>
          <button
            onClick={() => navigate('/receitas')}
            className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center"
          >
            Ver todas <ArrowRight size={16} className="ml-1" />
          </button>
        </div>

        {loadingRecipes ? (
          <div className="glass-panel p-8 text-center text-slate-400">Carregando...</div>
        ) : recentRecipes.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <ChefHat size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Nenhuma receita cadastrada ainda.</p>
            <button
              onClick={() => navigate('/receitas')}
              className="mt-4 text-primary-600 hover:text-primary-700 font-bold text-sm"
            >
              Criar primeira receita →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentRecipes.map(recipe => {
              const category = categories.find(c => c.id === recipe.categoryId);
              return (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/producao`)}
                  className="glass-panel p-5 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-primary-100 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                    <ChefHat size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{recipe.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">{category?.name ?? '—'}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {recipe.prepTimeMinutes} min
                      </span>
                    </div>
                  </div>
                  <PlayCircle size={20} className="text-primary-400 shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
