
import React, { useState } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Plus, Calendar, Flag, Check, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const TasksSection = () => {
  const { state, dispatch } = useStudy();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    subject: '',
    dueDate: ''
  });

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        title: newTask.title,
        completed: false,
        priority: newTask.priority,
        subject: newTask.subject || undefined,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
      };
      dispatch({ type: 'ADD_TASK', payload: task });
      setNewTask({ title: '', priority: 'medium', subject: '', dueDate: '' });
      setIsCreating(false);
    }
  };

  const handleUpdateTask = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const updatedTask = {
        ...task,
        title: newTask.title,
        priority: newTask.priority,
        subject: newTask.subject || undefined,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      setEditingId(null);
      setNewTask({ title: '', priority: 'medium', subject: '', dueDate: '' });
    }
  };

  const toggleTaskCompletion = (task: any) => {
    dispatch({ 
      type: 'UPDATE_TASK', 
      payload: { ...task, completed: !task.completed }
    });
  };

  const handleDeleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const startEditing = (task: any) => {
    setEditingId(task.id);
    setNewTask({
      title: task.title,
      priority: task.priority,
      subject: task.subject || '',
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const completedTasks = state.tasks.filter(task => task.completed);
  const pendingTasks = state.tasks.filter(task => !task.completed);

  return (
    <div className={`min-h-screen transition-colors ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Task Planner
            </h2>
            <p className={`${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Organize your study tasks and stay productive
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
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
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {state.tasks.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Flag className="w-6 h-6 text-blue-600" />
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
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {completedTasks.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
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
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {pendingTasks.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Task Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Task' : 'Create New Task'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className={`px-4 py-2 rounded-lg border ${
                    state.theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <Input
                  placeholder="Subject (optional)"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                />
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingId ? () => handleUpdateTask(editingId) : handleCreateTask}
                  className="bg-gradient-to-r from-green-500 to-blue-600"
                >
                  {editingId ? 'Update Task' : 'Create Task'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setNewTask({ title: '', priority: 'medium', subject: '', dueDate: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Pending Tasks ({pendingTasks.length})
            </h3>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <Card key={task.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            <Flag className="w-3 h-3 mr-1" />
                            {task.priority}
                          </Badge>
                          {task.subject && (
                            <Badge variant="outline">
                              {task.subject}
                            </Badge>
                          )}
                          {task.dueDate && (
                            <Badge variant="outline">
                              <Calendar className="w-3 h-3 mr-1" />
                              {task.dueDate.toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(task)}
                          className="w-8 h-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-8">
                  <p className={`${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No pending tasks. Great job! 🎉
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Completed Tasks ({completedTasks.length})
            </h3>
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <Card key={task.id} className="group hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium line-through ${
                          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {task.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary">
                            <Check className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                          {task.subject && (
                            <Badge variant="outline">
                              {task.subject}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {completedTasks.length === 0 && (
                <div className="text-center py-8">
                  <p className={`${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No completed tasks yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksSection;
