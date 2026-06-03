import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import RecipeBuilder from './pages/RecipeBuilder';
import ProductionSetup from './pages/ProductionSetup';
import ExecutionMode from './pages/ExecutionMode';
import Login from './pages/Login';
import Register from './pages/Register';
import Ingredients from './pages/Ingredients';
import MigrationManager from './components/MigrationManager';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><MigrationManager /><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="receitas" element={<Recipes />} />
            <Route path="receitas/nova" element={<RecipeBuilder />} />
            <Route path="receitas/editar/:recipeId" element={<RecipeBuilder />} />
            <Route path="ingredientes" element={<Ingredients />} />
            <Route path="producao" element={<ProductionSetup />} />
          </Route>
          
          {/* Modo Execução fora do Layout para não ter distrações */}
          <Route 
            path="/execucao/:recipeId" 
            element={
              <ProtectedRoute>
                <ExecutionMode />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
