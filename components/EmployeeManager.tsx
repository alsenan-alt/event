
import React, { useRef } from 'react';
import { User } from '../types';
import {
  UserPlusIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from './icons';

interface EmployeeManagerProps {
  employees: User[];
  onAdd: () => void;
  onEdit: (employee: User) => void;
  onDelete: (employee: User) => void;
  onImport: (importedEmployees: User[]) => void;
}

const EmployeeManager: React.FC<EmployeeManagerProps> = ({
  employees,
  onAdd,
  onEdit,
  onDelete,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (employees.length === 0) {
      alert('لا توجد بيانات فريق لتصديرها.');
      return;
    }
    const dataStr = JSON.stringify(employees, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImport(imported);
        } else {
          alert('ملف غير صالح. يجب أن يحتوي الملف على قائمة أعضاء فريق.');
        }
      } catch (err) {
        alert('خطأ في قراءة الملف. تأكد من أنه ملف JSON صحيح.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
             <h2 className="text-4xl font-black text-gray-900 tracking-tight">إدارة فريق العمل</h2>
           </div>
           <p className="text-gray-400 font-bold text-sm">قم ببناء وتصدير قائمة الفريق لإسناد المتطلبات الإدارية إليهم</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />
          <button
            onClick={handleExport}
            className="group flex items-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            title="تصدير بيانات الفريق"
          >
            <ArrowDownTrayIcon className="me-2 h-5 w-5 text-blue-500 transition-transform group-hover:translate-y-0.5" />
            تصدير
          </button>
          <button
            onClick={handleImportClick}
            className="group flex items-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            title="استيراد بيانات فريق"
          >
            <ArrowUpTrayIcon className="me-2 h-5 w-5 text-indigo-500 transition-transform group-hover:-translate-y-0.5" />
            استيراد
          </button>
          <button
            onClick={onAdd}
            className="flex items-center rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
          >
            <UserPlusIcon className="me-2 h-5 w-5" />
            إضافة عضو جديد
          </button>
        </div>
      </div>

      {employees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="group relative bg-white p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner border border-white">
                  {employee.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800 tracking-tight leading-none mb-1">
                    {employee.username}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-50 px-2.5 py-1 rounded-lg">عضو فريق</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {employee.phone && (
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100 transition-colors hover:bg-white hover:border-blue-100 group/item">
                    <PhoneIcon className="h-4 w-4 text-blue-300 group-hover/item:text-blue-500 transition-colors" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.email && (
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100 transition-colors hover:bg-white hover:border-blue-100 group/item">
                    <EnvelopeIcon className="h-4 w-4 text-blue-300 group-hover/item:text-blue-500 transition-colors" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => onEdit(employee)}
                  className="flex-grow flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <PencilIcon className="h-4 w-4" />
                  تعديل البيانات
                </button>
                <button
                  onClick={() => onDelete(employee)}
                  className="p-3 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[3rem] bg-white px-6 py-24 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-gray-50">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
              <UsersIcon className="h-10 w-10 text-gray-300" />
           </div>
          <h3 className="text-2xl font-black text-gray-800">
            لا يوجد أعضاء في فريق العمل
          </h3>
          <p className="mt-2 text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
            ابدأ ببناء فريقك الخاص أو استورد قائمة جاهزة لتتمكن من إسناد المتطلبات الإدارية إليهم.
          </p>
          <button
             onClick={onAdd}
             className="mt-8 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
          >
             إنشاء أول عضو في الفريق
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;
