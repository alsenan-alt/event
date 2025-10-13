import React, { useState, useEffect } from 'react';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePin: (oldPin: string, newPin: string) => boolean;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({
  isOpen,
  onClose,
  onChangePin,
}) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setError('');
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPin.length !== 4) {
      setError('الرقم الخاص الجديد يجب أن يتكون من 4 أرقام.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('الرقم الخاص الجديد وتأكيده غير متطابقين.');
      return;
    }

    const success = onChangePin(oldPin, newPin);
    if (!success) {
      setError('الرقم الخاص الحالي غير صحيح. الرجاء المحاولة مرة أخرى.');
    }
  };

  if (!isOpen) return null;

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
          تغيير الرقم الخاص
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="oldPin"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                الرقم الخاص الحالي
              </label>
              <input
                type="password"
                id="oldPin"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                maxLength={4}
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPin"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                الرقم الخاص الجديد
              </label>
              <input
                type="password"
                id="newPin"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                maxLength={4}
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPin"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                تأكيد الرقم الخاص الجديد
              </label>
              <input
                type="password"
                id="confirmPin"
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, ''))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                maxLength={4}
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
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow transition-colors hover:bg-blue-700"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePinModal;
