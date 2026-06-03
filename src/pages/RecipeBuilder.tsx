import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { MOCK_INGREDIENTS } from '../data/mockData';
import type { WorkflowNode, Recipe } from '../data/mockData';
import { ArrowLeft, Save, Clock, List, AlignLeft, Trash2, GripVertical } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import { useCategories } from '../hooks/useCategories';

export default function RecipeBuilder() {
  const navigate = useNavigate();
  const { recipes, addRecipe, updateRecipe } = useRecipes();
  const { categories } = useCategories();
  const [searchParams] = useSearchParams();
  const { recipeId } = useParams();
  
  const initialCategoryId = searchParams.get('categoryId') || '';

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [recipeYield, setRecipeYield] = useState<number>(1);
  const [yieldUnit, setYieldUnit] = useState('unidade(s)');
  const [prepTime, setPrepTime] = useState<number>(60);
  
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  
  // Load existing recipe if in edit mode
  useEffect(() => {
    if (recipeId) {
      const existingRecipe = recipes.find(r => r.id === recipeId);
      if (existingRecipe) {
        setName(existingRecipe.name);
        setCategoryId(existingRecipe.categoryId);
        setRecipeYield(existingRecipe.yield);
        setYieldUnit(existingRecipe.yieldUnit);
        setPrepTime(existingRecipe.prepTimeMinutes);
        setNodes(existingRecipe.nodes);
      }
    }
  }, [recipeId, recipes]);

  const handleAddNode = (type: 'ingredients' | 'instruction' | 'timer') => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      content: '',
      duration: 0,
      ingredients: []
    };
    
    if (type === 'ingredients') newNode.content = 'Separe os ingredientes';
    if (type === 'timer') newNode.duration = 600; // 10 mins

    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const updateNode = (id: string, updates: Partial<WorkflowNode>) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const addIngredientToNode = (nodeId: string, ingredientId: string) => {
    setNodes(nodes.map(n => {
      if (n.id === nodeId && n.type === 'ingredients') {
        const currentIngs = n.ingredients || [];
        if (!currentIngs.find(i => i.ingredientId === ingredientId)) {
          return { ...n, ingredients: [...currentIngs, { ingredientId, quantity: 0 }] };
        }
      }
      return n;
    }));
  };

  const updateIngredientQuantity = (nodeId: string, ingredientId: string, quantity: number) => {
    setNodes(nodes.map(n => {
      if (n.id === nodeId && n.type === 'ingredients') {
        return {
          ...n,
          ingredients: n.ingredients?.map(i => i.ingredientId === ingredientId ? { ...i, quantity } : i)
        };
      }
      return n;
    }));
  };

  const removeIngredient = (nodeId: string, ingredientId: string) => {
    setNodes(nodes.map(n => {
      if (n.id === nodeId && n.type === 'ingredients') {
        return {
          ...n,
          ingredients: n.ingredients?.filter(i => i.ingredientId !== ingredientId)
        };
      }
      return n;
    }));
  };

  const handleSave = () => {
    if (!name.trim() || !categoryId) {
      alert('Preencha o nome e a categoria da receita.');
      return;
    }

    const recipeData = {
      name,
      categoryId,
      yield: recipeYield,
      yieldUnit,
      prepTimeMinutes: prepTime,
      nodes,
    };

    if (recipeId) {
      updateRecipe(recipeId, recipeData);
    } else {
      addRecipe(recipeData);
    }
    
    navigate('/receitas');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 text-slate-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {recipeId ? 'Editar Template de Produção' : 'Criar Template de Produção'}
            </h1>
            <p className="text-slate-500 text-sm">Configure o cabeçalho e construa o fluxo da receita em blocos.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center"
        >
          <Save size={20} className="mr-2" />
          Salvar
        </button>
      </div>

      {/* Cabeçalho da Receita */}
      <div className="glass-panel p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Dados Principais</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Receita</label>
            <input 
              type="text" 
              value={name} onChange={e => setName(e.target.value)}
              placeholder="Ex: Pão Caseiro Tradicional"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Categoria</label>
            <select 
              value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tempo Total (minutos)</label>
            <input 
              type="number" 
              value={prepTime} onChange={e => setPrepTime(parseInt(e.target.value) || 0)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/3">
              <label className="block text-sm font-bold text-slate-700 mb-1">Rende</label>
              <input 
                type="number" 
                value={recipeYield} onChange={e => setRecipeYield(parseInt(e.target.value) || 1)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Unidade</label>
              <input 
                type="text" 
                value={yieldUnit} onChange={e => setYieldUnit(e.target.value)}
                placeholder="ex: pães, pedaços"
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Editor de Fluxo */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            Motor de Workflow (Passo a Passo)
          </h2>
        </div>

        {/* Lista de Nodes */}
        <div className="space-y-4">
          {nodes.length === 0 && (
            <div className="text-center p-12 glass-panel border-dashed border-2 border-slate-300">
              <div className="text-slate-300 mb-4 flex justify-center"><List size={48} /></div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Seu fluxo está vazio</h3>
              <p className="text-slate-500">Adicione os blocos abaixo para construir a linha de produção desta receita.</p>
            </div>
          )}

          {nodes.map((node, index) => (
            <div key={node.id} className="glass-panel p-5 border border-slate-200 relative group flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col items-center pt-2 text-slate-300 cursor-grab hover:text-slate-500">
                <GripVertical size={20} />
                <div className="mt-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                  {index + 1}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {node.type === 'ingredients' && <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg flex items-center"><List size={14} className="mr-1"/> Ingredientes</span>}
                    {node.type === 'instruction' && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-lg flex items-center"><AlignLeft size={14} className="mr-1"/> Instrução</span>}
                    {node.type === 'timer' && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-bold rounded-lg flex items-center"><Clock size={14} className="mr-1"/> Timer</span>}
                  </div>
                  <button onClick={() => removeNode(node.id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>

                {node.type === 'instruction' && (
                  <textarea
                    value={node.content}
                    onChange={(e) => updateNode(node.id, { content: e.target.value })}
                    placeholder="Digite a instrução clara para o operador... (ex: Sove a massa até ficar lisa)"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none min-h-[100px]"
                  />
                )}

                {node.type === 'timer' && (
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={node.content}
                        onChange={(e) => updateNode(node.id, { content: e.target.value })}
                        placeholder="Nome do processo (ex: Tempo de Forno, Fermentação)"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div className="w-full sm:w-48 flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-2 shrink-0">
                      <input
                        type="number"
                        min="1"
                        value={Math.floor((node.duration || 0) / 60)}
                        onChange={(e) => updateNode(node.id, { duration: parseInt(e.target.value) * 60 })}
                        className="w-full text-right p-1 bg-transparent font-bold outline-none"
                      />
                      <span className="text-slate-500 font-medium pr-2">minutos</span>
                    </div>
                  </div>
                )}

                {node.type === 'ingredients' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      {node.ingredients?.length === 0 ? (
                        <p className="text-sm text-slate-500 italic text-center py-2">Nenhum ingrediente adicionado. Use a busca abaixo.</p>
                      ) : (
                        <div className="space-y-2">
                          {node.ingredients?.map(req => {
                            const ing = MOCK_INGREDIENTS.find(i => i.id === req.ingredientId);
                            return (
                              <div key={req.ingredientId} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                <span className="font-medium text-slate-700">{ing?.name}</span>
                                <div className="flex items-center space-x-3">
                                  <input 
                                    type="number" 
                                    value={req.quantity}
                                    onChange={(e) => updateIngredientQuantity(node.id, req.ingredientId, parseFloat(e.target.value))}
                                    className="w-24 p-1.5 border border-slate-200 rounded-md text-right focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-700"
                                  />
                                  <span className="text-slate-500 w-8 font-medium">{ing?.unit}</span>
                                  <button onClick={() => removeIngredient(node.id, req.ingredientId)} className="text-slate-400 hover:text-red-500 p-1">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      <select 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                        onChange={(e) => {
                          if (e.target.value) {
                            addIngredientToNode(node.id, e.target.value);
                            e.target.value = ''; // reset after selection
                          }
                        }}
                      >
                        <option value="">+ Adicionar Ingrediente do Estoque...</option>
                        {MOCK_INGREDIENTS.filter(i => !node.ingredients?.find(ni => ni.ingredientId === i.id)).map(ing => (
                          <option key={ing.id} value={ing.id}>{ing.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botões de Adição de Nós */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button onClick={() => handleAddNode('ingredients')} className="flex-1 bg-white border-2 border-slate-200 hover:border-green-400 hover:bg-green-50 text-slate-700 hover:text-green-700 p-4 rounded-2xl flex flex-col items-center justify-center transition-all group shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <List className="text-green-600" />
            </div>
            <span className="font-bold">Adicionar Ingredientes</span>
          </button>
          
          <button onClick={() => handleAddNode('instruction')} className="flex-1 bg-white border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 p-4 rounded-2xl flex flex-col items-center justify-center transition-all group shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <AlignLeft className="text-blue-600" />
            </div>
            <span className="font-bold">Adicionar Instrução</span>
          </button>

          <button onClick={() => handleAddNode('timer')} className="flex-1 bg-white border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:text-amber-700 p-4 rounded-2xl flex flex-col items-center justify-center transition-all group shadow-sm">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Clock className="text-amber-600" />
            </div>
            <span className="font-bold">Adicionar Timer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
