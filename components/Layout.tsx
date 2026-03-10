
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, setUserRole }) => {
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
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans">
      <aside className="w-72 bg-[#0C1E14] text-white flex flex-col shadow-[10px_0_50px_rgba(0,0,0,0.1)] z-30 transition-all">
        <div className="p-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-[#0C1E14] font-black text-3xl shadow-2xl mb-4 transform hover:scale-105 transition-transform">آ</div>
          <h1 className="text-2xl font-black tracking-tight quran-font">منصة آفاق</h1>
          <div className="mt-2 px-3 py-0.5 bg-emerald-900/50 rounded-full text-[9px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-800/30">
            Smart Quran Hub
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-amber-500 text-[#0C1E14] shadow-xl shadow-amber-500/20 font-black translate-x-1' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${activeTab === item.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="p-4 bg-emerald-950/40 rounded-3xl border border-emerald-800/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-800 flex items-center justify-center text-lg font-bold">👤</div>
            <div className="flex-1 overflow-hidden text-right">
              <p className="text-xs font-black truncate">مستخدم آفاق</p>
              <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">
                {userRole === 'manager' ? 'Admin' : userRole === 'teacher' ? 'Teacher' : 'Student'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-12 z-20 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">نظام آفاق الذكي • متصل الآن</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">الواجهة</span>
              <select 
                value={userRole} 
                onChange={(e) => {
                  setUserRole(e.target.value as UserRole);
                  setActiveTab('dashboard');
                }}
                className="bg-transparent text-xs font-black text-emerald-900 outline-none cursor-pointer focus:ring-0 border-none pr-4"
              >
                <option value="student">طالب</option>
                <option value="teacher">معلم</option>
                <option value="manager">مدير</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl transition-all relative border border-slate-100 group shadow-sm">
                <span className="text-xl group-hover:rotate-12 transition-transform">🔔</span>
                <span className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full border-2 border-white shadow-sm"></span>
              </button>
              <div className="h-10 w-[1px] bg-slate-100"></div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-800">{new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' })}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date().toLocaleDateString('ar-SA', { weekday: 'long' })}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-12 bg-[#F8FAFB]">
          <div className="max-w-7xl mx-auto h-full relative">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
