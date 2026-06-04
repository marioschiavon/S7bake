import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MEASURE_UNITS } from '../data/mockData';
import { useRecipes } from '../hooks/useRecipes';
import { useIngredients } from '../hooks/useIngredients';
import { Check, CheckCircle2, Play, Pause, ChevronLeft, ChevronRight, Flag } from 'lucide-react';

export default function ExecutionMode() {
  const { recipeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const qty = parseInt(searchParams.get('qty') || '1');

  const { recipes } = useRecipes();
  const recipe = recipes.find(r => r.id === recipeId);
  const { ingredients: dbIngredients, loading: loadingIngredients } = useIngredients();

  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    if (recipe && recipe.nodes[currentNodeIndex]?.type === 'timer') {
      setTimeLeft(recipe.nodes[currentNodeIndex].duration || 0);
      setIsTimerRunning(false);
      setTimerDone(false);
    }
  }, [currentNodeIndex, recipe]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      setTimerDone(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const executionNodes = useMemo(() => {
    if (!recipe) return [];
    const nodes: any[] = [];
    if (recipe.ingredients?.length) {
      nodes.push({ id: 'mise-en-place', type: 'ingredients' as const, ingredients: recipe.ingredients });
    }
    nodes.push(...recipe.nodes);
    return nodes;
  }, [recipe]);

  if (!recipe) return <div className="p-8 text-center text-white bg-slate-900 h-screen flex items-center justify-center">Receita não encontrada.</div>;
  if (loadingIngredients) return <div className="p-8 text-center text-white bg-slate-900 h-screen flex items-center justify-center">Carregando produção...</div>;

  const nodes = executionNodes;
  const currentNode = nodes[currentNodeIndex];
  const isLastNode = currentNodeIndex === nodes.length - 1;
  const isFinished = currentNodeIndex >= nodes.length;

  const isCurrentNodeComplete = () => {
    if (!currentNode) return false;
    if (currentNode.type === 'ingredients') {
      return currentNode.ingredients?.every((i: any) => checkedIngredients.has(i.ingredientId)) ?? true;
    }
    return true;
  };

  const handleNext = () => setCurrentNodeIndex(prev => prev + 1);
  const handlePrev = () => setCurrentNodeIndex(prev => Math.max(0, prev - 1));

  const toggleIngredient = (id: string) => {
    const newSet = new Set(checkedIngredients);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setCheckedIngredients(newSet);
  };

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && isCurrentNodeComplete() && !isLastNode) handleNext();
    if (distance < -minSwipeDistance && currentNodeIndex > 0) handlePrev();
  };

  const totalCost = recipe.ingredients?.reduce((total, req) => {
    const ing = dbIngredients.find(i => i.id === req.ingredientId);
    if (!ing) return total;
    return total + ((ing.packagePrice / ing.packageSize) * req.quantity * qty);
  }, 0) ?? 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatQty = (req: any) => {
    const ing = dbIngredients.find(i => i.id === req.ingredientId);
    const totalQty = req.quantity * qty;
    if (req.measureUnit && req.measureAmount && !['g', 'ml', 'un'].includes(req.measureUnit)) {
      const unitDef = MEASURE_UNITS.find(u => u.id === req.measureUnit);
      if (unitDef) {
        const measureName = unitDef.name.split(' (')[0];
        return `${req.measureAmount * qty} ${measureName} (${totalQty}${ing?.unit ?? ''})`;
      }
    }
    return `${totalQty} ${ing?.unit ?? ''}`;
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-in zoom-in duration-500">
          <Check size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-center">Produção Concluída!</h1>
        <p className="text-slate-400 text-xl mb-8 text-center">{recipe.name} • {recipe.yield * qty} {recipe.yieldUnit}</p>

        <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm mb-8 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Custo Total:</span>
            <span className="text-2xl font-bold text-red-400">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <span className="text-slate-400">Custo Unitário:</span>
            <span className="text-xl font-bold text-slate-200">
              R$ {(totalCost / (recipe.yield * qty)).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 px-12 rounded-xl text-xl transition-colors"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-950 p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <button onClick={() => navigate('/producao')} className="text-slate-400 hover:text-white p-2 transition-colors">
          <ChevronLeft size={28} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white truncate px-4">{recipe.name}</h1>
          <p className="text-sm text-primary-400 font-medium">Passo {currentNodeIndex + 1} de {nodes.length}</p>
        </div>
        <div className="w-12 text-right">
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md font-bold">x{qty}</span>
        </div>
      </header>

      {/* Main */}
      <main
        className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full pb-32 overflow-y-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-8 overflow-hidden shrink-0">
          <div
            className="bg-primary-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentNodeIndex / nodes.length) * 100}%` }}
          />
        </div>

        {/* Node Content */}
        <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-300" key={currentNode.id}>

          {/* ── MISE EN PLACE ── */}
          {currentNode.type === 'ingredients' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Separe os Ingredientes</h2>
                <p className="text-slate-400 mt-2">Marque cada item conforme for separando</p>
              </div>
              <div className="space-y-3">
                {currentNode.ingredients?.map((req: any) => {
                  const ing = dbIngredients.find(i => i.id === req.ingredientId);
                  const isChecked = checkedIngredients.has(req.ingredientId);
                  return (
                    <div
                      key={req.ingredientId}
                      onClick={() => toggleIngredient(req.ingredientId)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isChecked ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'border-green-500 bg-green-500' : 'border-slate-500'
                        }`}>
                          {isChecked && <Check size={18} className="text-white" />}
                        </div>
                        <span className={`text-xl font-medium transition-colors ${isChecked ? 'text-slate-400 line-through' : 'text-white'}`}>
                          {ing?.name ?? req.ingredientId}
                        </span>
                      </div>
                      <span className={`text-xl font-bold ${isChecked ? 'text-slate-500' : 'text-primary-400'}`}>
                        {formatQty(req)}
                      </span>
                    </div>
                  );
                })}
              </div>
              {currentNode.ingredients && checkedIngredients.size < currentNode.ingredients.length && (
                <p className="text-center text-slate-500 text-sm pt-2">
                  {checkedIngredients.size} de {currentNode.ingredients.length} separados
                </p>
              )}
            </div>
          )}

          {/* ── INSTRUÇÃO ── */}
          {currentNode.type === 'instruction' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-primary-400 mb-6">
                  <Flag size={40} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {currentNode.content}
                </h2>
              </div>

              {currentNode.linkedIngredients?.length > 0 && (
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                  <h3 className="text-primary-400 font-bold mb-4 text-base uppercase tracking-wider">Ingredientes deste passo</h3>
                  <div className="flex flex-wrap gap-3">
                    {currentNode.linkedIngredients.map((ingId: string) => {
                      const req = recipe.ingredients?.find(i => i.ingredientId === ingId);
                      const ing = dbIngredients.find(i => i.id === ingId);
                      if (!ing) return null;
                      return (
                        <div key={ingId} className="bg-slate-700/60 px-4 py-2.5 rounded-xl border border-slate-600 flex items-center gap-2">
                          <span className="text-white font-medium">{ing.name}</span>
                          {req && (
                            <>
                              <span className="text-slate-500">·</span>
                              <span className="text-primary-300 font-bold">{formatQty(req)}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TIMER ── */}
          {currentNode.type === 'timer' && (
            <div className="text-center space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-300">{currentNode.content}</h2>

              <div className={`text-[5rem] sm:text-[7rem] font-black tabular-nums tracking-tighter leading-none transition-colors ${
                timerDone ? 'text-green-400' : timeLeft <= 30 && timeLeft > 0 ? 'text-amber-400' : 'text-white'
              }`}>
                {formatTime(timeLeft)}
              </div>

              {timerDone && (
                <p className="text-green-400 font-bold text-xl animate-in fade-in duration-500">Tempo concluído! ✓</p>
              )}

              {!timerDone && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                      isTimerRunning ? 'bg-amber-500 hover:bg-amber-400' : 'bg-green-500 hover:bg-green-400'
                    }`}
                  >
                    {isTimerRunning ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentNodeIndex === 0}
            className="py-3 px-5 rounded-xl font-bold flex items-center transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="hidden sm:flex flex-col items-center">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Custo</span>
            <span className="text-red-400 font-bold text-lg">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={!isCurrentNodeComplete()}
            className={`flex-1 sm:flex-none py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
              isCurrentNodeComplete()
                ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(213,90,104,0.3)] active:scale-95'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isLastNode ? 'Finalizar' : 'Próximo'}</span>
            {isLastNode ? <CheckCircle2 className="ml-2" size={22} /> : <ChevronRight className="ml-2" size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
}
