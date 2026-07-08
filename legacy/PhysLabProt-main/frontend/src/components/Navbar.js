import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Zap, LogOut, LayoutDashboard, BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function NavLink({ to, active, children, testId }) {
  return (
    <Link to={to} data-testid={testId}>
      <span className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200
        ${active
          ? 'text-[#FFD700] bg-[#FFD700]/8'
          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
        }
      `}>
        {children}
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <motion.nav
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.33,1,0.68,1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="surface-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-[56px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" data-testid="logo-link">
            <div className="w-7 h-7 rounded-md bg-[#FFD700] flex items-center justify-center shadow-[0_0_12px_rgba(255,215,0,0.3)]">
              <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-[17px] font-bold text-white tracking-tight group-hover:text-[#FFD700] transition-colors duration-200">
              PhysicsLab
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {user && user !== false ? (
              <>
                <NavLink to="/courses" active={isActive('/courses')} testId="nav-courses">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Курсы</span>
                </NavLink>
                <NavLink to="/dashboard" active={isActive('/dashboard')} testId="nav-dashboard">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Дашборд</span>
                </NavLink>

                <div className="hidden sm:block w-px h-5 bg-white/8 mx-2" />

                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFD700]/[0.06] border border-[#FFD700]/10">
                  <Zap className="w-3 h-3 text-[#FFD700]" strokeWidth={2.5} />
                  <span className="text-xs font-mono font-semibold text-[#FFD700] tracking-tight" data-testid="nav-xp">{user.xp || 0}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="ml-1.5 w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 border border-[#FFD700]/15 text-[#FFD700] text-xs font-bold flex items-center justify-center hover:from-[#FFD700]/25 hover:to-[#FFD700]/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/50"
                      aria-label="Открыть меню профиля"
                      data-testid="user-menu-trigger"
                    >
                      {(user.name || 'U')[0].toUpperCase()}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="surface-overlay min-w-[200px] p-1.5 rounded-xl">
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-white/40 mt-0.5 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer rounded-lg text-[13px] text-white/70 hover:text-white hover:bg-white/[0.04] py-2">
                      <LayoutDashboard className="w-4 h-4 mr-2.5 opacity-50" /> Дашборд
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/leaderboard')} className="cursor-pointer rounded-lg text-[13px] text-white/70 hover:text-white hover:bg-white/[0.04] py-2">
                      <Trophy className="w-4 h-4 mr-2.5 opacity-50" /> Рейтинг
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] py-2" data-testid="logout-button">
                      <LogOut className="w-4 h-4 mr-2.5 opacity-50" /> Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login" data-testid="nav-login">
                  <Button variant="ghost" aria-label="Войти в аккаунт" className="text-white/60 hover:text-white text-[13px] font-medium h-8 px-2 sm:px-3 rounded-lg hover:bg-white/[0.04]">
                    Войти
                  </Button>
                </Link>
                <Link to="/register" data-testid="nav-register">
                  <Button aria-label="Создать аккаунт" className="bg-[#FFD700] text-black hover:bg-[#FFCA00] font-bold rounded-full h-8 px-4 sm:px-5 text-[13px] shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_24px_rgba(255,215,0,0.25)] transition-all duration-200">
                    Регистрация
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
