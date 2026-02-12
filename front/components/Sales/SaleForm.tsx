
import React, { useState } from 'react';
import { X, Check, Search, Car, User as UserIcon, CreditCard, ShoppingCart } from 'lucide-react';
import { Sale, Vehicle, Client, SaleStatus, User } from '../../types';

interface SaleFormProps {
  onClose: () => void;
  onSave: (sale: Sale) => void;
  vehicles: Vehicle[];
  clients: Client[];
  currentUser: User;
}

const SaleForm: React.FC<SaleFormProps> = ({ onClose, onSave, vehicles, clients, currentUser }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [saleValue, setSaleValue] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('À Vista');
  const [observations, setObservations] = useState('');
  
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  const filteredVehicles = vehicles.filter(v => 
    `${v.brand} ${v.model}`.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
    c.document.includes(clientSearch)
  );

  const handleSelectVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    setSaleValue(v.price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedClient) return;

    const sale: Sale = {
      id: `V${Math.floor(Math.random() * 10000)}`,
      clientId: selectedClient.id,
      vehicleId: selectedVehicle.id,
      date: new Date().toISOString().split('T')[0],
      value: saleValue,
      paymentMethod,
      sellerName: currentUser.name,
      status: SaleStatus.COMPLETED,
      observations
    };

    onSave(sale);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-600 text-white">
          <div className="flex items-center space-x-3">
            <ShoppingCart size={24} />
            <h3 className="text-xl font-bold">Registrar Nova Venda</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                <Car size={16} className="mr-2" /> 1. Selecionar Veículo
              </label>
              {selectedVehicle ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-blue-900">{selectedVehicle.brand} {selectedVehicle.model}</div>
                    <div className="text-xs text-blue-700">Placa: {selectedVehicle.plate} | Preço sugerido: R$ {selectedVehicle.price.toLocaleString('pt-BR')}</div>
                  </div>
                  <button type="button" onClick={() => setSelectedVehicle(null)} className="text-blue-500 hover:text-blue-700 font-bold text-sm underline">Trocar</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar veículo disponível..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
                      value={vehicleSearch}
                      onChange={(e) => setVehicleSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50">
                    {filteredVehicles.map(v => (
                      <button 
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectVehicle(v)}
                        className="w-full text-left p-3 hover:bg-slate-50 text-sm flex justify-between items-center"
                      >
                        <span className="font-medium">{v.brand} {v.model} ({v.year})</span>
                        <span className="text-slate-500">R$ {v.price.toLocaleString('pt-BR')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                <UserIcon size={16} className="mr-2" /> 2. Selecionar Cliente
              </label>
              {selectedClient ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-900">{selectedClient.name}</div>
                    <div className="text-xs text-emerald-700">CPF/CNPJ: {selectedClient.document}</div>
                  </div>
                  <button type="button" onClick={() => setSelectedClient(null)} className="text-emerald-500 hover:text-emerald-700 font-bold text-sm underline">Trocar</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar cliente..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50">
                    {filteredClients.map(c => (
                      <button 
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedClient(c)}
                        className="w-full text-left p-3 hover:bg-slate-50 text-sm"
                      >
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.document}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
            <h4 className="font-bold text-slate-800 flex items-center">
              <CreditCard size={18} className="mr-2" /> Detalhes do Pagamento
            </h4>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Valor Final de Venda (R$)</label>
              <input 
                required
                type="number"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-2xl font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={saleValue}
                onChange={(e) => setSaleValue(parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Forma de Pagamento</label>
              <select 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>À Vista (PIX/Ted)</option>
                <option>Financiamento Bancário</option>
                <option>Consórcio Contemplado</option>
                <option>Troca com Troco</option>
                <option>Cartão de Crédito</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Observações da Venda</label>
              <textarea 
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none"
                rows={3}
                placeholder="Ex: Cliente deu veículo de entrada, desconto de R$ 500 para reparo..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Vendedor: {currentUser.name}</p>
              <button 
                type="submit" 
                disabled={!selectedVehicle || !selectedClient}
                className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all ${
                  (!selectedVehicle || !selectedClient) 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                }`}
              >
                <Check size={20} className="font-bold" />
                <span className="text-lg font-bold">Concluir Venda</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
