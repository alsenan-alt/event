import React, { useState, useEffect } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (
    data: {
      username: string;
      email: string;
      password: string;
    },
    role: 'admin' | 'clubPresident',
  ) => void;
  roleToRegister: 'admin' | 'clubPresident' | null;
}

const RegistrationRoleModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  roleToRegister,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    if (roleToRegister) {
      onRegister({ username, email, password }, roleToRegister);
    }
  };

  if (!isOpen || !roleToRegister) return null;

  const title =
    roleToRegister === 'admin'
      ? 'إنشاء حساب مشرف جديد'
      : 'إنشاء حساب رئيس نادي جديد';
  const buttonClass =
    roleToRegister === 'admin'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-indigo-600 hover:bg-indigo-700';

  const ringClass =
    roleToRegister === 'admin'
      ? 'focus:ring-blue-500'
      : 'focus:ring-indigo-500';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md transform rounded-lg bg-white p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="regUsername"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                اسم المستخدم
              </label>
              <input
                type="text"
                id="regUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${ringClass}`}
                required
              />
            </div>
            <div>
              <label
                htmlFor="regEmail"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="regEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${ringClass}`}
                required
              />
            </div>
            <div>
              <label
                htmlFor="regPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                كلمة المرور
              </label>
              <input
                type="password"
                id="regPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${ringClass}`}
                required
              />
            </div>
            <div>
              <label
                htmlFor="regConfirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="regConfirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 ${ringClass}`}
                required
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-center text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`rounded-md px-4 py-2 text-white shadow transition-colors ${buttonClass}`}
            >
              تسجيل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegistrationRoleModal;
