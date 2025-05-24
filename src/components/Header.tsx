
import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Sun, Moon, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const { state, dispatch } = useStudy();

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const tabs = [
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: BookOpen },
    { id: 'timer', label: 'Pomodoro', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors ${
      state.theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-800 backdrop-blur' 
        : 'bg-white/95 border-gray-200 backdrop-blur'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              StudySync
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : state.theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {state.theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <div className={`text-sm ${
              state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Welcome, {state.profile.name}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : state.theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
