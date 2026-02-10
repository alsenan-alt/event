
import React, { useState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
} from './icons';

interface LoginProps {
  onLogin: (
    usernameOrEmail: string,
    password: string,
    role: 'admin' | 'clubPresident',
  ) => void;
  onSwitchToRegister: (role: 'admin' | 'clubPresident') => void;
  onForgotPassword: () => void;
  error: string;
}

const LoginForm: React.FC<{
  role: 'admin' | 'clubPresident';
  title: string;
  onLogin: (usernameOrEmail: string, password: string) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}> = ({ role, title, onLogin, onSwitchToRegister, onForgotPassword }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(usernameOrEmail, password);
  };

  const buttonClass =
    role === 'admin'
      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
  
  const iconBgClass = role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600';
  const linkClass = role === 'admin' ? 'text-blue-600' : 'text-indigo-600';

  return (
    <div className="w-full rounded-3xl bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <div className="mb-8 flex flex-col items-center">
        <div className={`mb-5 rounded-full p-5 shadow-inner ${iconBgClass}`}>
          <UserCircleIcon className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor={`${role}-username`}
            className="mb-2 block text-sm font-semibold text-gray-600 px-1"
          >
            اسم المستخدم أو البريد الإلكتروني
          </label>
          <div className="relative group">
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 transition-colors group-focus-within:text-blue-500">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              id={`${role}-username`}
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-4 pr-12 text-gray-800 shadow-sm transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="example@kfupm.edu.sa"
              required
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <label
              htmlFor={`${role}-password`}
              className="block text-sm font-semibold text-gray-600"
            >
              كلمة المرور
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className={`text-xs font-bold hover:underline ${linkClass}`}
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="relative group">
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 transition-colors group-focus-within:text-blue-500">
              <KeyIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="password"
              id={`${role}-password`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-4 pr-12 text-gray-800 shadow-sm transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className={`flex w-full items-center justify-center rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all active:scale-[0.98] ${buttonClass} focus:outline-none focus:ring-4`}
        >
          <ArrowRightOnRectangleIcon className="me-3 h-6 w-6" />
          تسجيل الدخول
        </button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          ليس لديك حساب؟{' '}
          <button
            onClick={onSwitchToRegister}
            className={`font-bold hover:underline focus:outline-none ${linkClass} transition-colors`}
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </div>
  );
};

const LoginScreen: React.FC<LoginProps> = ({
  onLogin,
  onSwitchToRegister,
  onForgotPassword,
  error,
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] p-6 selection:bg-blue-100">
      <div className="mb-12 text-center animate-fade-in">
        <div className="relative inline-block mb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            وحدة دعم المبادرات والأنشطة
          </h1>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-4 rounded-full opacity-80"></div>
        </div>
        <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
          مرحباً بك مجدداً! بوابتك الذكية لتنظيم وإدارة الفعاليات الطلابية بكفاءة عالية.
        </p>
      </div>
      
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
        <LoginForm
          role="clubPresident"
          title="تسجيل دخول رئيس النادي"
          onLogin={(u, p) => onLogin(u, p, 'clubPresident')}
          onSwitchToRegister={() => onSwitchToRegister('clubPresident')}
          onForgotPassword={onForgotPassword}
        />
        <LoginForm
          role="admin"
          title="تسجيل دخول المشرف"
          onLogin={(u, p) => onLogin(u, p, 'admin')}
          onSwitchToRegister={() => onSwitchToRegister('admin')}
          onForgotPassword={onForgotPassword}
        />
      </div>

      {error && (
        <div className="mt-10 w-full max-w-md animate-bounce">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="font-bold text-red-700 flex items-center justify-center">
              <span className="me-2">⚠️</span>
              {error}
            </p>
          </div>
        </div>
      )}

      <footer className="mt-16 text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} وحدة دعم المبادرات والأنشطة - جميع الحقوق محفوظة
      </footer>
    </div>
  );
};

export default LoginScreen;
