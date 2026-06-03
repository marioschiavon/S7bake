import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, PlayCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Receitas', path: '/receitas', icon: BookOpen },
    { name: 'Produção', path: '/producao', icon: PlayCircle },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm z-10">
        <div className="p-6 border-b border-slate-100 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mr-3 shadow-md">
            <span className="text-white font-bold text-lg">S7</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">bake</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/')
                  ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="md:hidden flex items-center p-4 bg-white border-b border-slate-200 shadow-sm z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">S7</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">bake</h1>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-4 py-3 transition-colors ${
                location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/')
                  ? 'text-primary-600'
                  : 'text-slate-400'
              }`}
            >
              <item.icon size={24} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 ${location.pathname === item.path ? 'font-semibold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
