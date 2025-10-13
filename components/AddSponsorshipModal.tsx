import React, { useState, KeyboardEvent, useEffect } from 'react';
// Fix: Replace Employee with User.
import { SponsorshipRequest, User } from '../types';
import { PlusIcon, XCircleIcon } from './icons';

interface AddSponsorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<
      SponsorshipRequest,
      'status' | 'creatorId' | 'creatorType'
    > & { id?: string },
  ) => void;
  sponsorshipToEdit?: SponsorshipRequest | null;
  // Fix: Replace Employee[] with User[].
  allEmployees: User[];
  // Fix: Update currentUserRole to match App state.
  currentUserRole: 'admin' | 'clubPresident' | null;
  currentUserId: string | null;
}

const AddSponsorshipModal: React.FC<AddSponsorshipModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sponsorshipToEdit,
  allEmployees,
  currentUserRole,
  currentUserId,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [clubName, setClubName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignedToEmployeeId, setAssignedToEmployeeId] = useState('');

  const introTemplate = `انطلاقا من الحرص على تعزيز الأثر المجتمعي من خلال الفعاليات الدينية والثقافية ودعم هذه الجهود بما ينسجم مع {COMPANY_NAME} ورسالته في مجال الضيافة وصناعة القهوة، نقدم لكم دعوة رعاية فعاليات {CLUB_NAME} التابع لإدارة النشاط الطلابي  وفق البنود التالية:`;
  const [introduction, setIntroduction] = useState(
    introTemplate
      .replace('{COMPANY_NAME}', 'الشركة')
      .replace('{CLUB_NAME}', 'النادي'),
  );

  const [clubOffers, setClubOffers] = useState<string[]>([]);
  const [currentClubOffer, setCurrentClubOffer] = useState('');

  const [companyProvides, setCompanyProvides] = useState<string[]>([]);
  const [currentCompanyProvide, setCurrentCompanyProvide] = useState('');

  const isEditMode = !!sponsorshipToEdit;

  const resetForm = () => {
    setCompanyName('');
    setClubName('');
    setDate(new Date().toISOString().split('T')[0]);
    setAssignedToEmployeeId('');
    setIntroduction(
      introTemplate
        .replace('{COMPANY_NAME}', 'الشركة')
        .replace('{CLUB_NAME}', 'النادي'),
    );
    setClubOffers([]);
    setCurrentClubOffer('');
    setCompanyProvides([]);
    setCurrentCompanyProvide('');
  };

  useEffect(() => {
    if (isOpen) {
      if (sponsorshipToEdit) {
        // Populate form for editing
        setCompanyName(sponsorshipToEdit.companyName);
        setClubName(sponsorshipToEdit.clubName);
        setDate(sponsorshipToEdit.date);
        setAssignedToEmployeeId(sponsorshipToEdit.assignedToEmployeeId);
        setIntroduction(sponsorshipToEdit.introduction);
        setClubOffers(sponsorshipToEdit.clubOffers);
        setCompanyProvides(sponsorshipToEdit.companyProvides);
      } else {
        // Reset for adding
        resetForm();
      }
    }
  }, [isOpen, sponsorshipToEdit]);

  useEffect(() => {
    if (isOpen && !isEditMode) {
      const filledTemplate = introTemplate
        .replace('{COMPANY_NAME}', companyName || 'الشركة')
        .replace('{CLUB_NAME}', clubName || 'النادي');
      setIntroduction(filledTemplate);
    }
  }, [companyName, clubName, isOpen, isEditMode]);

  const handleAddItem = (
    item: string,
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    setCurrentItem: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (item.trim()) {
      setItems((prev) => [...prev, item.trim()]);
      setCurrentItem('');
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    item: string,
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    setCurrentItem: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem(item, setItems, setCurrentItem);
    }
  };

  const handleRemoveItem = (
    index: number,
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      companyName.trim() &&
      clubName.trim() &&
      // Fix: Use 'admin' and 'clubPresident' roles.
      (currentUserRole === 'admin' ||
        (currentUserRole === 'clubPresident' && assignedToEmployeeId))
    ) {
      onSave({
        id: sponsorshipToEdit?.id,
        companyName,
        clubName,
        date,
        introduction,
        clubOffers,
        companyProvides,
        assignedToEmployeeId:
          // Fix: Use 'admin' role.
          currentUserRole === 'admin'
            ? sponsorshipToEdit?.assignedToEmployeeId || currentUserId!
            : assignedToEmployeeId,
      });
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl transform rounded-lg bg-white p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          {isEditMode ? 'تعديل طلب الرعاية' : 'إنشاء طلب رعاية جديد'}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto pr-2"
        >
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="">
              <label
                htmlFor="companyName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                اسم الشركة
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="مثال: شركة عمق"
                required
              />
            </div>
            <div className="">
              <label
                htmlFor="clubName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                اسم النادي/الجهة
              </label>
              <input
                type="text"
                id="clubName"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="مثال: نادي التوجيه الديني"
                required
              />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="sponsorshipDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                تاريخ الخطاب
              </label>
              <input
                type="date"
                id="sponsorshipDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>
            {/* Fix: Use 'clubPresident' role. */}
            {currentUserRole === 'clubPresident' && !isEditMode && (
              <div>
                <label
                  htmlFor="assignEmployee"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  إسناد إلى الموظف
                </label>
                <select
                  id="assignEmployee"
                  value={assignedToEmployeeId}
                  onChange={(e) => setAssignedToEmployeeId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                >
                  <option value="">-- اختر الموظف المسؤول --</option>
                  {allEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {/* Fix: Use 'username' instead of 'name'. */}
                      {emp.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="introduction"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              مقدمة الخطاب
            </label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Club Offers Section */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-800">
                ما سيقدمه النادي:
              </h3>
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={currentClubOffer}
                  onChange={(e) => setCurrentClubOffer(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      currentClubOffer,
                      setClubOffers,
                      setCurrentClubOffer,
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                  placeholder="أضف بندًا..."
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddItem(
                      currentClubOffer,
                      setClubOffers,
                      setCurrentClubOffer,
                    )
                  }
                  className="shrink-0 rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-2">
                {clubOffers.map((offer, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-md bg-gray-50 p-2 text-sm"
                  >
                    <span className="text-gray-700">{offer}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index, setClubOffers)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Provides Section */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-800">
                ما ستقدمه الشركة:
              </h3>
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={currentCompanyProvide}
                  onChange={(e) => setCurrentCompanyProvide(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      currentCompanyProvide,
                      setCompanyProvides,
                      setCurrentCompanyProvide,
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                  placeholder="أضف بندًا..."
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddItem(
                      currentCompanyProvide,
                      setCompanyProvides,
                      setCurrentCompanyProvide,
                    )
                  }
                  className="shrink-0 rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-2">
                {companyProvides.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-md bg-gray-50 p-2 text-sm"
                  >
                    <span className="text-gray-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index, setCompanyProvides)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4 space-x-reverse border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow transition-colors hover:bg-blue-700"
            >
              {isEditMode ? 'حفظ التعديلات' : 'إنشاء وحفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSponsorshipModal;
