import React from 'react';
// Fix: Import StudentEventRequest and Student types.
import { StudentEventRequest, Student, TaskCategory } from '../types';
import {
  PlusIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUturnLeftIcon,
  BanknotesIcon,
  TruckIcon,
  CakeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
} from './icons';

interface StudentEventManagerProps {
  requests: StudentEventRequest[];
  allStudents: Student[];
  mode: 'student' | 'employee';
  onAdd?: () => void;
  onUpdateRequestStatus?: (
    requestId: string,
    newStatus: 'Approved' | 'Rejected',
  ) => void;
  onRevertRequestStatus?: (requestId: string) => void;
}

const categoryInfo: {
  [key in TaskCategory]: {
    icon: React.FC<{ className?: string }>;
    label: string;
    color: string;
  };
} = {
  [TaskCategory.Logistics]: { icon: TruckIcon, label: 'لوجستية', color: 'text-blue-500' },
  [TaskCategory.Catering]: { icon: CakeIcon, label: 'تموين', color: 'text-pink-500' },
  [TaskCategory.Venue]: { icon: BuildingOfficeIcon, label: 'المكان', color: 'text-purple-500' },
  [TaskCategory.Technical]: { icon: WrenchScrewdriverIcon, label: 'تقنية', color: 'text-gray-600' },
  [TaskCategory.Marketing]: { icon: MegaphoneIcon, label: 'تسويق', color: 'text-amber-500' },
  [TaskCategory.General]: { icon: ClipboardDocumentListIcon, label: 'عامة', color: 'text-indigo-500' },
};

const getStatusBadge = (status: StudentEventRequest['status']) => {
  switch (status) {
    case 'Approved':
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
          <CheckCircleIcon className="-ms-1 me-1.5 h-4 w-4" />
          موافق عليه
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
          <XCircleIcon className="-ms-1 me-1.5 h-4 w-4" />
          مرفوض
        </span>
      );
    case 'Pending':
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
          <ClockIcon className="-ms-1 me-1.5 h-4 w-4" />
          قيد الانتظار
        </span>
      );
  }
};

const StudentEventManager: React.FC<StudentEventManagerProps> = ({
  requests,
  allStudents,
  mode,
  onAdd,
  onUpdateRequestStatus,
  onRevertRequestStatus,
}) => {
  const sortedRequests = [...requests].sort((a, b) => {
    const statusOrder = { Pending: 1, Approved: 2, Rejected: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
  });
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">
          {mode === 'student'
            ? 'طلبات الفعاليات الخاصة بك'
            : 'طلبات فعاليات الطلاب'}
        </h2>
        {mode === 'student' && onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <PlusIcon className="me-2 h-5 w-5" />
            طلب فعالية جديدة
          </button>
        )}
      </div>

      {sortedRequests.length > 0 ? (
        <div className="space-y-6">
          {sortedRequests.map((request) => {
            const creator = allStudents.find((s) => s.id === request.creatorId);
            return (
              <div
                key={request.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {request.eventName}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="me-2 h-4 w-4" />
                          <span>
                            {new Date(request.eventDate).toLocaleDateString(
                              'ar-EG',
                              { year: 'numeric', month: 'long', day: 'numeric' },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center font-semibold text-green-700">
                           <BanknotesIcon className="me-2 h-4 w-4" />
                           <span>{formatCurrency(request.proposedBudget)}</span>
                        </div>
                      </div>
                      {mode === 'employee' && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <UsersIcon className="me-2 h-4 w-4" />
                          <span>
                            مقدم الطلب: {creator?.name || 'غير معروف'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">{getStatusBadge(request.status)}</div>
                  </div>
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <p className="font-semibold text-gray-700">تفاصيل الطلب:</p>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">المكان الأساسي:</span> {request.primaryVenue}</p>
                        {request.alternativeVenue && <p><span className="font-medium">المكان البديل:</span> {request.alternativeVenue}</p>}
                        {request.otherNeeds && <p><span className="font-medium">احتياجات أخرى:</span> {request.otherNeeds}</p>}
                    </div>

                    <p className="font-semibold text-gray-700 pt-2">الاحتياجات (فئات المهام):</p>
                    {request.requiredTaskCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {request.requiredTaskCategories.map(cat => {
                            const info = categoryInfo[cat];
                            const Icon = info.icon;
                            return (
                                <span key={cat} className={`inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium ${info.color}`}>
                                    <Icon className={`-ms-1 me-1.5 h-4 w-4`} />
                                    {info.label}
                                </span>
                            );
                        })}
                      </div>
                    ) : <p className="text-sm text-gray-500">لم يتم تحديد فئات مهام.</p>}

                  </div>
                </div>
                {mode === 'employee' &&
                  onUpdateRequestStatus &&
                  onRevertRequestStatus && (
                    <div className="flex justify-end gap-2 bg-gray-50 p-4">
                      {request.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() =>
                              onUpdateRequestStatus(request.id, 'Rejected')
                            }
                            className="flex items-center rounded-md bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-200"
                          >
                            <XCircleIcon className="me-2 h-5 w-5" />
                            رفض
                          </button>
                          <button
                            onClick={() =>
                              onUpdateRequestStatus(request.id, 'Approved')
                            }
                            className="flex items-center rounded-md bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-200"
                          >
                            <CheckCircleIcon className="me-2 h-5 w-5" />
                            موافقة
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onRevertRequestStatus(request.id)}
                          className="flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                        >
                          <ArrowUturnLeftIcon className="me-2 h-5 w-5" />
                          التراجع عن القرار
                        </button>
                      )}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-white px-6 py-16 text-center shadow-md">
          <h3 className="text-xl font-medium text-gray-700">
            لا توجد طلبات فعاليات
          </h3>
          <p className="mt-2 text-gray-500">
            {mode === 'student'
              ? 'ابدأ بتقديم طلب لتنظيم فعاليتك الأولى!'
              : 'لا توجد طلبات من الطلاب في الوقت الحالي.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentEventManager;
