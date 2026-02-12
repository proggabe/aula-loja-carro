
import React, { useState } from 'react';
// Added missing Car import
import { Search, Plus, Edit, Trash2, Filter, MoreVertical, ExternalLink, Car } from 'lucide-react';
import { Vehicle, VehicleStatus, FuelType } from '../../types';
import VehicleForm from './VehicleForm';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

const VehicleManager: React.FC<VehicleManagerProps> = ({ vehicles, setVehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = `${v.brand} ${v.model} ${v.plate}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleSave = (vehicle: Vehicle) => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
    } else {
      setVehicles(prev => [...prev, vehicle]);
    }
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por marca, modelo ou placa..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-600 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value={VehicleStatus.AVAILABLE}>Disponíveis</option>
            <option value={VehicleStatus.SOLD}>Vendidos</option>
            <option value={VehicleStatus.RESERVED}>Reservados</option>
          </select>
          
          <button 
            onClick={() => {
              setEditingVehicle(null);
              setIsFormOpen(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span className="font-semibold">Novo Veículo</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Veículo</th>
                <th className="px-6 py-4 font-semibold">Ano/Cor</th>
                <th className="px-6 py-4 font-semibold">Placa/KM</th>
                <th className="px-6 py-4 font-semibold">Preço</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-slate-100 mr-3 flex-shrink-0 overflow-hidden">
                        {vehicle.photos.length > 0 ? (
                          <img src={vehicle.photos[0]} alt={vehicle.model} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <Car size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{vehicle.brand} {vehicle.model}</div>
                        <div className="text-xs text-slate-500 uppercase">{vehicle.fuelType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="text-sm">{vehicle.year}</div>
                    <div className="text-xs text-slate-400">{vehicle.color}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="text-sm font-medium">{vehicle.plate}</div>
                    <div className="text-xs text-slate-400">{vehicle.mileage.toLocaleString('pt-BR')} KM</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    R$ {vehicle.price.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === VehicleStatus.AVAILABLE ? 'bg-blue-100 text-blue-700' : 
                      vehicle.status === VehicleStatus.SOLD ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(vehicle)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Nenhum veículo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <VehicleForm 
          onClose={() => {
            setIsFormOpen(false);
            setEditingVehicle(null);
          }}
          onSave={handleSave}
          initialData={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehicleManager;