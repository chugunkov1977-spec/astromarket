'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/hooks/useAuth';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { login, register, isLoading, error, isAuthenticated } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validate = (): boolean => {
    setValidationError(null);
    if (mode === 'register' && !name.trim()) {
      setValidationError('Введите ваше имя');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Введите корректный email');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Пароль должен быть не менее 6 символов');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let ok: boolean;
    if (mode === 'login') {
      ok = await login(email, password);
    } else {
      ok = await register(email, password, name.trim());
    }

    if (ok) {
      setSuccess(true);
      setTimeout(() => router.push('/'), 800);
    }
  };

  const displayError = validationError || error;

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
            onClick={() => { setMode('login'); setValidationError(null); }}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
              mode === 'login' ? 'bg-mystic-600/20 text-white' : 'text-mystic-500 hover:text-mystic-300'
            )}
          >
            Войти
          </button>
          <button
            onClick={() => { setMode('register'); setValidationError(null); }}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
              mode === 'register' ? 'bg-mystic-600/20 text-white' : 'text-mystic-500 hover:text-mystic-300'
            )}
          >
            Регистрация
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm">{mode === 'login' ? 'Вход выполнен!' : 'Аккаунт создан!'} Перенаправляем...</span>
          </div>
        )}

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
                  placeholder="Минимум 6 символов"
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

            {displayError && (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                {displayError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || success}
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
            <Link href="/terms" className="text-mystic-400 hover:text-mystic-200 transition-colors underline">
              пользовательское соглашение
            </Link>{' '}
            и{' '}
            <Link href="/privacy" className="text-mystic-400 hover:text-mystic-200 transition-colors underline">
              политику конфиденциальности
            </Link>
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
