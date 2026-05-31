import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import RecipeBuilder from './pages/RecipeBuilder';
import ProductionSetup from './pages/ProductionSetup';
import ExecutionMode from './pages/ExecutionMode';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="receitas" element={<Recipes />} />
          <Route path="receitas/nova" element={<RecipeBuilder />} />
          <Route path="producao" element={<ProductionSetup />} />
        </Route>
        {/* Modo Execução fora do Layout para não ter distrações */}
        <Route path="/execucao/:recipeId" element={<ExecutionMode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
