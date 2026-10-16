/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { RightPanel } from './components/layout/RightPanel';
import { BottomNav } from './components/layout/BottomNav';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

import { HomeDashboard } from './components/home/HomeDashboard';
import { LecturesView } from './components/lectures/LecturesView';
import { VideoPlayerModal } from './components/lectures/VideoPlayerModal';
import { ScheduleView } from './components/schedule/ScheduleView';
import { LibraryView } from './components/library/LibraryView';
import { TasksView } from './components/tasks/TasksView';
import { PomodoroView } from './components/pomodoro/PomodoroView';
import { StudyCenterView } from './components/study/StudyCenterView';
import { AcademicProfileView } from './components/academic/AcademicProfileView';
import { QuestionBankView } from './components/exams/QuestionBankView';
import { ExamsView } from './components/exams/ExamsView';
import { FlashcardsView } from './components/exams/FlashcardsView';
import { CommunityView } from './components/community/CommunityView';
import { PracticalTrainingView } from './components/practical/PracticalTrainingView';
import { StudentServicesView } from './components/services/StudentServicesView';
import { TeachersView } from './components/teachers/TeachersView';
import { NotesView } from './components/notes/NotesView';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { TeacherDashboardView } from './components/teacher/TeacherDashboardView';
import { CoordinatorDashboardView } from './components/coordinator/CoordinatorDashboardView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { SuperAdminDashboardView } from './components/superadmin/SuperAdminDashboardView';
import { NaboughAIModal } from './components/ai/NaboughAIModal';
import { LoginPage } from './components/auth/LoginPage';
import { MobileDrawer } from './components/layout/MobileDrawer';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    currentTab,
    currentUser,
    activeLecture,
    setActiveLecture,
    isMobileDrawerOpen,
    setMobileDrawerOpen,
    toggleMobileDrawer,
  } = useApp();

  // If user is not authenticated, show modern Academic Login Page as requested
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render view based on active tab and role
  const renderCurrentView = () => {
    // If on home, direct to the appropriate role dashboard
    if (currentTab === 'home') {
      if (currentUser.role === 'super_admin') {
        return <SuperAdminDashboardView />;
      }
      if (currentUser.role === 'admin') {
        return <AdminDashboardView />;
      }
      if (currentUser.role === 'doctor' || currentUser.role === 'teacher') {
        return <TeacherDashboardView />;
      }
      if (currentUser.role === 'coordinator') {
        return <CoordinatorDashboardView />;
      }
      return <HomeDashboard />;
    }

    switch (currentTab) {
      case 'super_admin_panel':
        return <SuperAdminDashboardView />;
      case 'lectures':
        return <LecturesView />;
      case 'schedule':
        return <ScheduleView />;
      case 'community':
      case 'chat':
        return <CommunityView />;
      case 'library':
        return <LibraryView />;
      case 'tasks':
        return <TasksView />;
      case 'pomodoro':
        return <PomodoroView />;
      case 'study_center':
        return <StudyCenterView />;
      case 'academic_profile':
      case 'gpa':
        return <AcademicProfileView />;
      case 'exams':
        return <ExamsView />;
      case 'question_bank':
        return <QuestionBankView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'teachers':
        return <TeachersView />;
      case 'practical_training':
        return <PracticalTrainingView />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'notifications':
        return <NotificationsView />;
      case 'student_services':
        return <StudentServicesView />;
      case 'settings':
      case 'help_center':
        return <SettingsView />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-['Cairo',sans-serif]">
      {/* 1. Left Sidebar Navigation (Matching exact screenshot layout) */}
      <Sidebar />

      {/* 2. Main Middle Workspace (Header + Scrollable Body) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNav onMobileMenuToggle={toggleMobileDrawer} />

        {/* Scrollable Content View */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* 3. Right Assistant Panel (Matching exact screenshot right column) */}
      <RightPanel />

      {/* 4. Mobile Bottom Navigation */}
      <BottomNav />

      {/* 5. Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* 5. Modals and Indicators */}
      {activeLecture && (
        <VideoPlayerModal
          lecture={activeLecture}
          onClose={() => setActiveLecture(null)}
        />
      )}

      {/* AI Assistant Modal */}
      <NaboughAIModal />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
