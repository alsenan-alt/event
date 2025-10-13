import React, { useState, useEffect } from 'react';
// Fix: Replace non-existent 'Employee' type with 'User'.
import { User, Task, TaskCategory } from '../types';
import { PlusIcon, XCircleIcon } from './icons';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    // Fix: Change 'Employee[]' to 'User[]'.
    assignedTo: User[],
    isOptional: boolean,
    category: TaskCategory,
    reminderDate?: string,
    cost?: number,
  ) => void;
  taskToEdit?: Task | null;
  // Fix: Change 'Employee[]' to 'User[]'.
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

  // Fix: Change 'Employee[]' to 'User[]'.
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg transform rounded-lg bg-white p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          {isEditMode ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Task Details */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="taskName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                وصف المهمة
              </label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="taskCategory"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                فئة المهمة
              </label>
              <select
                id="taskCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Employee Management */}
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <h3 className="mb-3 text-lg font-medium text-gray-800">
              إسناد المهمة إلى
            </h3>
            <div className="mb-4 flex items-center gap-2">
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">-- اختر موظف --</option>
                {availableEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {/* Fix: Use 'username' instead of 'name'. */}
                    {emp.username}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddEmployee}
                disabled={!selectedEmployeeId}
                className="flex shrink-0 items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <PlusIcon className="me-2 h-4 w-4" />
                إضافة
              </button>
            </div>

            {assignedEmployees.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  القائمون على المهمة:
                </p>
                {assignedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between rounded-md bg-gray-50 p-2"
                  >
                    <p className="text-sm text-gray-700">
                      {/* Fix: Use 'username' instead of 'name'. */}
                      <span className="font-semibold">{emp.username}</span>
                      {emp.phone && (
                        <span className="ms-2 text-gray-500"> - {emp.phone}</span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmployee(emp.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reminderDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                تاريخ التذكير (اختياري)
              </label>
              <input
                type="date"
                id="reminderDate"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="taskCost"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                تكلفة المهمة (اختياري)
              </label>
              <input
                type="number"
                id="taskCost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="2500"
                min="0"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  checked={isOptional}
                  onChange={(e) => setIsOptional(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ms-2 text-sm text-gray-600">مهمة اختيارية</span>
              </label>
            </div>
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
              {isEditMode ? 'حفظ التغييرات' : 'إضافة مهمة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
