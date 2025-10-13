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
  error: string;
}

const LoginForm: React.FC<{
  role: 'admin' | 'clubPresident';
  title: string;
  onLogin: (usernameOrEmail: string, password: string) => void;
  onSwitchToRegister: () => void;
}> = ({ role, title, onLogin, onSwitchToRegister }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(usernameOrEmail, password);
  };

  const buttonClass =
    role === 'admin'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-indigo-600 hover:bg-indigo-700';
  
  const ringClass = role === 'admin' ? 'focus:ring-blue-500' : 'focus:ring-indigo-500';

  const linkClass =
    role === 'admin' ? 'text-blue-600' : 'text-indigo-600';

  return (
    <div className="w-full rounded-2xl bg-white p-8 shadow-2xl">
      <div className="mb-6 flex flex-col items-center">
        <div
          className={`mb-4 rounded-full p-4 ${
            role === 'admin' ? 'bg-blue-100' : 'bg-indigo-100'
          }`}
        >
          <UserCircleIcon
            className={`h-10 w-10 ${
              role === 'admin' ? 'text-blue-600' : 'text-indigo-600'
            }`}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor={`${role}-username`}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            اسم المستخدم أو البريد الإلكتروني
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              id={`${role}-username`}
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className={`w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${ringClass}`}
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor={`${role}-password`}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            كلمة المرور
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <KeyIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="password"
              id={`${role}-password`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${ringClass}`}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-bold text-white shadow-md transition-colors ${buttonClass}`}
        >
          <ArrowRightOnRectangleIcon className="me-2 h-5 w-5" />
          تسجيل الدخول
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ليس لديك حساب؟{' '}
          <button
            onClick={onSwitchToRegister}
            className={`font-semibold hover:underline focus:outline-none ${linkClass}`}
          >
            إنشاء حساب
          </button>
        </p>
      </div>
    </div>
  );
};

const LoginScreen: React.FC<LoginProps> = ({
  onLogin,
  onSwitchToRegister,
  error,
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">منظم الفعاليات</h1>
        <p className="mt-2 text-gray-500">
          مرحباً بك مجدداً! الرجاء تسجيل الدخول للمتابعة.
        </p>
      </div>
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <LoginForm
          role="admin"
          title="تسجيل دخول المشرف"
          onLogin={(u, p) => onLogin(u, p, 'admin')}
          onSwitchToRegister={() => onSwitchToRegister('admin')}
        />
        <LoginForm
          role="clubPresident"
          title="تسجيل دخول رئيس النادي"
          onLogin={(u, p) => onLogin(u, p, 'clubPresident')}
          onSwitchToRegister={() => onSwitchToRegister('clubPresident')}
        />
      </div>
      {error && (
        <p className="mt-6 w-full max-w-4xl rounded-md bg-red-100 p-3 text-center font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
};

export default LoginScreen;
