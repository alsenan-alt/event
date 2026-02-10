
import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, XCircleIcon } from './icons';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecover: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onRecover,
}) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onRecover(email.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md transform rounded-3xl bg-white p-8 shadow-2xl transition-all animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">استعادة كلمة المرور</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <p className="mb-6 text-gray-600 leading-relaxed">
          أدخل البريد الإلكتروني المرتبط بحسابك، وسنقوم بإرسال كلمة المرور إليك مباشرة.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recover-email" className="mb-2 block text-sm font-semibold text-gray-600 px-1">
              البريد الإلكتروني
            </label>
            <div className="relative group">
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 transition-colors group-focus-within:text-blue-500">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="email"
                id="recover-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-4 pr-12 text-gray-800 shadow-sm transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="example@kfupm.edu.sa"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            إرسال كلمة المرور
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
