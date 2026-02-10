
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import EventCard from './components/EventCard';
import EventDetails from './components/EventDetails';
import AddEventModal from './components/AddEventModal';
import AddTaskModal from './components/AddTaskModal';
import ConfirmationModal from './components/ConfirmationModal';
import LoginScreen from './components/LoginScreen';
import SponsorshipManager from './components/SponsorshipManager';
import AddSponsorshipModal from './components/AddSponsorshipModal';
import SponsorshipLetter from './components/SponsorshipLetter';
import RegistrationModal from './components/RegistrationRoleModal';
import EmployeeManager from './components/EmployeeManager';
import EmployeeModal from './components/EmployeeModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import {
  Event,
  Task,
  TaskStatus,
  TaskCategory,
  SponsorshipRequest,
  Admin,
  ClubPresident,
  User,
} from './types';
import { PlusIcon, ArrowUpTrayIcon } from './components/icons';

// Helper function to get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
  }
  return defaultValue;
};

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(() =>
    getInitialState('events', []),
  );
  const [admins, setAdmins] = useState<Admin[]>(() =>
    getInitialState('admins', []),
  );
  const [clubPresidents, setClubPresidents] = useState<ClubPresident[]>(() =>
    getInitialState('clubPresidents', []),
  );
  const [sponsorshipRequests, setSponsorshipRequests] = useState<
    SponsorshipRequest[]
  >(() => getInitialState('sponsorshipRequests', []));

  const [currentUser, setCurrentUser] = useState<
    (User & { role: 'admin' | 'clubPresident' }) | null
  >(() => getInitialState('currentUser', null));

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use useEffect to persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem('clubPresidents', JSON.stringify(clubPresidents));
  }, [clubPresidents]);

  useEffect(() => {
    localStorage.setItem(
      'sponsorshipRequests',
      JSON.stringify(sponsorshipRequests),
    );
  }, [sponsorshipRequests]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  const [loginError, setLoginError] = useState('');

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSponsorship, setSelectedSponsorship] =
    useState<SponsorshipRequest | null>(null);
  const [currentView, setCurrentView] = useState<
    'events' | 'sponsorships' | 'employees'
  >('events');

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [sponsorshipToEdit, setSponsorshipToEdit] =
    useState<SponsorshipRequest | null>(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<User | null>(null);
  const [
    isConfirmDeleteEmployeeModalOpen,
    setIsConfirmDeleteEmployeeModalOpen,
  ] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<User | null>(null);

  const [isConfirmDeleteEventModalOpen, setIsConfirmDeleteEventModalOpen] =
    useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);

  const [
    isConfirmDeleteSponsorshipModalOpen,
    setIsConfirmDeleteSponsorshipModalOpen,
  ] = useState(false);
  const [sponsorshipToDeleteId, setSponsorshipToDeleteId] = useState<
    string | null
  >(null);

  const [isConfirmDeleteAccountModalOpen, setIsConfirmDeleteAccountModalOpen] =
    useState(false);

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [roleToRegister, setRoleToRegister] = useState<
    'admin' | 'clubPresident' | null
  >(null);

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleLogin = (
    usernameOrEmail: string,
    password: string,
    role: 'admin' | 'clubPresident',
  ) => {
    setLoginError('');
    let user: User | undefined;
    const userList = role === 'admin' ? admins : clubPresidents;

    user = userList.find(
      (u) =>
        (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
        u.password === password,
    );

    if (user) {
      setCurrentUser({ ...user, role });
      setCurrentView('events');
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedEvent(null);
    setSelectedSponsorship(null);
    setCurrentView('events');
  };

  const handleOpenRegister = (role: 'admin' | 'clubPresident') => {
    setRoleToRegister(role);
    setIsRegistrationModalOpen(true);
  };

  const handleRegister = (
    data: {
      username: string;
      email: string;
      password: string;
    },
    role: 'admin' | 'clubPresident',
  ) => {
    const newUser = {
      id: `${role}-${Date.now()}`,
      ...data,
    };

    if (role === 'admin') {
      setAdmins([...admins, newUser]);
    } else {
      setClubPresidents([...clubPresidents, newUser]);
    }

    setIsRegistrationModalOpen(false);
    alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
  };

  const handleRecoverPassword = (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find in admins
    let foundUser = admins.find(a => a.email.toLowerCase() === normalizedEmail);
    if (!foundUser) {
      // Find in club presidents
      foundUser = clubPresidents.find(p => p.email.toLowerCase() === normalizedEmail);
    }

    if (foundUser) {
      // Simulate sending email via mailto
      const subject = encodeURIComponent('استعادة كلمة المرور - وحدة دعم المبادرات والأنشطة');
      const body = encodeURIComponent(`مرحباً ${foundUser.username}،\n\nلقد تلقينا طلباً لاستعادة كلمة المرور الخاصة بك.\n\nكلمة المرور الحالية هي: ${foundUser.password}\n\nيرجى الحفاظ على سرية هذه البيانات.`);
      
      const mailtoLink = `mailto:${foundUser.email}?subject=${subject}&body=${body}`;
      
      setIsForgotPasswordModalOpen(false);
      window.location.href = mailtoLink;
      
      // Also show an alert for immediate feedback
      alert(`تم العثور على حسابك! سيتم فتح تطبيق البريد الخاص بك لإرسال كلمة المرور إلى: ${foundUser.email}`);
    } else {
      alert('عذراً، هذا البريد الإلكتروني غير مسجل في النظام لدينا.');
    }
  };

  const handleDeleteCurrentUserAccount = () => {
    if (!currentUser) return;

    if (currentUser.role === 'admin') {
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.id !== currentUser.id),
      );
    } else if (currentUser.role === 'clubPresident') {
      setClubPresidents((prevPresidents) =>
        prevPresidents.filter((p) => p.id !== currentUser.id),
      );
    }

    setIsConfirmDeleteAccountModalOpen(false);
    handleLogout();
  };

  const handleSaveEmployee = (
    employeeData: Omit<User, 'id'> & { id?: string },
  ) => {
    if (employeeData.id) {
      // Edit mode
      setAdmins(
        admins.map((admin) =>
          admin.id === employeeData.id ? { ...admin, ...employeeData } : admin,
        ),
      );
    } else {
      // Add mode
      const newAdmin: Admin = {
        id: `admin-${Date.now()}`,
        username: employeeData.username,
        email: employeeData.email,
        password: employeeData.password,
        phone: employeeData.phone,
      };
      setAdmins([...admins, newAdmin]);
    }
    setIsEmployeeModalOpen(false);
    setEmployeeToEdit(null);
  };

  const handleImportEmployees = (importedEmployees: User[]) => {
    // Basic validation and merging logic
    const currentEmails = new Set(admins.map(a => a.email.toLowerCase()));
    const newAdmins: Admin[] = [];

    importedEmployees.forEach(emp => {
      // Ensure it's a valid admin object
      if (emp.username && emp.email && !currentEmails.has(emp.email.toLowerCase())) {
        newAdmins.push({
          ...emp,
          id: emp.id || `admin-imp-${Date.now()}-${Math.random()}`
        } as Admin);
      }
    });

    if (newAdmins.length > 0) {
      setAdmins([...admins, ...newAdmins]);
      alert(`تم استيراد ${newAdmins.length} موظف بنجاح.`);
    } else {
      alert('لم يتم استيراد أي موظفين جدد (قد يكونون موجودين مسبقاً).');
    }
  };

  const handleOpenDeleteEmployeeModal = (employee: User) => {
    if (currentUser?.id === employee.id) {
      alert('لا يمكنك حذف حسابك الخاص من هنا.');
      return;
    }
    setEmployeeToDelete(employee);
    setIsConfirmDeleteEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = () => {
    if (!employeeToDelete) return;
    setAdmins(admins.filter((admin) => admin.id !== employeeToDelete.id));
    setIsConfirmDeleteEmployeeModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
  };

  const handleAddEvent = (
    name: string,
    date: string,
    approximateBudget: number,
  ) => {
    if (!currentUser) return;
    const newEvent: Event = {
      id: new Date().toISOString(),
      name,
      date,
      approximateBudget,
      tasks: [],
      createdBy: currentUser.id,
    };
    setEvents([...events, newEvent]);
  };

  const handleImportEventClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedEvent = JSON.parse(event.target?.result as string) as Event;
        
        // Basic validation
        if (!importedEvent.name || !importedEvent.date || !Array.isArray(importedEvent.tasks)) {
          throw new Error('ملف الفعالية غير صالح.');
        }

        // Check if event already exists (by name and date) or generate new ID if needed
        const alreadyExists = events.some(ev => ev.id === importedEvent.id);
        const finalEvent = alreadyExists 
          ? { ...importedEvent, id: `imported-${Date.now()}`, name: `${importedEvent.name} (نسخة)` }
          : importedEvent;

        setEvents([...events, finalEvent]);
        alert(`تم استيراد الفعالية "${finalEvent.name}" بنجاح!`);
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء استيراد الفعالية. تأكد من أن الملف بصيغة JSON صحيحة.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleOpenConfirmDeleteEventModal = (event: Event) => {
    setEventToDeleteId(event.id);
    setIsConfirmDeleteEventModalOpen(true);
  };

  const handleDeleteEvent = () => {
    if (!eventToDeleteId || !currentUser) return;
    const eventToDelete = events.find((event) => event.id === eventToDeleteId);
    if (eventToDelete?.createdBy !== currentUser.id) {
      alert('ليس لديك الصلاحية لحذف هذه الفعالية.');
      return;
    }
    setEvents(events.filter((event) => event.id !== eventToDeleteId));
    setIsConfirmDeleteEventModalOpen(false);
    setEventToDeleteId(null);
  };

  const handleSaveTask = (
    name: string,
    assignedTo: User[],
    isOptional: boolean,
    category: TaskCategory,
    reminderDate?: string,
    cost?: number,
  ) => {
    if (!selectedEvent || currentUser?.id !== selectedEvent.createdBy) return;

    const taskData = {
      name,
      assignedTo,
      isOptional,
      category,
      reminderDate,
      cost,
    };

    if (taskToEdit) {
      const updatedTask = { ...taskToEdit, ...taskData };
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              tasks: event.tasks.map((t) =>
                t.id === updatedTask.id ? updatedTask : t,
              ),
            }
          : event,
      );
      setEvents(updatedEvents);
      setSelectedEvent(
        updatedEvents.find((e) => e.id === selectedEvent.id) || null,
      );
    } else {
      const newTask: Task = {
        id: new Date().toISOString(),
        status: TaskStatus.ToDo,
        ...taskData,
      };
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, tasks: [...event.tasks, newTask] }
          : event,
      );
      setEvents(updatedEvents);
      setSelectedEvent(
        updatedEvents.find((e) => e.id === selectedEvent.id) || null,
      );
    }
  };

  const handleUpdateTaskStatus = (updatedTask: Task) => {
    if (!selectedEvent) return;
    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          tasks: event.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task,
          ),
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setSelectedEvent(
      updatedEvents.find((e) => e.id === selectedEvent.id) || null,
    );
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedEvent || currentUser?.id !== selectedEvent.createdBy) return;

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          tasks: event.tasks.filter((task) => task.id !== taskId),
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setSelectedEvent(
      updatedEvents.find((e) => e.id === selectedEvent.id) || null,
    );
  };

  const handleSaveSponsorship = (
    data: Omit<SponsorshipRequest, 'status' | 'creatorId' | 'creatorType'> & {
      id?: string;
    },
  ) => {
    if (!currentUser) return;

    if (data.id) {
      const updatedData = { ...data };
      delete updatedData.id;

      setSponsorshipRequests(
        sponsorshipRequests.map((req) =>
          req.id === data.id ? { ...req, ...updatedData } : req,
        ),
      );
    } else {
      const newRequest: SponsorshipRequest = {
        id: `sp-${new Date().toISOString()}`,
        ...data,
        status: 'Draft',
        creatorId: currentUser.id,
        creatorType: currentUser.role,
      };
      setSponsorshipRequests([...sponsorshipRequests, newRequest]);
    }
  };

  const handleDeleteSponsorship = () => {
    if (!sponsorshipToDeleteId || !currentUser) return;
    const requestToDelete = sponsorshipRequests.find(
      (req) => req.id === sponsorshipToDeleteId,
    );
    if (requestToDelete?.creatorId !== currentUser.id) {
      alert('ليس لديك الصلاحية لحذف طلب الرعاية هذا.');
      return;
    }
    setSponsorshipRequests(
      sponsorshipRequests.filter((req) => req.id !== sponsorshipToDeleteId),
    );
    setIsConfirmDeleteSponsorshipModalOpen(false);
    setSponsorshipToDeleteId(null);
  };

  const renderContent = () => {
    if (currentView === 'employees') {
      if (currentUser?.role !== 'admin') {
        return (
          <div className="text-center text-red-600">
            <p>ليس لديك صلاحية الوصول لهذه الصفحة.</p>
          </div>
        );
      }
      return (
        <EmployeeManager
          employees={admins}
          onAdd={() => {
            setEmployeeToEdit(null);
            setIsEmployeeModalOpen(true);
          }}
          onEdit={(employee) => {
            setEmployeeToEdit(employee);
            setIsEmployeeModalOpen(true);
          }}
          onDelete={handleOpenDeleteEmployeeModal}
          onImport={handleImportEmployees}
        />
      );
    }

    if (currentView === 'sponsorships') {
      if (selectedSponsorship) {
        const canPrintAndEdit =
          currentUser?.role === 'admin' &&
          currentUser?.id === selectedSponsorship.assignedToEmployeeId;

        return (
          <SponsorshipLetter
            request={selectedSponsorship}
            onBack={() => setSelectedSponsorship(null)}
            assignedEmployeeName={
              admins.find(
                (a) => a.id === selectedSponsorship.assignedToEmployeeId,
              )?.username || 'غير محدد'
            }
            canPrintAndEdit={canPrintAndEdit}
          />
        );
      }
      return (
        <SponsorshipManager
          requests={sponsorshipRequests.filter(
            (r) =>
              r.creatorId === currentUser?.id ||
              (currentUser?.role === 'admin' &&
                r.assignedToEmployeeId === currentUser.id),
          )}
          allEmployees={admins}
          onAdd={() => setIsSponsorshipModalOpen(true)}
          onSelect={setSelectedSponsorship}
          onDelete={(id) => {
            setSponsorshipToDeleteId(id);
            setIsConfirmDeleteSponsorshipModalOpen(true);
          }}
          onEdit={(req) => {
            setSponsorshipToEdit(req);
            setIsSponsorshipModalOpen(true);
          }}
          currentUser={currentUser}
          currentUserRole={currentUser?.role || null}
        />
      );
    }

    if (selectedEvent) {
      return (
        <EventDetails
          event={selectedEvent}
          onBack={handleBackToList}
          onUpdateTask={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
          onOpenAddTaskModal={() => setIsTaskModalOpen(true)}
          onOpenEditTaskModal={(task) => {
            setTaskToEdit(task);
            setIsTaskModalOpen(true);
          }}
          currentUser={currentUser}
        />
      );
    }

    // Default view: events
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            الفعاليات القادمة
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleImportEventClick}
              className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <ArrowUpTrayIcon className="me-2 h-5 w-5" />
              استيراد فعالية
            </button>
            <button
              onClick={() => setIsAddEventModalOpen(true)}
              className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-lg transition-colors hover:bg-blue-700"
            >
              <PlusIcon className="me-2 h-5 w-5" />
              فعالية جديدة
            </button>
          </div>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={handleSelectEvent}
                  onDelete={handleOpenConfirmDeleteEventModal}
                  currentUser={currentUser}
                />
              ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white px-6 py-16 text-center shadow-md">
            <h3 className="text-xl font-medium text-gray-700">
              لا توجد فعاليات مجدولة
            </h3>
            <p className="mt-2 text-gray-500">
              ابدأ بتنظيم فعاليتك الأولى الآن أو استورد فعالية مشتركة!
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          onSwitchToRegister={handleOpenRegister}
          onForgotPassword={() => setIsForgotPasswordModalOpen(true)}
          error={loginError}
        />
        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          onRegister={handleRegister}
          roleToRegister={roleToRegister}
        />
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
          onRecover={handleRecoverPassword}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setSelectedSponsorship(null);
          setSelectedEvent(null);
          setCurrentView(view);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenDeleteAccountModal={() =>
          setIsConfirmDeleteAccountModalOpen(true)
        }
      />
      <main className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onAddEvent={handleAddEvent}
      />

      {selectedEvent && (
        <AddTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setTaskToEdit(null);
          }}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
          allEmployees={admins}
        />
      )}

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onSave={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
        currentUser={currentUser}
      />

      <AddSponsorshipModal
        isOpen={isSponsorshipModalOpen}
        onClose={() => {
          setIsSponsorshipModalOpen(false);
          setSponsorshipToEdit(null);
        }}
        onSave={handleSaveSponsorship}
        sponsorshipToEdit={sponsorshipToEdit}
        allEmployees={admins}
        currentUserRole={currentUser?.role || null}
        currentUserId={currentUser.id}
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteEventModalOpen}
        onClose={() => setIsConfirmDeleteEventModalOpen(false)}
        onConfirm={handleDeleteEvent}
        title="تأكيد حذف الفعالية"
        message="هل أنت متأكد من رغبتك في حذف هذه الفعالية؟ لا يمكن التراجع عن هذا الإجراء."
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteSponsorshipModalOpen}
        onClose={() => setIsConfirmDeleteSponsorshipModalOpen(false)}
        onConfirm={handleDeleteSponsorship}
        title="تأكيد حذف طلب الرعاية"
        message="هل أنت متأكد من رغبتك في حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteAccountModalOpen}
        onClose={() => setIsConfirmDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteCurrentUserAccount}
        title="تأكيد حذف الحساب"
        message="هل أنت متأكد من رغبتك في حذف حسابك بشكل دائم؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="نعم، احذف حسابي"
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteEmployeeModalOpen}
        onClose={() => setIsConfirmDeleteEmployeeModalOpen(false)}
        onConfirm={handleDeleteEmployee}
        title="تأكيد حذف الموظف"
        message={`هل أنت متأكد من رغبتك في حذف حساب الموظف "${employeeToDelete?.username}"؟ سيتم إزالته من أي مهام مسندة إليه.`}
      />
    </div>
  );
};

export default App;
