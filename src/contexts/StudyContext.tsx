
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: Date;
  summary?: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  subject?: string;
}

interface StudySession {
  id: string;
  duration: number;
  subject: string;
  date: Date;
}

interface UserProfile {
  name: string;
  email: string;
  studyGoal: number; // minutes per day
  favoriteSubjects: string[];
  avatar?: string;
}

interface StudyState {
  notes: Note[];
  tasks: Task[];
  sessions: StudySession[];
  profile: UserProfile;
  currentSubject: string;
  pomodoroSettings: {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
  };
  theme: 'light' | 'dark';
}

type StudyAction =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_SESSION'; payload: StudySession }
  | { type: 'UPDATE_PROFILE'; payload: UserProfile }
  | { type: 'SET_CURRENT_SUBJECT'; payload: string }
  | { type: 'UPDATE_POMODORO_SETTINGS'; payload: any }
  | { type: 'TOGGLE_THEME' };

const initialState: StudyState = {
  notes: [
    {
      id: '1',
      title: 'Introduction to React',
      content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient rendering.',
      subject: 'Computer Science',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Photosynthesis Process',
      content: 'Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in chloroplasts and involves two main stages: light reactions and dark reactions.',
      subject: 'Biology',
      createdAt: new Date(),
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Complete React assignment',
      completed: false,
      priority: 'high',
      subject: 'Computer Science',
      dueDate: new Date(Date.now() + 86400000)
    },
    {
      id: '2',
      title: 'Study for Biology exam',
      completed: false,
      priority: 'medium',
      subject: 'Biology',
      dueDate: new Date(Date.now() + 172800000)
    }
  ],
  sessions: [],
  profile: {
    name: 'Student User',
    email: 'student@example.com',
    studyGoal: 120,
    favoriteSubjects: ['Computer Science', 'Biology', 'Mathematics']
  },
  currentSubject: 'All Subjects',
  pomodoroSettings: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15
  },
  theme: 'light'
};

const studyReducer = (state: StudyState, action: StudyAction): StudyState => {
  switch (action.type) {
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id ? action.payload : note
        )
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'UPDATE_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_CURRENT_SUBJECT':
      return { ...state, currentSubject: action.payload };
    case 'UPDATE_POMODORO_SETTINGS':
      return { ...state, pomodoroSettings: { ...state.pomodoroSettings, ...action.payload } };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
};

const StudyContext = createContext<{
  state: StudyState;
  dispatch: React.Dispatch<StudyAction>;
} | undefined>(undefined);

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  return (
    <StudyContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
