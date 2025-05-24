
import React, { useState, useEffect } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Play, Pause, RotateCcw, Settings, Clock, Coffee, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const PomodoroTimer = () => {
  const { state, dispatch } = useStudy();
  const [timeLeft, setTimeLeft] = useState(state.pomodoroSettings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('Study Session');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      if (!isBreak) {
        // Work session completed
        setCompletedSessions(prev => prev + 1);
        const session = {
          id: Date.now().toString(),
          duration: state.pomodoroSettings.workDuration,
          subject: currentSubject,
          date: new Date()
        };
        dispatch({ type: 'ADD_SESSION', payload: session });
        
        // Switch to break
        setIsBreak(true);
        setTimeLeft(
          completedSessions % 4 === 3 
            ? state.pomodoroSettings.longBreakDuration * 60
            : state.pomodoroSettings.breakDuration * 60
        );
      } else {
        // Break completed, switch back to work
        setIsBreak(false);
        setTimeLeft(state.pomodoroSettings.workDuration * 60);
      }
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, completedSessions, state.pomodoroSettings, currentSubject, dispatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isBreak 
      ? (completedSessions % 4 === 3 ? state.pomodoroSettings.longBreakDuration : state.pomodoroSettings.breakDuration) * 60
      : state.pomodoroSettings.workDuration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(state.pomodoroSettings.workDuration * 60);
  };

  const updateSettings = (newSettings: any) => {
    dispatch({ type: 'UPDATE_POMODORO_SETTINGS', payload: newSettings });
    resetTimer();
    setShowSettings(false);
  };

  return (
    <div className={`min-h-screen transition-colors ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Pomodoro Timer
          </h2>
          <p className={`${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Stay focused with the Pomodoro Technique
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Sessions Today
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {completedSessions}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Focus Time
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.floor(completedSessions * state.pomodoroSettings.workDuration / 60)}h
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Current Mode
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {isBreak ? 'Break' : 'Focus'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-md mx-auto">
          {/* Timer Display */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {isBreak ? (
                  <>
                    <Coffee className="w-5 h-5" />
                    {completedSessions % 4 === 0 && completedSessions > 0 ? 'Long Break' : 'Short Break'}
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    Focus Session
                  </>
                )}
              </CardTitle>
              {!isBreak && (
                <Input
                  placeholder="What are you working on?"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  className="mt-2"
                />
              )}
            </CardHeader>
            <CardContent className="text-center">
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={state.theme === 'dark' ? '#374151' : '#e5e7eb'}
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={isBreak ? '#10b981' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-4xl font-mono font-bold ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatTime(timeLeft)}
                    </div>
                    <Badge 
                      variant={isBreak ? 'default' : 'destructive'}
                      className="mt-2"
                    >
                      {isBreak ? 'Break Time' : 'Focus Time'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={() => setIsActive(!isActive)}
                  size="lg"
                  className={`${
                    isBreak 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  variant="outline"
                  size="lg"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>

              {/* Session Progress */}
              <div className="flex justify-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < completedSessions % 4
                        ? 'bg-red-500'
                        : state.theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-sm mt-2 ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Session {(completedSessions % 4) + 1} of 4
              </p>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          {showSettings && (
            <Card>
              <CardHeader>
                <CardTitle>Timer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Work Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={state.pomodoroSettings.workDuration}
                    onChange={(e) => updateSettings({ workDuration: Number(e.target.value) })}
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Short Break (minutes)
                  </label>
                  <Input
                    type="number"
                    value={state.pomodoroSettings.breakDuration}
                    onChange={(e) => updateSettings({ breakDuration: Number(e.target.value) })}
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Long Break (minutes)
                  </label>
                  <Input
                    type="number"
                    value={state.pomodoroSettings.longBreakDuration}
                    onChange={(e) => updateSettings({ longBreakDuration: Number(e.target.value) })}
                    min="1"
                    max="60"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
