import React from 'react';
// Fix: Replace non-existent 'Employee' type with 'User' type.
import { Event, TaskStatus, User } from '../types';
import { CalendarIcon, TrashIcon } from './icons';
import EventCountdown from './EventCountdown';

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
  onDelete: (event: Event) => void;
  currentUser: User | null;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onDelete,
  currentUser,
}) => {
  const completedTasks = event.tasks.filter(
    (t) => t.status === TaskStatus.Done,
  ).length;
  const totalTasks = event.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const actualBudget = event.tasks.reduce((sum, task) => sum + (task.cost || 0), 0);
  const budgetProgress =
    event.approximateBudget > 0
      ? (actualBudget / event.approximateBudget) * 100
      : 0;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' });
  };

  const eventDay = new Date(event.date);
  const today = new Date();
  eventDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const differenceInDays = Math.round(
    (eventDay.getTime() - today.getTime()) / (1000 * 3600 * 24),
  );

  let cardStateClasses = '';
  if (differenceInDays < 0) {
    cardStateClasses =
      'filter grayscale opacity-70 hover:opacity-100 hover:filter-none';
  } else if (differenceInDays === 0) {
    cardStateClasses = 'border-2 border-green-500 shadow-xl';
  } else {
    cardStateClasses = 'shadow-lg';
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(event);
  };

  const isOwner = currentUser?.id === event.createdBy;

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-lg bg-white duration-300 transition-all hover:scale-105 ${cardStateClasses}`}
    >
      {isOwner && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-3 left-3 z-10 rounded-full bg-white bg-opacity-50 p-2 text-gray-400 opacity-0 duration-300 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
          aria-label="حذف الفعالية"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      )}

      <div
        className="flex h-full cursor-pointer flex-col justify-between"
        onClick={() => onSelect(event)}
      >
        <div className="p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-800">{event.name}</h3>
          <div className="mb-1 flex items-center text-gray-500">
            <CalendarIcon className="me-2 h-5 w-5" />
            <span>
              {new Date(event.date).toLocaleString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="mb-6">
            <EventCountdown date={event.date} isCard={true} />
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                <span>تقدم المهام</span>
                <span>
                  {completedTasks} / {totalTasks}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-blue-600 duration-500 transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                <span>الميزانية</span>
                <span
                  className={`${
                    actualBudget > event.approximateBudget
                      ? 'text-red-600'
                      : 'text-gray-600'
                  } font-medium`}
                >
                  {formatCurrency(actualBudget)} /{' '}
                  {formatCurrency(event.approximateBudget)}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className={`${
                    budgetProgress > 100 ? 'bg-red-500' : 'bg-green-500'
                  } h-2.5 rounded-full duration-500 transition-all`}
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-gray-50 px-6 py-3">
          <span className="font-semibold text-blue-700 hover:underline">
            عرض التفاصيل
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
