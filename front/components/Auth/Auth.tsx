
import React, { useState, useEffect } from 'react';
import { Lock, Mail, ChevronRight, User as UserIcon, ShieldCheck, ArrowLeft } from 'lucide-react';
import { User, UserRole } from '../../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SELLER);
  const [error, setError] = useState('');

  // Carregar usuários registrados ou inicializar com o admin padrão
  const getRegisteredUsers = (): (User & { password: string })[] => {
    const saved = localStorage.getItem('am_registered_users');
    if (saved) return JSON.parse(saved);
    return [{
      id: 'u1',
      name: 'Admin Master',
      email: 'admin@automanager.com',
      role: UserRole.ADMIN,
      password: 'admin'
    }];
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = getRegisteredUsers();

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password, ...userSession } = user;
        onLogin(userSession);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      if (users.some(u => u.email === email)) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        password
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('am_registered_users', JSON.stringify(updatedUsers));
      
      const { password: _, ...userSession } = newUser;
      onLogin(userSession);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 transform transition-all">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
            AutoManager<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-slate-400 font-medium">
            {isLogin ? 'Bem-vindo de volta! Acesse sua conta.' : 'Comece agora sua gestão profissional.'}
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    className="w-full bg-slate-800/50 border border-slate-700 text-white px-12 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  className="w-full bg-slate-800/50 border border-slate-700 text-white px-12 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="exemplo@auto.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  className="w-full bg-slate-800/50 border border-slate-700 text-white px-12 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nível de Acesso</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select 
                    className="w-full bg-slate-800/50 border border-slate-700 text-white px-12 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    <option value={UserRole.SELLER}>Vendedor</option>
                    <option value={UserRole.FINANCE}>Financeiro</option>
                    <option value={UserRole.ADMIN}>Administrador</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl shadow-blue-900/30 group active:scale-95"
            >
              <span>{isLogin ? 'Entrar no Sistema' : 'Finalizar Cadastro'}</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center mx-auto space-x-2"
            >
              {isLogin ? (
                <><span>Não tem uma conta?</span> <span className="text-blue-500">Criar agora</span></>
              ) : (
                <><ArrowLeft size={16} /> <span>Voltar para o Login</span></>
              )}
            </button>
          </div>
        </div>

        {isLogin && (
          <div className="mt-8 text-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3">Acesso Rápido (Demo)</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => { setEmail('admin@automanager.com'); setPassword('admin'); }}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                Admin (admin)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
