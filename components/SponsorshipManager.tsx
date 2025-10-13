import React from 'react';
// Fix: Replace Employee/Student with User/Student from types.
import { SponsorshipRequest, User, Student } from '../types';
import {
  BuildingStorefrontIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from './icons';

interface SponsorshipManagerProps {
  requests: SponsorshipRequest[];
  // Fix: Change Employee[] to User[].
  allEmployees: User[];
  onAdd: () => void;
  onSelect: (request: SponsorshipRequest) => void;
  onDelete: (requestId: string) => void;
  onEdit: (request: SponsorshipRequest) => void;
  // Fix: Update currentUser type.
  currentUser: User | null;
  // Fix: Update currentUserRole to match App state.
  currentUserRole: 'admin' | 'clubPresident' | null;
}

const SponsorshipManager: React.FC<SponsorshipManagerProps> = ({
  requests,
  allEmployees,
  onAdd,
  onSelect,
  onDelete,
  onEdit,
  currentUser,
  currentUserRole,
}) => {
  const handleDeleteClick = (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    onDelete(requestId);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">طلبات الرعاية</h2>
        <button
          onClick={onAdd}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          <PlusIcon className="me-2 h-5 w-5" />
          طلب رعاية جديد
        </button>
      </div>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => {
            const assignedEmployee = allEmployees.find(
              (e) => e.id === request.assignedToEmployeeId,
            );
            // Fix: Use 'admin' role for canEdit logic.
            const canEdit =
              currentUserRole === 'admin' &&
              currentUser?.id === request.assignedToEmployeeId &&
              request.status === 'Draft';

            return (
              <div
                key={request.id}
                onClick={() => onSelect(request)}
                className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-lg bg-white shadow-lg duration-300 transition-all hover:scale-105"
              >
                <div className="absolute top-3 left-3 z-10 flex space-x-2 space-x-reverse">
                  {canEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(request);
                      }}
                      className="rounded-full bg-white bg-opacity-50 p-2 text-gray-400 opacity-0 transition-all duration-300 hover:bg-blue-100 hover:text-blue-600 group-hover:opacity-100"
                      aria-label="تعديل الطلب"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteClick(e, request.id)}
                    className="rounded-full bg-white bg-opacity-50 p-2 text-gray-400 opacity-0 transition-all duration-300 hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                    aria-label="حذف الطلب"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 rounded-full bg-blue-100 p-3">
                      <BuildingStorefrontIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {request.companyName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.clubName}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">الحالة:</span>
                      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                        {request.status === 'Draft' ? 'مسودة' : 'مرسل'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">الموظف المسؤول:</span>
                      <span className="font-semibold text-gray-800">
                        {/* Fix: Use 'username' instead of 'name'. */}
                        {assignedEmployee?.username || 'غير محدد'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 px-6 py-3">
                  <span className="font-semibold text-blue-700 hover:underline">
                    عرض الخطاب
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-white px-6 py-16 text-center shadow-md">
          <h3 className="text-xl font-medium text-gray-700">
            لا توجد طلبات رعاية
          </h3>
          <p className="mt-2 text-gray-500">
            ابدأ بإنشاء طلب رعاية جديد للشركات.
          </p>
        </div>
      )}
    </div>
  );
};

export default SponsorshipManager;
