import React, { useState } from 'react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (name: string, date: string, approximateBudget: number) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [approximateBudget, setApproximateBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && date) {
      onAddEvent(name, date, parseFloat(approximateBudget) || 0);
      setName('');
      setDate('');
      setApproximateBudget('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="w-full max-w-md transform rounded-lg bg-white p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          إنشاء فعالية جديدة
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="eventName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              اسم الفعالية
            </label>
            <input
              type="text"
              id="eventName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              تاريخ الفعالية
            </label>
            <input
              type="date"
              id="eventDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="approximateBudget"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              الميزانية التقديرية (ريال سعودي)
            </label>
            <input
              type="number"
              id="approximateBudget"
              value={approximateBudget}
              onChange={(e) => setApproximateBudget(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="50000"
              min="0"
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
              إضافة فعالية
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
