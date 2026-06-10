import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Search, List, TrendingUp, Users, User, LogIn, Settings } from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Watchlist', path: '/list/watchlist', icon: List },
    { name: 'Statistics', path: '/stats', icon: TrendingUp },
    { name: 'Friends', path: '/friends', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Hide sidebar on auth page
  if (location.pathname === '/auth') return null;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-16 bg-[rgba(8,8,8,0.82)] backdrop-blur-2xl border-r border-white/10 z-40 flex flex-col items-center py-6"
    >
      {/* Logo */}
      <div className="mb-10 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl cursor-pointer shadow-lg shadow-white/10" onClick={() => navigate('/')}>
        M
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5 w-full px-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative flex items-center justify-center w-full h-11 rounded-xl transition-all ${
                active
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
              title={item.name}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[rgba(15,15,25,0.98)] backdrop-blur-xl border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                {item.name}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[rgba(15,15,25,0.98)]" />
              </div>

              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-0.5 h-6 bg-white rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings/Auth */}
      <div className="w-full px-2 space-y-1.5">
        <button
          onClick={() => navigate('/auth')}
          className="group relative flex items-center justify-center w-full h-11 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all"
          title="Login"
        >
          <LogIn className="w-5 h-5" />
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[rgba(15,15,25,0.98)] backdrop-blur-xl border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
            Login
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[rgba(15,15,25,0.98)]" />
          </div>
        </button>
      </div>
    </motion.div>
  );
}
