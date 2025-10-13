import React from 'react';
import { ClockIcon } from './icons';

interface EventCountdownProps {
  date: string;
  isCard?: boolean;
}

const EventCountdown: React.FC<EventCountdownProps> = ({
  date,
  isCard = false,
}) => {
  const eventDay = new Date(date);
  const today = new Date();

  // Set hours to 0 to compare dates only, avoiding timezone issues.
  eventDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const differenceInTime = eventDay.getTime() - today.getTime();
  const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

  let text = '';
  let colorClasses = '';

  if (differenceInDays > 0) {
    if (differenceInDays === 1) {
      text = 'متبقي يوم واحد';
    } else if (differenceInDays === 2) {
      text = 'متبقي يومان';
    } else if (differenceInDays >= 3 && differenceInDays <= 10) {
      text = `متبقي ${differenceInDays} أيام`;
    } else {
      // >= 11
      text = `متبقي ${differenceInDays} يومًا`;
    }
    colorClasses = 'bg-green-50 text-green-700';
  } else if (differenceInDays === 0) {
    text = 'الفعالية اليوم';
    colorClasses = 'bg-green-200 text-green-900';
  } else {
    text = 'انتهت الفعالية';
    colorClasses = 'bg-red-100 text-red-800';
  }

  if (isCard) {
    return (
      <div className="mt-1 flex items-center text-xs font-medium">
        <ClockIcon className="me-1.5 h-4 w-4 text-gray-400" />
        <span
          className={
            differenceInDays < 0
              ? 'font-medium text-red-600'
              : differenceInDays === 0
                ? 'font-bold text-green-700'
                : 'text-green-600'
          }
        >
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${colorClasses} animate-fade-in`}
    >
      <ClockIcon className="me-2 h-5 w-5" />
      {text}
    </div>
  );
};

export default EventCountdown;
