import React, { useState, useEffect } from 'react';
// Fix: Replace Employee with User and import StudentEventRequest.
import { User, StudentEventRequest, TaskCategory } from '../types';

interface AddStudentEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<StudentEventRequest, 'id' | 'status' | 'creatorId'>,
  ) => void;
  // Fix: Replace Employee[] with User[].
  allEmployees: User[];
}

const categoryLabels: { [key in TaskCategory]: string } = {
  [TaskCategory.General]: 'مهام عامة',
  [TaskCategory.Logistics]: 'خدمات لوجستية',
  [TaskCategory.Catering]: 'تموين وضيافة',
  [TaskCategory.Marketing]: 'تسويق وإعلام',
  [TaskCategory.Technical]: 'أمور تقنية',
  [TaskCategory.Venue]: 'تجهيزات المكان',
};

const AddStudentEventModal: React.FC<AddStudentEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  allEmployees,
}) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [primaryVenue, setPrimaryVenue] = useState('');
  const [alternativeVenue, setAlternativeVenue] = useState('');
  const [otherNeeds, setOtherNeeds] = useState('');
  const [isBudgeted, setIsBudgeted] = useState(false);
  const [assignedToEmployeeId, setAssignedToEmployeeId] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [requiredTaskCategories, setRequiredTaskCategories] = useState<TaskCategory[]>([]);

  const resetForm = () => {
    setEventName('');
    setEventDate('');
    setPrimaryVenue('');
    setAlternativeVenue('');
    setOtherNeeds('');
    setIsBudgeted(false);
    setAssignedToEmployeeId('');
    setProposedBudget('');
    setRequiredTaskCategories([]);
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(resetForm, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const handleCategoryChange = (category: TaskCategory) => {
    setRequiredTaskCategories(prev => 
        prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      eventName.trim() &&
      eventDate &&
      primaryVenue.trim() &&
      assignedToEmployeeId
    ) {
      onSave({
        eventName,
        eventDate,
        primaryVenue,
        alternativeVenue,
        otherNeeds,
        isBudgeted,
        assignedToEmployeeId,
        proposedBudget: parseFloat(proposedBudget) || 0,
        requiredTaskCategories,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl transform rounded-lg bg-white p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          إنشاء طلب فعالية جديد
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto pr-2"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="eventName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  اسم الفعالية
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  تاريخ الفعالية المقترح
                </label>
                <input
                  type="date"
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="primaryVenue"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  المكان الأساسي
                </label>
                <input
                  type="text"
                  id="primaryVenue"
                  value={primaryVenue}
                  onChange={(e) => setPrimaryVenue(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="alternativeVenue"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  المكان البديل (اختياري)
                </label>
                <input
                  type="text"
                  id="alternativeVenue"
                  value={alternativeVenue}
                  onChange={(e) => setAlternativeVenue(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label
                    htmlFor="assignEmployee"
                    className="mb-2 block text-sm font-medium text-gray-700"
                    >
                    إسناد الطلب إلى الموظف المسؤول
                    </label>
                    <select
                    id="assignEmployee"
                    value={assignedToEmployeeId}
                    onChange={(e) => setAssignedToEmployeeId(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                    >
                    <option value="">-- اختر الموظف --</option>
                    {allEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                        {/* Fix: Use 'username' instead of 'name'. */}
                        {emp.username}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                     <label
                        htmlFor="proposedBudget"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        الميزانية المقترحة (ريال سعودي)
                    </label>
                    <input
                        type="number"
                        id="proposedBudget"
                        value={proposedBudget}
                        onChange={(e) => setProposedBudget(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="5000"
                        min="0"
                    />
                </div>
            </div>

            <div className="border-t border-b py-4">
              <p className="mb-3 text-sm font-medium text-gray-700">
                الاحتياجات (حدد فئات المهام المطلوبة):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                {Object.entries(categoryLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center">
                        <input
                        type="checkbox"
                        checked={requiredTaskCategories.includes(key as TaskCategory)}
                        onChange={() => handleCategoryChange(key as TaskCategory)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ms-2 text-sm text-gray-600">
                        {label}
                        </span>
                    </label>
                ))}
                 <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isBudgeted}
                    onChange={(e) => setIsBudgeted(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ms-2 text-sm text-gray-600">
                    معتمدة في الميزانية
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="otherNeeds"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                ملاحظات أو احتياجات أخرى (اختياري)
              </label>
              <textarea
                id="otherNeeds"
                value={otherNeeds}
                onChange={(e) => setOtherNeeds(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="اذكر أي تفاصيل إضافية مثل الحاجة لمتحدثين، معدات خاصة، ..."
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4 space-x-reverse border-t pt-4">
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
              إرسال الطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentEventModal;
