
import React, { useState, useEffect } from 'react';
import { StudyProvider, useStudy } from '../contexts/StudyContext';
import Header from '../components/Header';
import NotesSection from '../components/NotesSection';
import TasksSection from '../components/TasksSection';
import PomodoroTimer from '../components/PomodoroTimer';
import ProfileSection from '../components/ProfileSection';

const StudySyncApp = () => {
  const { state } = useStudy();
  const [activeTab, setActiveTab] = useState('notes');

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'notes':
        return <NotesSection />;
      case 'tasks':
        return <TasksSection />;
      case 'timer':
        return <PomodoroTimer />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <NotesSection />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      state.theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {renderActiveSection()}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <StudyProvider>
      <StudySyncApp />
    </StudyProvider>
  );
};

export default Index;
