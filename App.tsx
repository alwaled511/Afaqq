import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ManagerTeachers from './components/ManagerTeachers';
import ManagerStudents from './components/ManagerStudents';
import ManagerReports from './components/ManagerReports';
import ManagerCircles from './components/ManagerCircles';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherStudents from './components/TeacherStudents';
import TeacherSessions from './components/TeacherSessions';
import TeacherCurriculum from './components/TeacherCurriculum';
import QuranReader from './components/QuranReader';
import StudentBarcode from './components/StudentBarcode';
import AIConsultant from './components/AIConsultant';
import { UserRole } from './types';

const INITIAL_TEACHERS: any[] = [];
const INITIAL_CIRCLES: any[] = [];
const INITIAL_STUDENTS: any[] = [];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isManagerShadowing, setIsManagerShadowing] = useState(false);
  const [shadowTeacherName, setShadowTeacherName] = useState('');
  
  // أضفنا هذه الحالة لتخزين المسجد المختار حالياً
  const [selectedMosque, setSelectedMosque] = useState('m1'); 

  useEffect(() => {
    if (!localStorage.getItem('afaq_teachers')) {
      localStorage.setItem('afaq_teachers', JSON.stringify(INITIAL_TEACHERS));
    }
    if (!localStorage.getItem('afaq_circles')) {
      localStorage.setItem('afaq_circles', JSON.stringify(INITIAL_CIRCLES));
    }
    if (!localStorage.getItem('afaq_students')) {
      localStorage.setItem('afaq_students', JSON.stringify(INITIAL_STUDENTS));
    }
  }, []);

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
    setActiveTab('dashboard');
    setIsManagerShadowing(false);
    setShadowTeacherName('');
  };

  const enterTeacherPortalAsManager = (teacherName: string) => {
    setShadowTeacherName(teacherName);
    setUserRole('teacher');
    setActiveTab('dashboard');
    setIsManagerShadowing(true);
  };

  const exitTeacherPortalToManager = () => {
    setUserRole('manager');
    setActiveTab('teachers');
    setIsManagerShadowing(false);
    setShadowTeacherName('');
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsManagerShadowing(false);
    setShadowTeacherName('');
  };

  if (!userRole) {
    return <LandingPage onSelectRole={handleRoleSelection} />;
  }

  const renderManagerContent = () => {
    switch (activeTab) {
      case 'dashboard': return <ManagerDashboard />;
      case 'teachers': 
        // نمرر id المسجد لصفحة المعلمين لفلترتهم
        return <ManagerTeachers onEnterTeacherPortal={enterTeacherPortalAsManager} selectedMosque={selectedMosque} />;
      case 'circles': 
        return <ManagerCircles selectedMosque={selectedMosque} />;
      case 'students_all': 
        return <ManagerStudents selectedMosque={selectedMosque} />;
      case 'reports': 
        return <ManagerReports selectedMosque={selectedMosque} />;
      default: return <ManagerDashboard />;
    }
  };

  const renderTeacherContent = () => {
    const currentTeacherName = isManagerShadowing ? shadowTeacherName : 'المعلم';
    switch (activeTab) {
      case 'dashboard': return <TeacherDashboard teacherName={currentTeacherName} />;
      case 'my_students': return <TeacherStudents teacherName={currentTeacherName} />;
      case 'sessions': return <TeacherSessions />;
      case 'curriculum': return <TeacherCurriculum />;
      default: return <TeacherDashboard teacherName={currentTeacherName} />;
    }
  };

  const renderStudentContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'quran': return <QuranReader />;
      case 'barcode': return <StudentBarcode />;
      case 'assistant': return <AIConsultant />;
      case 'progress':
        return (
          <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 text-center space-y-6 animate-fadeIn">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-5xl">🏆</div>
            <h2 className="text-2xl font-bold text-slate-800">سجل الإنجازات</h2>
            <p className="text-slate-500 max-w-md mx-auto">هنا ستجد الأوسمة والشهادات التي حصلت عليها خلال رحلة الحفظ المباركة في منصة آفاق.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              {[
                { title: 'بداية مباركة', color: 'blue', icon: '✨' },
                { title: 'حفظ الجزء 30', color: 'emerald', icon: '📜' },
                { title: 'أسبوع متواصل', color: 'amber', icon: '🔥' },
                { title: 'تجويد ممتاز', color: 'purple', icon: '🔊' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-3xl opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all cursor-help relative">
                    🔒
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-slate-800 transition-colors">{badge.title}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default: return <Dashboard />;
    }
  };

  const renderContent = () => {
    if (userRole === 'manager') return renderManagerContent();
    if (userRole === 'teacher') return renderTeacherContent();
    return renderStudentContent();
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50">
      {isManagerShadowing && (
        <div className="bg-emerald-950 text-white px-8 py-3 flex items-center justify-between z-[60] shadow-xl animate-fadeIn border-b border-emerald-800">
          <div className="flex items-center gap-4">
            <span className="animate-pulse flex h-3 w-3 rounded-full bg-amber-400"></span>
            <p className="text-sm font-bold">تقمص دور المعلم: <span className="text-amber-400">{shadowTeacherName}</span> (عرض فقط)</p>
          </div>
          <button 
            onClick={exitTeacherPortalToManager}
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 px-6 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 shadow-lg"
          >
            ↩ العودة لبوابة المدير
          </button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {/* مررنا هنا selectedMosque و setSelectedMosque للـ Layout ليعمل التبديل */}
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole={userRole} 
          setUserRole={setUserRole}
          selectedMosque={selectedMosque}
          setSelectedMosque={setSelectedMosque}
        >
          <div className="relative h-full">
            <button 
              onClick={handleLogout}
              className="fixed bottom-8 left-8 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-red-500 px-4 py-2 rounded-xl text-[10px] font-bold shadow-sm transition-all z-50 flex items-center gap-2 print:hidden"
            >
              <span>🚪</span> تبديل الحساب / خروج
            </button>
            {renderContent()}
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default App;
