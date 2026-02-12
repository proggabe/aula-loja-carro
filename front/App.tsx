
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronLeft
} from 'lucide-react';
import { 
  Vehicle, 
  Client, 
  Sale, 
  User, 
  VehicleStatus, 
  UserRole, 
  SaleStatus 
} from './types';
import { 
  INITIAL_VEHICLES, 
  INITIAL_CLIENTS, 
  INITIAL_SALES 
} from './constants';
import Dashboard from './components/Dashboard';
import VehicleManager from './components/Vehicles/VehicleManager';
import ClientManager from './components/Clients/ClientManager';
import SalesManager from './components/Sales/SalesManager';
import ReportsView from './components/Reports/ReportsView';
import Auth from './components/Auth/Auth';

const App: React.FC = () => {
  const [activeUser, setActiveUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('am_active_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vehicles' | 'clients' | 'sales' | 'reports'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  
  // App State (Persisted in LocalStorage)
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('am_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });
  
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('am_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('am_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  useEffect(() => {
    localStorage.setItem('am_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('am_clients', JSON.stringify(clients));
    localStorage.setItem('am_sales', JSON.stringify(sales));
  }, [vehicles, clients, sales]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('am_active_session', JSON.stringify(activeUser));
    } else {
      localStorage.removeItem('am_active_session');
    }
  }, [activeUser]);

  const stats = useMemo(() => {
    const totalSales = sales.reduce((acc, sale) => sale.status === SaleStatus.COMPLETED ? acc + sale.value : acc, 0);
    const availableStock = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length;
    const soldCount = vehicles.filter(v => v.status === VehicleStatus.SOLD).length;
    
    const today = new Date();
    const staleStock = vehicles.filter(v => {
      const entry = new Date(v.entryDate);
      const diffTime = Math.abs(today.getTime() - entry.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return v.status === VehicleStatus.AVAILABLE && diffDays > 60;
    }).length;

    return { totalSales, availableStock, soldCount, staleStock };
  }, [vehicles, sales]);

  const handleLogin = (user: User) => {
    setActiveUser(user);
  };

  const handleLogout = () => {
    setActiveUser(null);
    setActiveTab('dashboard');
  };

  if (!activeUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Veículos', icon: Car },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'sales', label: 'Vendas', icon: ShoppingBag },
    { id: 'reports', label: 'Relatórios', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.FINANCE] },
  ];

  const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(activeUser.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-slate-900 text-white transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-xl z-20`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50 h-20">
          <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
              AutoManager<span className="text-blue-500">Pro</span>
            </h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              title={!sidebarOpen ? item.label : undefined}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              } ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <item.icon size={22} className={`${sidebarOpen ? 'mr-3' : 'mx-0'} transition-all`} />
              <span className={`font-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden ml-0'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800/50 bg-slate-900/50">
          <div className={`flex items-center rounded-lg p-2 ${sidebarOpen ? 'justify-between hover:bg-slate-800/30' : 'justify-center'}`}>
            <div className={`flex items-center overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                {activeUser.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">{activeUser.name}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{activeUser.role}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className={`p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all ${!sidebarOpen ? 'mx-auto' : ''}`}
              title="Sair do sistema"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between h-20">
          <h2 className="text-2xl font-bold text-slate-800 capitalize">
            {navItems.find(item => item.id === activeTab)?.label || 'Painel'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
                <Bell size={20} />
                {stats.staleStock > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          {activeTab === 'dashboard' && <Dashboard stats={stats} vehicles={vehicles} sales={sales} clients={clients} />}
          {activeTab === 'vehicles' && <VehicleManager vehicles={vehicles} setVehicles={setVehicles} />}
          {activeTab === 'clients' && <ClientManager clients={clients} setClients={setClients} sales={sales} />}
          {activeTab === 'sales' && <SalesManager sales={sales} setSales={setSales} vehicles={vehicles} setVehicles={setVehicles} clients={clients} currentUser={activeUser} />}
          {activeTab === 'reports' && <ReportsView sales={sales} vehicles={vehicles} clients={clients} />}
        </div>
      </main>
    </div>
  );
};

export default App;
