
import React from 'react';
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
      minimumFractionDigits: 0,
    });
  };

  const isOwner = currentUser?.id === event.createdBy;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="group flex items-center text-sm font-bold text-gray-500 transition-all hover:text-blue-600"
        >
          <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 group-hover:bg-blue-50 transition-colors ml-3">
             <ArrowRightIcon className="h-4 w-4" />
          </div>
          العودة للفعاليات
        </button>
        <button
          onClick={handleExportEvent}
          className="flex items-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
        >
          <ArrowDownTrayIcon className="me-2 h-4 w-4" />
          حفظ نسخة احتياطية
        </button>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] sm:p-10 border border-gray-50">
        <div className="mb-10 pb-10 border-b border-gray-100">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">{event.name}</h2>
              <div className="mt-4 flex items-center text-gray-400 bg-gray-50 w-fit px-4 py-1.5 rounded-full border border-gray-100">
                <CalendarIcon className="me-2 h-4 w-4 text-blue-500" />
                <span className="text-sm font-bold">
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
          
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100 group transition-all hover:bg-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">الميزانية المخصصة</p>
              <p className="text-3xl font-black text-slate-800">
                {formatCurrency(event.approximateBudget)}
              </p>
            </div>
            <div
              className={`rounded-2xl p-6 border transition-all ${
                actualBudget > event.approximateBudget
                  ? 'border-red-100 bg-red-50 hover:bg-red-100'
                  : 'border-green-100 bg-green-50 hover:bg-green-100'
              }`}
            >
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                  actualBudget > event.approximateBudget ? 'text-red-400' : 'text-green-400'
                }`}>التكاليف الحالية</p>
              <p className={`text-3xl font-black ${
                  actualBudget > event.approximateBudget ? 'text-red-800' : 'text-green-800'
                }`}>
                {formatCurrency(actualBudget)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">مؤشر اكتمال المتطلبات</span>
            <span className="text-lg font-black text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden border border-gray-50 shadow-inner p-0.5">
            <div
              className="h-full rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] duration-700 transition-all ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
             <h3 className="text-2xl font-extrabold text-gray-800">المتطلبات الإدارية</h3>
          </div>
          {isOwner && (
            <button
              onClick={onOpenAddTaskModal}
              className="group flex items-center rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
            >
              <PlusIcon className="me-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              إضافة متطلب
            </button>
          )}
        </div>

        <div className="space-y-4">
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
            <div className="rounded-3xl bg-gray-50/50 border-2 border-dashed border-gray-200 px-6 py-16 text-center">
              <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                 </svg>
              </div>
              <p className="text-lg font-bold text-gray-400">لا توجد متطلبات إدارية مضافة بعد</p>
              {isOwner && (
                <p className="mt-1 text-sm text-gray-400">
                  ابدأ بإضافة أول متطلب لضمان سير الفعالية بنجاح.
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
