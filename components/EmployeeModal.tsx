import React, { useState, useEffect } from 'react';
// Fix: Replace Employee with User
import { User } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix: Replace Employee with User
  onSave: (employee: Omit<User, 'id'> & { id?: string }) => void;
  employeeToEdit?: User | null;
  currentUser: User | null;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeToEdit,
  currentUser,
}) => {
  // Fix: Replace name and pin with username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const isEditMode = !!employeeToEdit;
  const isEditingSelf = isEditMode && currentUser?.id === employeeToEdit?.id;

  useEffect(() => {
    if (isOpen) {
      if (employeeToEdit) {
        // Fix: Use username and password
        setUsername(employeeToEdit.username);
        setPassword(employeeToEdit.password);
        setPhone(employeeToEdit.phone || '');
        setEmail(employeeToEdit.email || '');
      } else {
        setUsername('');
        setPassword('');
        setPhone('');
        setEmail('');
      }
    }
  }, [isOpen, employeeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Use username and password
    if (username.trim() && password.trim()) {
      onSave({
        id: employeeToEdit?.id,
        username,
        password,
        phone: phone.trim() || undefined,
        email: email.trim(),
      });
    }
  };

  if (!isOpen) return null;

  const canEditPin = !isEditMode || isEditingSelf;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md transform rounded-lg bg-white p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          {isEditMode ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="employeeName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                الاسم الكامل
              </label>
              <input
                type="text"
                id="employeeName"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="employeePassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                كلمة المرور
              </label>
              <input
                type="password"
                id="employeePassword"
                value={password}
                onChange={(e) => canEditPin && setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                required
                disabled={!canEditPin}
              />
              {!canEditPin && (
                <p className="mt-1 text-xs text-gray-500">
                  لا يمكنك تغيير كلمة مرور المستخدمين الآخرين.
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="employeePhone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              رقم الهاتف (اختياري)
            </label>
            <input
              type="tel"
              id="employeePhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="employeeEmail"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              البريد الإلكتروني (اختياري)
            </label>
            <input
              type="email"
              id="employeeEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow transition-colors hover:bg-blue-700"
            >
              {isEditMode ? 'حفظ التغييرات' : 'إضافة موظف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
