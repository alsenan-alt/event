
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentView: 'events' | 'sponsorships' | 'employees';
  setCurrentView: (view: 'events' | 'sponsorships' | 'employees') => void;
  currentUser: (User & { role: 'admin' | 'clubPresident' }) | null;
  onLogout: () => void;
  onOpenDeleteAccountModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onLogout,
  onOpenDeleteAccountModal,
}) => {
  const activeClasses = 'bg-blue-600 text-white shadow-lg scale-105';
  const inactiveClasses = 'bg-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50';

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-blue-200 shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
             </svg>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl tracking-tight">
            وحدة دعم المبادرات والأنشطة
          </h1>
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-6">
            <nav className="flex items-center bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
              <button
                onClick={() => setCurrentView('events')}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-300 ${
                  currentView === 'events' ? activeClasses : inactiveClasses
                }`}
              >
                الفعاليات
              </button>
              <button
                onClick={() => setCurrentView('sponsorships')}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-300 ${
                  currentView === 'sponsorships' ? activeClasses : inactiveClasses
                }`}
              >
                الرعاية
              </button>
              <button
                onClick={() => setCurrentView('employees')}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-300 ${
                  currentView === 'employees' ? activeClasses : inactiveClasses
                }`}
              >
                فريق العمل
              </button>
            </nav>

            <div className="flex items-center gap-3 border-r pr-6 border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">مرحباً بك</p>
                <p className="text-sm font-bold text-gray-800">{currentUser.username}</p>
              </div>
              <div className="flex gap-2">
                 <button
                    onClick={onLogout}
                    className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                    title="تسجيل الخروج"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                  <button
                    onClick={onOpenDeleteAccountModal}
                    className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-all duration-300"
                    title="إعدادات الحساب"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
