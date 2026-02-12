
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Users, 
  ShoppingBag, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { Vehicle, Sale, Client, VehicleStatus, SaleStatus } from '../types';

interface DashboardProps {
  stats: {
    totalSales: number;
    availableStock: number;
    soldCount: number;
    staleStock: number;
  };
  vehicles: Vehicle[];
  sales: Sale[];
  clients: Client[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, vehicles, sales, clients }) => {
  // Chart Data preparation
  const salesByStatus = [
    { name: 'Disponível', value: stats.availableStock, color: '#3b82f6' },
    { name: 'Vendido', value: stats.soldCount, color: '#10b981' },
    { name: 'Reservado', value: vehicles.filter(v => v.status === VehicleStatus.RESERVED).length, color: '#f59e0b' },
  ];

  // Last 6 months sales data (mock generator based on actual sales)
  const monthlySalesData = [
    { month: 'Jul', sales: 450000 },
    { month: 'Ago', sales: 520000 },
    { month: 'Set', sales: 380000 },
    { month: 'Out', sales: 610000 },
    { month: 'Nov', sales: 580000 },
    { month: 'Dez', sales: stats.totalSales },
  ];

  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Receita Total" 
          value={`R$ ${stats.totalSales.toLocaleString('pt-BR')}`}
          icon={<ShoppingBag className="text-blue-600" />}
          trend="+12.5% em relação ao mês anterior"
          trendUp={true}
        />
        <StatCard 
          title="Estoque Atual" 
          value={stats.availableStock.toString()}
          icon={<Car className="text-emerald-600" />}
          trend={`${vehicles.length} veículos totais`}
          trendUp={true}
        />
        <StatCard 
          title="Novos Clientes" 
          value={clients.length.toString()}
          icon={<Users className="text-purple-600" />}
          trend="+3 essa semana"
          trendUp={true}
        />
        <StatCard 
          title="Estoque Parado" 
          value={stats.staleStock.toString()}
          icon={<AlertTriangle className="text-amber-600" />}
          trend="Há mais de 60 dias"
          trendUp={false}
          highlight={stats.staleStock > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Evolução de Vendas (R$)</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">Ver Detalhes</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Composition */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Status do Estoque</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {salesByStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Vendas Recentes</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">Ver tudo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Veículo</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.map((sale) => {
                const client = clients.find(c => c.id === sale.clientId);
                const vehicle = vehicles.find(v => v.id === sale.vehicleId);
                return (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{client?.name || 'Excluído'}</td>
                    <td className="px-6 py-4 text-slate-600">{vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Excluído'}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">R$ {sale.value.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.status === SaleStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 
                        sale.status === SaleStatus.CANCELLED ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentSales.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">Nenhuma venda registrada recentemente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend: string; 
  trendUp: boolean;
  highlight?: boolean;
}> = ({ title, value, icon, trend, trendUp, highlight }) => (
  <div className={`bg-white p-6 rounded-xl border ${highlight ? 'border-amber-300 bg-amber-50' : 'border-slate-200'} shadow-sm`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${highlight ? 'bg-amber-100' : 'bg-slate-100'}`}>
        {icon}
      </div>
      <ArrowUpRight size={18} className={trendUp ? 'text-emerald-500' : 'text-slate-400'} />
    </div>
    <h4 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-tight">{title}</h4>
    <div className="text-2xl font-bold text-slate-900 mb-2">{value}</div>
    <div className={`text-xs flex items-center ${trendUp ? 'text-emerald-600' : highlight ? 'text-amber-700' : 'text-slate-400'}`}>
      {trendUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
      {trend}
    </div>
  </div>
);

export default Dashboard;
