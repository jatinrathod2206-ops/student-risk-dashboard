import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Footer } from './components/Footer';

import { OverviewPage } from './pages/OverviewPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { PredictorPage } from './pages/PredictorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { InsightsPage } from './pages/InsightsPage';
import { EarlyWarningPage } from './pages/EarlyWarningPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';

const COURSES_LIST = [
  'Computer Engineering',
  'Information Technology',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering'
];

const SEMESTERS_LIST = [1, 2, 3, 4, 5, 6, 7, 8];

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');

  const handleSelectStudent = (id: number) => {
    setSelectedStudentId(id);
    setCurrentPage('profile');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return (
          <OverviewPage
            selectedCourse={selectedCourse}
            selectedSemester={selectedSemester}
            onNavigatePage={setCurrentPage}
          />
        );
      case 'directory':
        return (
          <DirectoryPage
            selectedCourse={selectedCourse}
            selectedSemester={selectedSemester}
            onSelectStudent={handleSelectStudent}
            coursesList={COURSES_LIST}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            studentId={selectedStudentId || 1}
            onBack={() => setCurrentPage('directory')}
          />
        );
      case 'predictor':
        return <PredictorPage coursesList={COURSES_LIST} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'early-warning':
        return (
          <EarlyWarningPage
            selectedCourse={selectedCourse}
            onSelectStudent={handleSelectStudent}
          />
        );
      case 'model-performance':
        return <ModelPerformancePage />;
      default:
        return (
          <OverviewPage
            selectedCourse={selectedCourse}
            selectedSemester={selectedSemester}
            onNavigatePage={setCurrentPage}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          coursesList={COURSES_LIST}
          semestersList={SEMESTERS_LIST}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
