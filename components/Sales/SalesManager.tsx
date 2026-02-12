
import React, { useState } from 'react';
import { ShoppingCart, Plus, Calendar, FileText, Search, User as UserIcon, Car } from 'lucide-react';
import { Sale, Vehicle, Client, VehicleStatus, SaleStatus, User } from '../../types';
import SaleForm from './SaleForm';

interface SalesManagerProps {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  clients: Client[];
  currentUser: User;
}

const SalesManager: React.FC<SalesManagerProps> = ({ sales, setSales, vehicles, setVehicles, clients, currentUser }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(sale => {
    const client = clients.find(c => c.id === sale.clientId);
    const vehicle = vehicles.find(v => v.id === sale.vehicleId);
    return (
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleNewSale = (sale: Sale) => {
    setSales(prev => [...prev, sale]);
    setVehicles(prev => prev.map(v => v.id === sale.vehicleId ? { ...v, status: VehicleStatus.SOLD } : v));
    setIsFormOpen(false);
  };

  const cancelSale = (saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    if (confirm('Tem certeza que deseja cancelar esta venda? O veículo voltará ao estoque como disponível.')) {
      setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: SaleStatus.CANCELLED } : s));
      setVehicles(prev => prev.map(v => v.id === sale.vehicleId ? { ...v, status: VehicleStatus.AVAILABLE } : v));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar vendas por cliente, veículo ou vendedor..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors shadow-sm font-semibold"
        >
          <ShoppingCart size={18} />
          <span>Registrar Venda</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSales.map((sale) => {
          const client = clients.find(c => c.id === sale.clientId);
          const vehicle = vehicles.find(v => v.id === sale.vehicleId);
          
          return (
            <div key={sale.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-colors">
              <div className="flex-1 flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${sale.status === SaleStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">#{sale.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sale.status === SaleStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {sale.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{client?.name || 'Cliente Removido'}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center text-sm text-slate-500">
                      <Car size={14} className="mr-1" />
                      {vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : 'Veículo Removido'}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar size={14} className="mr-1" />
                      {new Date(sale.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <UserIcon size={14} className="mr-1" />
                      Vendedor: {sale.sellerName}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                <div className="text-xl font-black text-slate-900">
                  R$ {sale.value.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-slate-400 italic">
                  Pagamento: {sale.paymentMethod}
                </div>
              </div>

              <div className="flex items-center space-x-2 md:pl-6 md:border-l border-slate-100">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver Contrato">
                  <FileText size={18} />
                </button>
                {sale.status === SaleStatus.COMPLETED && (
                  <button 
                    onClick={() => cancelSale(sale.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancelar Venda"
                  >
                    <Plus size={18} className="rotate-45" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredSales.length === 0 && (
          <div className="py-20 text-center bg-white rounded-xl border border-slate-200">
            <ShoppingCart size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-medium text-slate-400">Nenhuma venda encontrada.</h3>
          </div>
        )}
      </div>

      {isFormOpen && (
        <SaleForm 
          onClose={() => setIsFormOpen(false)}
          onSave={handleNewSale}
          vehicles={vehicles.filter(v => v.status === VehicleStatus.AVAILABLE)}
          clients={clients}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default SalesManager;
