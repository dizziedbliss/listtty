import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'motion/react';
import { ListProvider } from './contexts/ListContext';
import { CursorBackground } from './components/CursorBackground';
import { CursorGlow } from './components/CursorGlow';
import { FloatingParticles } from './components/FloatingParticles';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { DetailsPage } from './pages/DetailsPage';
import { SearchPage } from './pages/SearchPage';
import { ListPage } from './pages/ListPage';
import { StatsPage } from './pages/StatsPage';
import { FriendsPage } from './pages/FriendsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import imgImage1 from '../imports/MacBookPro161-1/f8f18319f4fb99fe2eb04e1f157c2aeccb39edb6.png';

const queryClient = new QueryClient();

function AppContent() {
  const [activeCategory, setActiveCategory] = useState<'movies' | 'shows' | 'anime'>('anime');
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="bg-[#0b1622] min-h-screen relative">
      {/* Background Image - only on home page */}
      {isHomePage && (
        <div className="fixed inset-0 -z-10">
          <img
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-bottom opacity-30"
            src={imgImage1}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#e4e5ff]/20 to-[#0b1622]" />
        </div>
      )}

      {/* Cursor Effects */}
      <CursorBackground />
      <CursorGlow />
      <FloatingParticles />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Page Content */}
      <div className={isAuthPage ? '' : 'ml-16'}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <HomePage
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              }
            />
            <Route path="/:type/:id" element={<DetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/list/:listType" element={<ListPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Navigation - only show on home page */}
      {isHomePage && (
        <BottomNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ListProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ListProvider>
    </QueryClientProvider>
  );
}