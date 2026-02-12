
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@automanager.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            AutoManager<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-slate-400">Entre com suas credenciais para acessar o sistema.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  className="w-full bg-slate-800 border border-slate-700 text-white px-10 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="admin@automanager.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  className="w-full bg-slate-800 border border-slate-700 text-white px-10 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-2 text-right">
                <button type="button" className="text-xs text-blue-400 hover:text-blue-300 font-medium">Esqueceu a senha?</button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-900/20 group"
            >
              <span>Acessar Sistema</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">Acesso Demonstrativo</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => { setEmail('admin@demo.com'); setPassword('12345'); }} className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 hover:text-white transition-colors">Admin</button>
              <button onClick={() => { setEmail('vendedor@demo.com'); setPassword('12345'); }} className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 hover:text-white transition-colors">Vendedor</button>
              <button onClick={() => { setEmail('financeiro@demo.com'); setPassword('12345'); }} className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 hover:text-white transition-colors">Financeiro</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
