import React, { useState, useEffect } from 'react';
// Fix: Import the 'Student' type.
import { Student } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id'>) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setPin('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && pin.trim().length === 4) {
      onSave({
        name: `${name.trim()} (طالب)`,
        pin,
      });
    }
  };

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
          إنشاء حساب طالب جديد
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="studentName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              الاسم الكامل
            </label>
            <input
              type="text"
              id="studentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="studentPin"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              الرقم الخاص (PIN)
            </label>
            <input
              type="password"
              inputMode="numeric"
              id="studentPin"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
              maxLength={4}
              pattern="\d{4}"
              title="الرجاء إدخال 4 أرقام"
              placeholder="يجب أن يتكون من 4 أرقام"
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
              className="rounded-md bg-indigo-600 px-4 py-2 text-white shadow transition-colors hover:bg-indigo-700"
            >
              إنشاء حساب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
