import React from 'react';
// Fix: Replace non-existent 'Employee' type with 'User'.
import { Task, TaskStatus, User, TaskCategory } from '../types';
import {
  TrashIcon,
  UsersIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PencilIcon,
  TruckIcon,
  CakeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
} from './icons';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  isReadOnly: boolean;
  eventDate: string;
}

const getStatusClasses = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Done:
      return 'bg-green-100 text-green-800';
    case TaskStatus.InProgress:
      return 'bg-yellow-100 text-yellow-800';
    case TaskStatus.ToDo:
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const categoryInfo: {
  [key in TaskCategory]: {
    icon: React.FC<{ className?: string }>;
    label: string;
    color: string;
  };
} = {
  [TaskCategory.Logistics]: {
    icon: TruckIcon,
    label: 'خدمات لوجستية',
    color: 'text-blue-500',
  },
  [TaskCategory.Catering]: {
    icon: CakeIcon,
    label: 'تموين وضيافة',
    color: 'text-pink-500',
  },
  [TaskCategory.Venue]: {
    icon: BuildingOfficeIcon,
    label: 'المكان والتجهيزات',
    color: 'text-purple-500',
  },
  [TaskCategory.Technical]: {
    icon: WrenchScrewdriverIcon,
    label: 'أمور تقنية',
    color: 'text-gray-600',
  },
  [TaskCategory.Marketing]: {
    icon: MegaphoneIcon,
    label: 'تسويق وإعلام',
    color: 'text-amber-500',
  },
  [TaskCategory.General]: {
    icon: ClipboardDocumentListIcon,
    label: 'مهمة عامة',
    color: 'text-indigo-500',
  },
};

const TaskCategoryIcon: React.FC<{ category: TaskCategory }> = ({
  category,
}) => {
  const info = categoryInfo[category] || categoryInfo[TaskCategory.General];
  const Icon = info.icon;
  return (
    <div className="group relative">
      <Icon className={`h-5 w-5 ${info.color}`} />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 transform rounded-md bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {info.label}
        <div className="absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-gray-800 bottom-[-4px]"></div>
      </div>
    </div>
  );
};

// Fix: Change prop type from Employee to User.
const EmployeeInfo: React.FC<{ employee: User }> = ({ employee }) => {
  const hasDetails = !!employee.email || !!employee.phone;

  return (
    <div
      className={`group relative inline-block ${hasDetails ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center rounded-full bg-blue-100 py-1 ps-1 pe-3 text-sm font-medium text-blue-800">
        <span className="me-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">
          {/* Fix: Use 'username' instead of 'name'. */}
          {employee.username.charAt(0).toUpperCase()}
        </span>
        {/* Fix: Use 'username' instead of 'name'. */}
        <span>{employee.username}</span>
      </div>
      {hasDetails && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-xs -translate-x-1/2 transform rounded-lg bg-gray-800 p-3 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {/* Fix: Use 'username' instead of 'name'. */}
          <p className="mb-2 text-sm font-bold">{employee.username}</p>
          {employee.phone && (
            <div className="mb-1 flex items-center">
              <PhoneIcon className="me-2 h-3 w-3 text-gray-400" />
              <span>{employee.phone}</span>
            </div>
          )}
          {employee.email && (
            <div className="flex items-center">
              <EnvelopeIcon className="me-2 h-3 w-3 text-gray-400" />
              <span>{employee.email}</span>
            </div>
          )}
          <div className="absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-gray-800 bottom-[-4px]"></div>
        </div>
      )}
    </div>
  );
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onStatusChange,
  onDelete,
  onEdit,
  isReadOnly,
  eventDate,
}) => {
  const handleSendReminder = () => {
    // Fix: This now works because Task.assignedTo is User[] which has 'email'.
    const recipients = task.assignedTo
      .map((emp) => emp.email)
      .filter(Boolean)
      .join(';');

    if (!recipients) {
      alert('لا يوجد موظفون لديهم بريد إلكتروني مسجل لهذه المهمة.');
      return;
    }

    const subject = `تذكير بمهمة: ${task.name}`;
    const body = `
مرحباً،

هذا تذكير بالمهمة التالية: "${task.name}".

- تاريخ الفعالية: ${new Date(eventDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
- تاريخ التذكير المحدد: ${
      task.reminderDate
        ? new Date(task.reminderDate).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'غير محدد'
    }

الرجاء التأكد من متابعة تقدم المهمة.

شكراً لكم.
        `
      .trim()
      .replace(/^\s+/gm, '');

    const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  // Fix: This now works because Task.assignedTo is User[] which has 'email'.
  const canSendReminder = task.reminderDate && task.assignedTo.some((e) => e.email);

  return (
    <div
      className={`mb-3 flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        isReadOnly ? 'opacity-80' : ''
      }`}
    >
      {/* Top section: Main task info and controls */}
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-grow items-start">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer self-start rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
            checked={task.status === TaskStatus.Done}
            onChange={(e) =>
              onStatusChange(
                task.id,
                e.target.checked ? TaskStatus.Done : TaskStatus.ToDo,
              )
            }
            disabled={isReadOnly}
          />
          <div className="ms-4 flex-grow">
            <div className="flex items-center gap-x-2">
              <TaskCategoryIcon category={task.category} />
              <p
                className={`text-base font-medium ${
                  task.status === TaskStatus.Done
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900'
                }`}
              >
                {task.name}
              </p>
              {task.cost && task.cost > 0 && (
                <div className="group relative">
                  <CurrencyDollarIcon className="h-5 w-5 shrink-0 text-green-500" />
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 transform rounded-md bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    التكلفة:{' '}
                    {task.cost.toLocaleString('ar-SA', {
                      style: 'currency',
                      currency: 'SAR',
                    })}
                    <div className="absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-gray-800 bottom-[-4px]"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center space-x-2 space-x-reverse ps-4">
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as TaskStatus)
            }
            className={`rounded-full border-0 py-1 px-3 text-sm font-semibold focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70 ${getStatusClasses(
              task.status,
            )}`}
            disabled={isReadOnly}
          >
            <option value={TaskStatus.ToDo}>قيد الانتظار</option>
            <option value={TaskStatus.InProgress}>قيد التنفيذ</option>
            <option value={TaskStatus.Done}>مكتمل</option>
          </select>
          {!isReadOnly && (
            <>
              <button
                onClick={() => onEdit(task)}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom section: Assignees and other details */}
      {(task.assignedTo.length > 0 ||
        task.reminderDate ||
        task.isOptional) && (
        <div className="ms-9 mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3">
          {task.assignedTo.length > 0 && (
            <div className="flex items-start">
              <UsersIcon className="mt-1 me-3 h-5 w-5 shrink-0 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {/* Fix: This now works because task.assignedTo is User[], which has 'id'. */}
                {task.assignedTo.map((employee) => (
                  <EmployeeInfo key={employee.id} employee={employee} />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
            {task.reminderDate && (
              <div className="flex items-center text-sm text-amber-700">
                <ClockIcon className="me-1.5 h-4 w-4" />
                <span className="font-medium">
                  تذكير:{' '}
                  {new Date(task.reminderDate).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            {task.isOptional && (
              <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-500">
                مهمة اختيارية
              </span>
            )}
            {canSendReminder && !isReadOnly && (
              <button
                onClick={handleSendReminder}
                className="flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-200"
              >
                <EnvelopeIcon className="me-1.5 h-4 w-4" />
                إرسال تذكير بالبريد
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
