export interface Admin {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, this would be a hash
  phone?: string;
}

export interface ClubPresident {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, this would be a hash
  phone?: string;
}

export type User = Admin | ClubPresident;

export interface Student {
  id: string;
  name: string;
  pin: string;
}

export interface StudentEventRequest {
  id: string;
  eventName: string;
  eventDate: string;
  primaryVenue: string;
  alternativeVenue?: string;
  otherNeeds?: string;
  isBudgeted: boolean;
  assignedToEmployeeId: string; // User ID
  proposedBudget: number;
  requiredTaskCategories: TaskCategory[];
  status: 'Pending' | 'Approved' | 'Rejected';
  creatorId: string; // Student ID
}

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export enum TaskCategory {
  Logistics = 'Logistics',
  Catering = 'Catering',
  Marketing = 'Marketing',
  Technical = 'Technical',
  Venue = 'Venue',
  General = 'General',
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  category: TaskCategory;
  assignedTo: User[]; // User IDs
  isOptional: boolean;
  reminderDate?: string;
  cost?: number;
}

export interface Event {
  id:string;
  name: string;
  date: string;
  tasks: Task[];
  approximateBudget: number;
  createdBy: string; // User ID
}

export interface SponsorshipRequest {
  id: string;
  companyName: string;
  clubName: string;
  introduction: string;
  date: string;
  clubOffers: string[];
  companyProvides: string[];
  status: 'Draft' | 'Sent';
  creatorId: string; // User ID
  creatorType: 'admin' | 'clubPresident';
  assignedToEmployeeId: string; // Admin ID
}
