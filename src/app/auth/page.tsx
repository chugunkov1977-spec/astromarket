'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/hooks/useAuth';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(email, password, name);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mystic-500 to-cosmic-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-mystic-500/20">
            ✧
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Войти в AstroMarket' : 'Создать аккаунт'}
          </h1>
          <p className="text-sm text-mystic-400">
            {mode === 'login' ? 'Войдите, чтобы заказывать расклады' : 'Регистрация займёт 30 секунд'}
          </p>
        </div>

        {/* Переключатель */}
        <div className="flex rounded-xl bg-night-950/60 border border-mystic-800/20 p-1 mb-8">
          <button
            onClick={() => setMode('login')}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
              mode === 'login' ? 'bg-mystic-600/20 text-white' : 'text-mystic-500 hover:text-mystic-300'
            )}
          >
            Войти
          </button>
          <button
            onClick={() => setMode('register')}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
              mode === 'register' ? 'bg-mystic-600/20 text-white' : 'text-mystic-500 hover:text-mystic-300'
            )}
          >
            Регистрация
          </button>
        </div>

        <div className="p-6 rounded-2xl glass border border-mystic-700/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-mystic-300 mb-1.5">Имя</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mystic-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как вас зовут?"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-night-950/60 border border-mystic-800/30 text-sm text-white placeholder-mystic-600 focus:outline-none focus:border-mystic-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-mystic-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mystic-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-night-950/60 border border-mystic-800/30 text-sm text-white placeholder-mystic-600 focus:outline-none focus:border-mystic-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-mystic-300 mb-1.5">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mystic-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-night-950/60 border border-mystic-800/30 text-sm text-white placeholder-mystic-600 focus:outline-none focus:border-mystic-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mystic-500 hover:text-mystic-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3.5 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-night-950/30 border-t-night-950 rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button className="text-xs text-mystic-500 hover:text-mystic-300 transition-colors">
                Забыли пароль?
              </button>
            </div>
          )}
        </div>

        {mode === 'register' && (
          <p className="text-xs text-mystic-600 text-center mt-4 leading-relaxed">
            Регистрируясь, вы принимаете{' '}
            <Link href="#" className="text-mystic-400 hover:text-mystic-200 transition-colors underline">
              пользовательское соглашение
            </Link>{' '}
            и{' '}
            <Link href="#" className="text-mystic-400 hover:text-mystic-200 transition-colors underline">
              политику конфиденциальности
            </Link>
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
