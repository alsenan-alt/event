
import React from 'react';
// Fix: Replace non-existent 'Employee' type with 'User'.
import { Event, Task, TaskStatus, User } from '../types';
import TaskItem from './TaskItem';
import {
  PlusIcon,
  ArrowRightIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
} from './icons';
import EventCountdown from './EventCountdown';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAddTaskModal: () => void;
  onOpenEditTaskModal: (task: Task) => void;
  currentUser: User | null;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onBack,
  onUpdateTask,
  onDeleteTask,
  onOpenAddTaskModal,
  onOpenEditTaskModal,
  currentUser,
}) => {
  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    const task = event.tasks.find((t) => t.id === taskId);
    if (task) {
      onUpdateTask({ ...task, status });
    }
  };

  const handleExportEvent = () => {
    const eventData = JSON.stringify(event, null, 2);
    const blob = new Blob([eventData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `event-${event.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedTasks = event.tasks.filter(
    (t) => t.status === TaskStatus.Done,
  ).length;
  const totalTasks = event.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const actualBudget = event.tasks.reduce(
    (sum, task) => sum + (task.cost || 0),
    0,
  );

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    });
  };

  const isOwner = currentUser?.id === event.createdBy;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowRightIcon className="me-2 h-5 w-5" />
          العودة إلى كل الفعاليات
        </button>
        <button
          onClick={handleExportEvent}
          className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          title="تصدير بيانات الفعالية"
        >
          <ArrowDownTrayIcon className="me-2 h-4 w-4" />
          تصدير الفعالية
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 border-b pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{event.name}</h2>
              <div className="mt-2 flex items-center text-gray-500">
                <CalendarIcon className="me-2 h-5 w-5" />
                <span>
                  {new Date(event.date).toLocaleString('ar-EG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <div className="mt-1">
              <EventCountdown date={event.date} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 text-center md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">
                الميزانية التقديرية
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {formatCurrency(event.approximateBudget)}
              </p>
            </div>
            <div
              className={`rounded-lg border p-4 ${
                actualBudget > event.approximateBudget
                  ? 'border-red-200 bg-red-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  actualBudget > event.approximateBudget
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                الميزانية الفعلية
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  actualBudget > event.approximateBudget
                    ? 'text-red-800'
                    : 'text-green-800'
                }`}
              >
                {formatCurrency(actualBudget)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-lg font-semibold text-gray-700">
            <span>تقدم الإنجاز</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-blue-600 duration-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">أجندة الفعالية</h3>
          {isOwner && (
            <button
              onClick={onOpenAddTaskModal}
              className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              <PlusIcon className="me-2 h-5 w-5" />
              إضافة مهمة
            </button>
          )}
        </div>

        <div className="space-y-3">
          {event.tasks.length > 0 ? (
            event.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                eventDate={event.date}
                onStatusChange={handleStatusChange}
                onDelete={onDeleteTask}
                onEdit={onOpenEditTaskModal}
                isReadOnly={!isOwner}
              />
            ))
          ) : (
            <div className="rounded-lg bg-gray-50 px-6 py-10 text-center">
              <p className="text-gray-500">لا توجد مهام لهذه الفعالية بعد.</p>
              {isOwner && (
                <p className="mt-1 text-sm text-gray-400">
                  ابدأ بإضافة مهمة جديدة!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
