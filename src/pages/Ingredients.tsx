import { useState } from 'react';
import { useIngredients } from '../hooks/useIngredients';
import { Package, Plus, Search, Trash2, Edit2, Loader2 } from 'lucide-react';
import type { Ingredient } from '../data/mockData';

export default function Ingredients() {
  const { ingredients, loading, error, addIngredient, updateIngredient, deleteIngredient } = useIngredients();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const [packageSize, setPackageSize] = useState<number>(0);
  const [unit, setUnit] = useState<'g' | 'ml' | 'un'>('g');
  const [isSaving, setIsSaving] = useState(false);

  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewModal = () => {
    setEditingId(null);
    setName('');
    setPackagePrice(0);
    setPackageSize(0);
    setUnit('g');
    setIsModalOpen(true);
  };

  const openEditModal = (ing: Ingredient) => {
    setEditingId(ing.id);
    setName(ing.name);
    setPackagePrice(ing.packagePrice);
    setPackageSize(ing.packageSize);
    setUnit(ing.unit);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || packagePrice <= 0 || packageSize <= 0) {
      alert('Por favor preencha todos os campos corretamente com valores maiores que zero.');
      return;
    }

    try {
      setIsSaving(true);
      if (editingId) {
        await updateIngredient(editingId, { name, packagePrice, packageSize, unit });
      } else {
        await addIngredient({ name, packagePrice, packageSize, unit });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o ingrediente "${name}"?`)) {
      try {
        await deleteIngredient(id);
      } catch (err: any) {
        alert('Erro ao excluir: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center">
            <Package className="mr-3 text-primary-500" size={32} />
            Estoque / Ingredientes
          </h1>
          <p className="text-slate-500 mt-1">Gerencie os custos e os itens do seu estoque</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-sm transition-all"
        >
          <Plus size={20} className="mr-2" />
          Novo Ingrediente
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar ingrediente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500">
            <Loader2 size={32} className="animate-spin text-primary-500 mb-4" />
            <p>Carregando ingredientes...</p>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Nenhum ingrediente encontrado.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs font-bold tracking-wider">
                    <th className="p-4">Nome</th>
                    <th className="p-4">Embalagem</th>
                    <th className="p-4">Preço (R$)</th>
                    <th className="p-4">Custo Base</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIngredients.map(ing => {
                    const baseCost = ing.packagePrice / ing.packageSize;
                    return (
                      <tr key={ing.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-800">{ing.name}</td>
                        <td className="p-4 text-slate-600">{ing.packageSize} {ing.unit}</td>
                        <td className="p-4 font-medium text-slate-700">R$ {ing.packagePrice.toFixed(2).replace('.', ',')}</td>
                        <td className="p-4 text-slate-500">
                          R$ {baseCost.toFixed(4).replace('.', ',')} / {ing.unit}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => openEditModal(ing)}
                              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(ing.id, ing.name)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-slate-100">
              {filteredIngredients.map(ing => {
                const baseCost = ing.packagePrice / ing.packageSize;
                return (
                  <div key={ing.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 text-lg">{ing.name}</h3>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => openEditModal(ing)}
                          className="p-2 text-slate-400 hover:text-primary-600 active:bg-primary-50 rounded-full transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(ing.id, ing.name)}
                          className="p-2 text-slate-400 hover:text-red-600 active:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Embalagem:</span>
                      <span className="font-medium text-slate-700">{ing.packageSize} {ing.unit}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Preço Total:</span>
                      <span className="font-bold text-slate-700">R$ {ing.packagePrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg flex justify-between items-center text-xs mt-2">
                      <span className="text-slate-500">Custo:</span>
                      <span className="font-bold text-primary-600">
                        R$ {baseCost.toFixed(4).replace('.', ',')} / {ing.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 mt-10 sm:mt-0 flex flex-col max-h-[90vh]">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Editar Ingrediente' : 'Novo Ingrediente'}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto pb-safe">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Ingrediente</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Farinha de Trigo..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tamanho da Embalagem</label>
                  <input 
                    type="number" 
                    step="any"
                    value={packageSize || ''} 
                    onChange={e => setPackageSize(parseFloat(e.target.value))}
                    placeholder="Ex: 5000"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Unidade</label>
                  <select 
                    value={unit} 
                    onChange={e => setUnit(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="un">un</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Preço Total da Embalagem (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={packagePrice || ''} 
                  onChange={e => setPackagePrice(parseFloat(e.target.value))}
                  placeholder="Ex: 24.90"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              {packagePrice > 0 && packageSize > 0 && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-600 flex justify-between">
                  <span>Custo calculado:</span>
                  <span className="font-bold">R$ {(packagePrice / packageSize).toFixed(4)} / {unit}</span>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex justify-center items-center transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
