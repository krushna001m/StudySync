
import React, { useState } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Plus, Search, BookOpen, Sparkles, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const NotesSection = () => {
  const { state, dispatch } = useStudy();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    subject: 'General'
  });

  const subjects = ['All', ...Array.from(new Set(state.notes.map(note => note.subject)))];
  const filteredNotes = state.notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = state.currentSubject === 'All Subjects' || note.subject === state.currentSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject,
        createdAt: new Date()
      };
      dispatch({ type: 'ADD_NOTE', payload: note });
      setNewNote({ title: '', content: '', subject: 'General' });
      setIsCreating(false);
    }
  };

  const handleUpdateNote = (id: string) => {
    const note = state.notes.find(n => n.id === id);
    if (note) {
      dispatch({ type: 'UPDATE_NOTE', payload: { ...note, ...newNote } });
      setEditingId(null);
      setNewNote({ title: '', content: '', subject: 'General' });
    }
  };

  const handleDeleteNote = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  const generateSummary = async (noteId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (!note) return;

    // Simulate AI summary generation (replace with actual OpenAI API call)
    const mockSummary = `Key points: ${note.content.split(' ').slice(0, 10).join(' ')}...`;
    
    dispatch({ 
      type: 'UPDATE_NOTE', 
      payload: { ...note, summary: mockSummary }
    });
  };

  const startEditing = (note: any) => {
    setEditingId(note.id);
    setNewNote({
      title: note.title,
      content: note.content,
      subject: note.subject
    });
  };

  return (
    <div className={`min-h-screen transition-colors ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Study Notes
              </h2>
              <p className={`${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Organize and enhance your study materials with AI
              </p>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={state.currentSubject}
              onChange={(e) => dispatch({ type: 'SET_CURRENT_SUBJECT', payload: e.target.value })}
              className={`px-4 py-2 rounded-lg border ${
                state.theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="All Subjects">All Subjects</option>
              {subjects.filter(s => s !== 'All').map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Create/Edit Note Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Note' : 'Create New Note'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <Input
                placeholder="Subject..."
                value={newNote.subject}
                onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
              />
              <Textarea
                placeholder="Write your note content here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
              />
              <div className="flex gap-2">
                <Button
                  onClick={editingId ? () => handleUpdateNote(editingId) : handleCreateNote}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {editingId ? 'Update Note' : 'Create Note'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setNewNote({ title: '', content: '', subject: 'General' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{note.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {note.subject}
                    </Badge>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(note)}
                      className="w-8 h-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-4 line-clamp-3 ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {note.content}
                </p>
                
                {note.summary && (
                  <div className={`p-3 rounded-lg mb-4 ${
                    state.theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <div className="flex items-center mb-2">
                      <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        AI Summary
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-200">
                      {note.summary}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {note.createdAt.toLocaleDateString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateSummary(note.id)}
                    disabled={!!note.summary}
                    className="text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {note.summary ? 'Summarized' : 'AI Summary'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
              state.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-medium mb-2 ${
              state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              No notes found
            </h3>
            <p className={`${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSection;
