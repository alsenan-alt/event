import React from 'react';
import { SponsorshipRequest } from '../types';
import { ArrowRightIcon } from './icons';

interface SponsorshipLetterProps {
  request: SponsorshipRequest;
  onBack: () => void;
  assignedEmployeeName: string;
  canPrintAndEdit: boolean;
}

const SponsorshipLetter: React.FC<SponsorshipLetterProps> = ({
  request,
  onBack,
  assignedEmployeeName,
  canPrintAndEdit,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowRightIcon className="me-2 h-5 w-5" />
          العودة إلى كل الطلبات
        </button>
        {canPrintAndEdit && (
          <button
            onClick={handlePrint}
            className="rounded-md bg-green-600 px-4 py-2 text-white shadow transition-colors hover:bg-green-700"
          >
            طباعة الخطاب
          </button>
        )}
      </div>

      <div
        id="printable-letter"
        className="rounded-lg bg-white p-8 shadow-xl sm:p-12"
      >
        {/* Header */}
        <header className="border-b-2 border-black pb-4">
          <div className="text-center">
            <p className="font-amiri mb-4 text-3xl">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-2/5 text-center">
              <p className="text-xs font-bold uppercase">
                MINISTRY OF HIGHER EDUCATION
              </p>
              <p className="font-unifraktur my-2 text-xl tracking-wide">
                King Fahd University of Petroleum & Minerals
              </p>
              <p className="text-sm font-semibold uppercase">
                DEANSHIP OF STUDENT AFFAIRS
              </p>
              <p className="font-semibold text-amber-800">
                Student Activities & Programs
              </p>
            </div>

            <div className="w-1/5 flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/3/30/King_Fahd_University_of_Petroleum_and_Minerals_logo.png"
                  alt="KFUPM Logo"
                  className="max-h-full max-w-full"
                />
              </div>
            </div>

            <div className="w-2/5 text-center font-tajawal">
              <h2 className="font-bold">وزارة التعليم العالي</h2>
              <h1 className="my-2 text-2xl font-bold">
                جامعة الملك فهد للبترول والمعادن
              </h1>
              <p className="text-lg font-semibold">عمادة شؤون الطلاب</p>
              <p className="font-semibold text-amber-800">
                الأنشطة والبرامج الطلابية
              </p>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="mt-8" style={{ minHeight: '60vh' }}>
          <div className="mb-4 flex justify-between">
            <p className="">
              التاريخ:{' '}
              {new Date(request.date).toLocaleDateString('ar-EG-u-nu-latn', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600">
              الموظف المسؤول:
              <span className="font-semibold"> {assignedEmployeeName}</span>
            </p>
          </div>

          <p className="mb-6 text-lg">
            إلى السادة/ {request.companyName}
            <span className="float-left">المحترمين</span>
          </p>

          <p className="mb-8 whitespace-pre-line text-justify leading-relaxed">
            {request.introduction}
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 border-b-2 border-gray-200 pb-2 text-xl font-bold">
                ما سيقدمه: {request.clubName}
              </h3>
              {request.clubOffers.length > 0 ? (
                <ul className="list-inside list-decimal space-y-2 pr-4">
                  {request.clubOffers.map((offer, index) => (
                    <li key={index}>{offer}</li>
                  ))}
                </ul>
              ) : (
                <p className="pr-4 text-gray-500">لم يتم تحديد أي بنود.</p>
              )}
            </div>

            <div>
              <h3 className="mb-4 border-b-2 border-gray-200 pb-2 text-xl font-bold">
                ما ستقدمه: {request.companyName}
              </h3>
              {request.companyProvides.length > 0 ? (
                <ul className="list-inside list-decimal space-y-2 pr-4">
                  {request.companyProvides.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="pr-4 text-gray-500">لم يتم تحديد أي بنود.</p>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16">
          <div className="w-1/3">
            <p className="font-semibold">أحمد بن عبد الحميد المغلوث</p>
            <p className="font-semibold">مدير إدارة النشاط الطلابي</p>
          </div>
          <div className="mt-8 border-t-2 border-black pt-4 text-center text-xs">
            <p>
              ص.ب 5028 – الظهران 31261 - المملكة العربية السعودية هاتف 2377-860
              (013) - فاكس (03) 860-7487
            </p>
            <p>
              P.O.Box 5028 • Dhahran 31261 • Saudi Arabia Phone (03) 860-7487 •
              E-mail: student-activities@kfupm.edu.sa
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SponsorshipLetter;
