import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }
    setLoading(true);
    const result = await register(email, password, name);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#08080A] flex items-center justify-center pt-14 px-6 relative">
      <div className="absolute bottom-[30%] right-[30%] w-[400px] h-[400px] bg-[#00E5FF]/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.33,1,0.68,1] }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="text-center mb-8">
          <Mascot pose="explaining" size="sm" className="mx-auto mb-5" noFloat />
          <h1 className="font-heading text-[22px] sm:text-2xl font-bold text-white tracking-tight mb-1.5">
            Присоединяйся!
          </h1>
          <p className="text-[13px] text-white/40">Создай аккаунт и начни набирать XP</p>
        </div>

        <div className="surface-elevated rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-red-500/[0.06] border border-red-500/15 rounded-xl px-3.5 py-3"
                data-testid="register-error"
              >
                <AlertCircle className="w-4 h-4 text-red-400/80 mt-0.5 shrink-0" />
                <p className="text-[13px] text-red-400/90 leading-snug">{error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label className="text-[13px] text-white/50 font-medium">Имя</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <Input
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Как тебя зовут?"
                  className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/15 focus:border-[#FFD700]/40 focus:ring-1 focus:ring-[#FFD700]/20 rounded-xl h-11 text-[14px] transition-all duration-200"
                  required data-testid="register-name-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] text-white/50 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <Input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/15 focus:border-[#FFD700]/40 focus:ring-1 focus:ring-[#FFD700]/20 rounded-xl h-11 text-[14px] transition-all duration-200"
                  required data-testid="register-email-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] text-white/50 font-medium">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <Input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/15 focus:border-[#FFD700]/40 focus:ring-1 focus:ring-[#FFD700]/20 rounded-xl h-11 text-[14px] transition-all duration-200"
                  required data-testid="register-password-input"
                />
              </div>
              <p className="text-[11px] text-white/20 pl-1">Минимум 6 символов</p>
            </div>

            <Button
              type="submit" disabled={loading}
              className="w-full bg-[#FFD700] text-black hover:bg-[#FFCA00] font-bold rounded-full h-11 text-[14px] gap-2 shadow-[0_2px_16px_rgba(255,215,0,0.2)] hover:shadow-[0_4px_24px_rgba(255,215,0,0.3)] transition-all duration-250 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
              data-testid="register-submit-button"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Создать аккаунт <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[13px] text-white/30">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-[#FFD700] hover:text-[#FFCA00] font-medium transition-colors duration-200" data-testid="go-to-login">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
