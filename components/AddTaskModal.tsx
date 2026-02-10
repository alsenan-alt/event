
import React, { useState, useEffect } from 'react';
import { User, Task, TaskCategory } from '../types';
import { PlusIcon, XCircleIcon } from './icons';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    assignedTo: User[],
    isOptional: boolean,
    category: TaskCategory,
    reminderDate?: string,
    cost?: number,
  ) => void;
  taskToEdit?: Task | null;
  allEmployees: User[];
}

const categoryLabels: { [key in TaskCategory]: string } = {
  [TaskCategory.General]: 'عامة',
  [TaskCategory.Logistics]: 'خدمات لوجستية',
  [TaskCategory.Catering]: 'تموين وضيافة',
  [TaskCategory.Marketing]: 'تسويق وإعلام',
  [TaskCategory.Technical]: 'أمور تقنية',
  [TaskCategory.Venue]: 'المكان والتجهيزات',
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  allEmployees,
}) => {
  const [taskName, setTaskName] = useState('');
  const [isOptional, setIsOptional] = useState(false);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.General);
  const [reminderDate, setReminderDate] = useState('');
  const [cost, setCost] = useState('');

  const [assignedEmployees, setAssignedEmployees] = useState<User[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const isEditMode = !!taskToEdit;

  const resetForm = () => {
    setTaskName('');
    setIsOptional(false);
    setCategory(TaskCategory.General);
    setReminderDate('');
    setCost('');
    setAssignedEmployees([]);
    setSelectedEmployeeId('');
  };

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTaskName(taskToEdit.name);
        setIsOptional(taskToEdit.isOptional);
        setCategory(taskToEdit.category);
        setReminderDate(taskToEdit.reminderDate || '');
        setCost(taskToEdit.cost?.toString() || '');
        setAssignedEmployees(taskToEdit.assignedTo);
      } else {
        resetForm();
      }
    }
  }, [isOpen, taskToEdit]);

  const handleAddEmployee = () => {
    if (selectedEmployeeId) {
      const employeeToAdd = allEmployees.find(
        (emp) => emp.id === selectedEmployeeId,
      );
      if (
        employeeToAdd &&
        !assignedEmployees.some((emp) => emp.id === employeeToAdd.id)
      ) {
        setAssignedEmployees([...assignedEmployees, employeeToAdd]);
      }
      setSelectedEmployeeId('');
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setAssignedEmployees(
      assignedEmployees.filter((emp) => emp.id !== employeeId),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onSave(
        taskName,
        assignedEmployees,
        isOptional,
        category,
        reminderDate || undefined,
        parseFloat(cost) || undefined,
      );
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        resetForm();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const availableEmployees = allEmployees.filter(
    (emp) => !assignedEmployees.some((assigned) => assigned.id === emp.id),
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl transform rounded-3xl bg-white p-10 shadow-2xl transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            {isEditMode ? 'تعديل المتطلب' : 'إضافة متطلب إداري'}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition-colors">
             <XCircleIcon className="h-8 w-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="taskName" className="mb-2 block text-sm font-bold text-gray-600 px-1">
              وصف المتطلب الإداري
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 px-5 text-gray-800 shadow-sm transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
              placeholder="مثال: حجز القاعة الكبرى، تأمين الضيافة..."
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="taskCategory" className="mb-2 block text-sm font-bold text-gray-600 px-1">
                الفئة
              </label>
              <select
                id="taskCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 px-5 text-gray-800 shadow-sm focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold appearance-none cursor-pointer"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="taskCost" className="mb-2 block text-sm font-bold text-gray-600 px-1">
                التكلفة المتوقعة
              </label>
              <input
                type="number"
                id="taskCost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 px-5 text-gray-800 shadow-sm focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50/30 p-6 space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">المسؤولون عن التنفيذ</h3>
            <div className="flex items-center gap-3">
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="flex-grow rounded-2xl border border-gray-200 bg-white py-3 px-5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm"
              >
                <option value="">-- اختر من فريق العمل --</option>
                {availableEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.username}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddEmployee}
                disabled={!selectedEmployeeId}
                className="shrink-0 flex items-center justify-center rounded-2xl bg-slate-800 px-6 py-3.5 text-sm font-black text-white transition-all hover:bg-slate-900 active:scale-95 disabled:opacity-30"
              >
                <PlusIcon className="me-2 h-4 w-4" />
                إضافة
              </button>
            </div>

            {assignedEmployees.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {assignedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-2 rounded-full bg-white border border-gray-100 px-4 py-2 shadow-sm animate-fade-in"
                  >
                    <span className="text-sm font-bold text-gray-700">{emp.username}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmployee(emp.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="reminderDate" className="mb-2 block text-sm font-bold text-gray-600 px-1">
                تاريخ المتابعة / التذكير
              </label>
              <input
                type="date"
                id="reminderDate"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 px-5 text-gray-800 shadow-sm focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
              />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                   <input
                    type="checkbox"
                    checked={isOptional}
                    onChange={(e) => setIsOptional(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${isOptional ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isOptional ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="ms-4 text-sm font-bold text-gray-500 group-hover:text-gray-700">متطلب اختياري</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-8 py-4 text-sm font-black text-gray-400 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
            >
              {isEditMode ? 'حفظ التعديلات' : 'إضافة المتطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
