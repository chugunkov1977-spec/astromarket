'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Copy, LogOut, Check, Gift } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/hooks/useAuth';
import { useToastStore } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const showToast = useToastStore((s) => s.showToast);
  const [mounted, setMounted] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) router.push('/auth');
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (user) setNewName(user.name);
  }, [user]);

  if (!mounted || !user) {
    return <div className="min-h-screen"><Header /><div className="py-20" /></div>;
  }

  const handleSaveName = () => {
    if (!newName.trim()) return;
    // Update in registered_users localStorage
    try {
      const raw = localStorage.getItem('registered_users');
      if (raw) {
        const users = JSON.parse(raw);
        const idx = users.findIndex((u: any) => u.id === user.id);
        if (idx >= 0) {
          users[idx].name = newName.trim();
          localStorage.setItem('registered_users', JSON.stringify(users));
        }
      }
      // Update zustand persist state
      const authRaw = localStorage.getItem('astro_auth');
      if (authRaw) {
        const parsed = JSON.parse(authRaw);
        if (parsed.state?.user) {
          parsed.state.user.name = newName.trim();
          localStorage.setItem('astro_auth', JSON.stringify(parsed));
        }
      }
      // Update in-memory
      useAuthStore.setState({ user: { ...user, name: newName.trim() } });
      setEditingName(false);
      showToast('Имя обновлено', 'success');
    } catch {
      showToast('Ошибка сохранения', 'error');
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode).catch(() => {});
    setCopied(true);
    showToast('Код скопирован', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-white mb-8">Настройки профиля</h1>

        {/* User info */}
        <section className="p-6 rounded-2xl glass-light mb-5">
          <h2 className="font-display text-base font-semibold text-white mb-4">Личные данные</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-mystic-500 mb-1 block">Имя</label>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-night-950/60 border border-mystic-800/30 text-sm text-white focus:outline-none focus:border-mystic-500/50 transition-all"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="px-4 py-2.5 rounded-xl bg-mystic-600/20 text-sm text-mystic-200 hover:bg-mystic-600/30 transition-all">
                    Сохранить
                  </button>
                  <button onClick={() => { setEditingName(false); setNewName(user.name); }} className="px-3 py-2.5 rounded-xl text-sm text-mystic-500 hover:text-mystic-300 transition-all">
                    Отмена
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-mystic-500" />
                    <span className="text-sm text-white">{user.name}</span>
                  </div>
                  <button onClick={() => setEditingName(true)} className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                    Изменить
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-mystic-500 mb-1 block">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-mystic-500" />
                <span className="text-sm text-white">{user.email}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Loyalty */}
        <section className="p-6 rounded-2xl glass-light mb-5">
          <h2 className="font-display text-base font-semibold text-white mb-4">Программа лояльности</h2>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-mystic-400" />
              <span className="text-sm text-white">Уровень: <span className="text-gold-400">{user.loyaltyTier === 'BASIC' ? 'Новичок' : user.loyaltyTier}</span></span>
            </div>
            <span className="text-xs text-mystic-500">0 баллов</span>
          </div>
          <div className="w-full h-2 rounded-full bg-mystic-900/40 overflow-hidden">
            <div className="h-full w-[5%] rounded-full bg-gradient-to-r from-gold-500 to-gold-400" />
          </div>
          <p className="text-xs text-mystic-600 mt-2">До следующего уровня: 100 баллов</p>
        </section>

        {/* Referral */}
        <section className="p-6 rounded-2xl glass-light mb-5">
          <h2 className="font-display text-base font-semibold text-white mb-4">Реферальная программа</h2>
          <p className="text-xs text-mystic-400 mb-3">Пригласите друга и получите 500 бонусных баллов</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2.5 rounded-xl bg-night-950/60 border border-mystic-800/30 text-sm text-gold-400 font-mono">
              {user.referralCode}
            </div>
            <button
              onClick={handleCopyReferral}
              className="px-4 py-2.5 rounded-xl bg-mystic-600/20 text-sm text-mystic-200 hover:bg-mystic-600/30 transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-500/20 text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Выйти из аккаунта
        </button>
      </main>
      <Footer />
    </div>
  );
}
