import React from 'react';
// Fix: Replace Employee with User
import { User } from '../types';
import {
  UserPlusIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
} from './icons';

interface EmployeeManagerProps {
  // Fix: Replace Employee with User
  employees: User[];
  onAdd: () => void;
  onEdit: (employee: User) => void;
  onDelete: (employee: User) => void;
}

const EmployeeManager: React.FC<EmployeeManagerProps> = ({
  employees,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">إدارة الموظفين</h2>
        <button
          onClick={onAdd}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          <UserPlusIcon className="me-2 h-5 w-5" />
          إضافة موظف
        </button>
      </div>

      {employees.length > 0 ? (
        <div className="overflow-hidden rounded-lg bg-white shadow-xl">
          <ul className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <li
                key={employee.id}
                className="p-4 transition-colors hover:bg-gray-50 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center">
                    <div className="mr-4 rounded-full bg-gray-100 p-3">
                      <UsersIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="truncate text-lg font-bold text-gray-900">
                        {/* Fix: use username instead of name */}
                        {employee.username}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-gray-500">
                        {employee.phone && (
                          <div className="flex items-center">
                            <PhoneIcon className="me-1.5 h-4 w-4 text-gray-400" />
                            <span>{employee.phone}</span>
                          </div>
                        )}
                        {employee.email && (
                          <div className="flex items-center">
                            <EnvelopeIcon className="me-1.5 h-4 w-4 text-gray-400" />
                            <span>{employee.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => onEdit(employee)}
                      className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-blue-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
                      className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-lg bg-white px-6 py-16 text-center shadow-md">
          <h3 className="text-xl font-medium text-gray-700">
            لا يوجد موظفون مضافون
          </h3>
          <p className="mt-2 text-gray-500">
            ابدأ بإضافة موظفين لإسناد المهام إليهم.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;
