import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const mosques = [
  { id: 'm1', name: 'مسجد خالد السلمان' },
  { id: 'm2', name: 'جامع العنيزان' },
  { id: 'm3', name: 'جامع المديهش' },
  { id: 'm4', name: 'جامع جليبيب' },
  { id: 'm5', name: 'جامع القفاري' },
  { id: 'm6', name: 'مسجد بن سويلم' },
  { id: 'm7', name: 'مسجد الجويعد' },
  { id: 'm8', name: 'مسجد الغيامة' },
  { id: 'm9', name: 'جامع العيسى' },
  { id: 'm10', name: 'جامع الجريوي' },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, setUserRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [selectedMosque, setSelectedMosque] = React.useState(mosques[0].id);

  const getMenuItems = () => {
    const base = [{ id: 'dashboard', label: 'الرئيسية', icon: '🏠' }];
    if (userRole === 'manager') {
      return [
        ...base,
        { id: 'teachers', label: 'إدارة المعلمين', icon: '👨‍🏫' },
        { id: 'circles', label: 'إدارة الحلقات', icon: '🕌' },
        { id: 'students_all', label: 'شؤون الطلاب', icon: '👥' },
        { id: 'reports', label: 'التقارير الإحصائية', icon: '📈' },
      ];
    }
    if (userRole === 'teacher') {
      return [
        ...base,
        { id: 'my_students', label: 'طلابي المباشرين', icon: '🎓' },
        { id: 'sessions', label: 'الحلقات المجدولة', icon: '📅' },
        { id: 'curriculum', label: 'المكتبة التعليمية', icon: '📚' },
      ];
    }
    return [
      ...base,
      { id: 'quran', label: 'المصحف الشريف', icon: '📖' },
      { id: 'barcode', label: 'الباركود الشخصي', icon: '🆔' },
      { id: 'progress', label: 'إنجازاتي وتفوقي', icon: '📊' },
      { id: 'assistant', label: 'المعلم الذكي المساعد', icon: '🤖' },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans" dir="rtl">
      {/* زر الجوال */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-[100] p-2 bg-emerald-900 text-white rounded-lg shadow-lg flex items-center justify-center w-10 h-10"
      >
        <span className="text-xl font-bold">{isSidebarOpen ? '✕' : '☰'}</span>
      </button>

      {/* القائمة الجانبية */}
      <aside className={`fixed inset-y-0 right-0 z-[90] w-72 bg-[#0C1E14] text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-[#0C1E14] font-black text-3xl mb-4">أ</div>
          <h1 className="text-2xl font-black">منصة آفاق</h1>
          <div className="mt-2 px-3 py-0.5 bg-emerald-900/50 rounded-full text-[9px] font-bold text-emerald-400 border border-emerald-800/30 uppercase tracking-widest">Smart Quran Hub</div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#0C1E14] font-bold shadow-lg' 
                  : 'text-emerald-100/60 hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="p-4 bg-emerald-950/40 rounded-3xl border border-emerald-800/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-800 flex items-center justify-center text-lg font-bold">👤</div>
            <div className="flex-1 overflow-hidden text-right">
              <p className="text-xs font-black truncate">مستخدم آفاق</p>
              <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* منطقة المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F8FAFB]">
        {/* شريط المساجد (يظهر فقط للمدير) */}
        {userRole === 'manager' && (
          <header className="bg-white border-b border-gray-200 z-50">
            <div className="flex items-center p-4 gap-4 overflow-x-auto scrollbar-hide">
              <span className="text-xs font-bold text-gray-400 whitespace-nowrap bg-gray-50 px-3 py-2 rounded-lg">المساجد:</span>
              {mosques.map((mosque) => (
                <button
                  key={mosque.id}
                  onClick={() => setSelectedMosque(mosque.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                    selectedMosque === mosque.id
                      ? 'bg-emerald-900 text-white shadow-md scale-105'
                      : 'bg-white text-emerald-900 border border-emerald-100 hover:bg-emerald-50'
                  }`}
                >
                  🕌 {mosque.name}
                </button>
              ))}
            </div>
          </header>
        )}

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
