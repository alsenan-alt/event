
import React from 'react';
import { User } from '../types';
import { CogIcon } from './icons';

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
  const activeClasses = 'bg-blue-600 text-white shadow';
  const inactiveClasses = 'bg-white text-gray-600 hover:bg-gray-100';

  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          وحدة دعم المبادرات والأنشطة
        </h1>
        {currentUser && (
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg bg-gray-200 p-1">
              <button
                onClick={() => setCurrentView('events')}
                className={`rounded-md px-4 py-2 text-sm font-semibold duration-300 transition-colors ${
                  currentView === 'events' ? activeClasses : inactiveClasses
                }`}
              >
                الفعاليات
              </button>
              <button
                onClick={() => setCurrentView('sponsorships')}
                className={`rounded-md px-4 py-2 text-sm font-semibold duration-300 transition-colors ${
                  currentView === 'sponsorships'
                    ? activeClasses
                    : inactiveClasses
                }`}
              >
                الرعاية
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setCurrentView('employees')}
                  className={`rounded-md px-4 py-2 text-sm font-semibold duration-300 transition-colors ${
                    currentView === 'employees'
                      ? activeClasses
                      : inactiveClasses
                  }`}
                >
                  الموظفين
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-600 sm:inline">
                مرحباً, <span className="font-bold">{currentUser.username}</span>
              </span>
              <button
                onClick={onOpenDeleteAccountModal}
                className="rounded-md px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
              >
                حذف الحساب
              </button>
              <button
                onClick={onLogout}
                className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
