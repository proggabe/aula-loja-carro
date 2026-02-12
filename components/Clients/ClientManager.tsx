
import React, { useState } from 'react';
import { Search, Plus, UserPlus, Phone, Mail, MapPin, Eye, Trash2, Edit } from 'lucide-react';
import { Client, Sale } from '../../types';
import ClientForm from './ClientForm';

interface ClientManagerProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  sales: Sale[];
}

const ClientManager: React.FC<ClientManagerProps> = ({ clients, setClients, sales }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.document.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleSave = (client: Client) => {
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === client.id ? client : c));
    } else {
      setClients(prev => [...prev, client]);
    }
    setIsFormOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF/CNPJ ou email..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => {
            setEditingClient(null);
            setIsFormOpen(true);
          }}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-semibold"
        >
          <UserPlus size={18} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const clientSalesCount = sales.filter(s => s.clientId === client.id).length;
          return (
            <div key={client.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:border-indigo-300 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                  {client.name.charAt(0)}
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(client)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(client.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 mb-1">{client.name}</h4>
              <p className="text-xs text-slate-400 font-medium mb-4">{client.document}</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-600">
                  <Phone size={14} className="mr-2 text-slate-400" />
                  {client.phone}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Mail size={14} className="mr-2 text-slate-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin size={14} className="mr-2 text-slate-400" />
                  {client.city} - {client.state}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-indigo-600">{clientSalesCount}</span>
                  <span className="text-slate-400"> compras realizadas</span>
                </div>
                <button className="text-indigo-600 text-xs font-bold hover:underline flex items-center">
                  Ver Histórico
                  <Eye size={12} className="ml-1" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredClients.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>

      {isFormOpen && (
        <ClientForm 
          onClose={() => {
            setIsFormOpen(false);
            setEditingClient(null);
          }}
          onSave={handleSave}
          initialData={editingClient}
        />
      )}
    </div>
  );
};

export default ClientManager;
