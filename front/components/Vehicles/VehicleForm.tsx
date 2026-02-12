
import React, { useState, useEffect } from 'react';
import { X, Camera, Save } from 'lucide-react';
import { Vehicle, VehicleStatus, FuelType } from '../../types';

interface VehicleFormProps {
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  initialData: Vehicle | null;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    plate: '',
    chassis: '',
    mileage: 0,
    fuelType: FuelType.FLEX,
    price: 0,
    status: VehicleStatus.AVAILABLE,
    observations: '',
    entryDate: new Date().toISOString().split('T')[0],
    photos: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle: Vehicle = {
      ...formData as Vehicle,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
    };
    onSave(vehicle);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate photo upload with a placeholder
      const newPhoto = `https://picsum.photos/seed/${Math.random()}/400/300`;
      setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), newPhoto] }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Photos Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">Fotos do Veículo</label>
            <div className="flex flex-wrap gap-4">
              {formData.photos?.map((photo, idx) => (
                <div key={idx} className="relative w-32 h-24 rounded-lg overflow-hidden border border-slate-200">
                  <img src={photo} className="w-full h-full object-cover" alt="Veículo" />
                  <button 
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos?.filter((_, i) => i !== idx) }))}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="w-32 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400">
                <Camera size={24} className="mb-1" />
                <span className="text-xs font-medium">Adicionar</span>
                <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Marca *</label>
              <input 
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Ex: Toyota"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Modelo *</label>
              <input 
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Ex: Corolla"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Ano *</label>
              <input 
                required
                type="number"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Cor</label>
              <input 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Placa *</label>
              <input 
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.plate}
                onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Quilometragem</label>
              <input 
                type="number"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Combustível</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fuelType}
                onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value as FuelType }))}
              >
                {Object.values(FuelType).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Preço de Venda (R*) *</label>
              <input 
                required
                type="number"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Status</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as VehicleStatus }))}
              >
                {Object.values(VehicleStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Chassi</label>
              <input 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.chassis}
                onChange={(e) => setFormData(prev => ({ ...prev, chassis: e.target.value.toUpperCase() }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Data de Entrada</label>
              <input 
                type="date"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.entryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Observações</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Detalhes adicionais sobre o estado do veículo..."
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg shadow-blue-200"
            >
              <Save size={18} />
              <span className="font-bold">Salvar Veículo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
