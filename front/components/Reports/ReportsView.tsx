
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Download, Filter, Printer, Calendar } from 'lucide-react';
import { Sale, Vehicle, Client, SaleStatus, VehicleStatus } from '../../types';

interface ReportsViewProps {
  sales: Sale[];
  vehicles: Vehicle[];
  clients: Client[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ sales, vehicles, clients }) => {
  const [dateRange, setDateRange] = useState('month');

  const completedSales = sales.filter(s => s.status === SaleStatus.COMPLETED);
  const totalRevenue = completedSales.reduce((acc, s) => acc + s.value, 0);
  
  // Aggregate sales by month (simplified)
  const salesByMonth = [
    { month: 'Janeiro', total: 420000 },
    { month: 'Fevereiro', total: 380000 },
    { month: 'Março', total: 510000 },
    { month: 'Abril', total: totalRevenue },
  ];

  // Stock composition data
  const stockByCategory = [
    { name: 'Disponível', value: vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length, color: '#3b82f6' },
    { name: 'Vendido', value: vehicles.filter(v => v.status === VehicleStatus.SOLD).length, color: '#10b981' },
    { name: 'Reservado', value: vehicles.filter(v => v.status === VehicleStatus.RESERVED).length, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white border border-slate-200 p-1 rounded-lg flex">
            <button 
              onClick={() => setDateRange('week')}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${dateRange === 'week' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setDateRange('month')}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${dateRange === 'month' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Mês
            </button>
            <button 
              onClick={() => setDateRange('year')}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${dateRange === 'year' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Ano
            </button>
          </div>
          <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 text-sm font-medium border border-slate-200 px-3 py-2 rounded-lg bg-white">
            <Calendar size={16} />
            <span>Personalizar</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <Download size={16} />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Receita de Vendas por Período</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Composição do Inventário</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportMetricCard label="Ticket Médio" value={`R$ ${(totalRevenue / (completedSales.length || 1)).toLocaleString('pt-BR')}`} color="blue" />
        <ReportMetricCard label="Conversão de Leads" value="18.5%" color="emerald" />
        <ReportMetricCard label="Tempo Médio Estoque" value="32 dias" color="purple" />
      </div>
    </div>
  );
};

const ReportMetricCard: React.FC<{ label: string; value: string; color: 'blue' | 'emerald' | 'purple' }> = ({ label, value, color }) => {
  const colors = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    purple: 'border-purple-100 bg-purple-50 text-purple-700',
  };
  return (
    <div className={`p-6 rounded-xl border ${colors[color]} text-center shadow-sm`}>
      <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{label}</div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
};

export default ReportsView;
