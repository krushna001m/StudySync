import React, { useState, useRef } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { User, Mail, Target, BookOpen, Settings, Save, Edit2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileSection = () => {
  const { state, dispatch } = useStudy();
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(state.profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: editProfile });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile(state.profile);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditProfile({
          ...editProfile,
          avatar: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const addSubject = (subject: string) => {
    if (subject && !editProfile.favoriteSubjects.includes(subject)) {
      setEditProfile({
        ...editProfile,
        favoriteSubjects: [...editProfile.favoriteSubjects, subject]
      });
    }
  };

  const removeSubject = (subject: string) => {
    setEditProfile({
      ...editProfile,
      favoriteSubjects: editProfile.favoriteSubjects.filter(s => s !== subject)
    });
  };

  const getTotalStudyTime = () => {
    return state.sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getStudyStreak = () => {
    // Simple streak calculation - days with study sessions
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentSessions = state.sessions.filter(session => 
      session.date >= sevenDaysAgo
    );
    
    const uniqueDays = new Set(
      recentSessions.map(session => 
        session.date.toDateString()
      )
    );
    
    return uniqueDays.size;
  };

  return (
    <div className={`min-h-screen transition-colors ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Profile Settings
              </h2>
              <p className={`${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Manage your study preferences and track your progress
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className={!isEditing ? "bg-gradient-to-r from-blue-500 to-purple-600" : ""}
            >
              {isEditing ? (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={isEditing ? editProfile.avatar : state.profile.avatar} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {(isEditing ? editProfile.name : state.profile.name).split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full p-2 h-8 w-8"
                        onClick={triggerImageUpload}
                      >
                        <Camera className="w-3 h-3" />
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <CardTitle className="text-xl">
                    {isEditing ? editProfile.name : state.profile.name}
                  </CardTitle>
                  <p className={`text-sm ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {isEditing ? editProfile.email : state.profile.email}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Daily Goal</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {isEditing ? editProfile.studyGoal : state.profile.studyGoal}min
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Study Streak</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {getStudyStreak()} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Total Time</span>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        {Math.floor(getTotalStudyTime() / 60)}h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <Input
                        value={isEditing ? editProfile.name : state.profile.name}
                        onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={isEditing ? editProfile.email : state.profile.email}
                        onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Target className="w-4 h-4 inline mr-2" />
                      Daily Study Goal (minutes)
                    </label>
                    <Input
                      type="number"
                      value={isEditing ? editProfile.studyGoal : state.profile.studyGoal}
                      onChange={(e) => setEditProfile({ ...editProfile, studyGoal: Number(e.target.value) })}
                      disabled={!isEditing}
                      min="1"
                      max="480"
                      placeholder="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Favorite Subjects
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(isEditing ? editProfile.favoriteSubjects : state.profile.favoriteSubjects).map((subject) => (
                        <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                          {subject}
                          {isEditing && (
                            <button
                              onClick={() => removeSubject(subject)}
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a subject..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSubject(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addSubject(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-green-500 to-blue-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Study Statistics */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Study Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {state.notes.length}
                      </div>
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Total Notes
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {state.tasks.filter(t => t.completed).length}
                      </div>
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Completed Tasks
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {state.sessions.length}
                      </div>
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Study Sessions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
