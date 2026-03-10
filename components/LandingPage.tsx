
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const [view, setView] = useState<'roles' | 'login-manager' | 'login-teacher'>('roles');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const roles: { id: UserRole; title: string; icon: string; desc: string; color: string; badge: string }[] = [
    { id: 'manager', title: 'إدارة المنصة', icon: '🏛️', desc: 'إشراف كامل وتقارير ختامية لمتابعة سير الحلقات', color: 'emerald', badge: 'Admin' },
    { id: 'teacher', title: 'بوابة المعلم', icon: '👨‍🏫', desc: 'تسميع، ترحيل آلي، ورصد درجات الطلاب بدقة', color: 'blue', badge: 'Teacher' },
    { id: 'student', title: 'بوابة الطالب', icon: '📖', desc: 'حفظ، مراجعة، وتواصل ذكي مع المعلم المساعد', color: 'amber', badge: 'Student' },
  ];

  const handleRoleClick = (role: UserRole) => {
    setError('');
    setUsername('');
    setPassword('');
    if (role === 'manager') setView('login-manager');
    else if (role === 'teacher') setView('login-teacher');
    else onSelectRole(role);
  };

  const handleLogin = (e: React.FormEvent, type: 'manager' | 'teacher') => {
    e.preventDefault();
    if (type === 'manager') {
      if (username === 'السلمان' && password === '511') onSelectRole('manager');
      else setError('بيانات دخول الإدارة غير صحيحة');
    } else {
      const savedTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const teacher = savedTeachers.find((t: any) => t.username === username && t.password === password);
      if (teacher) onSelectRole('teacher');
      else setError('اسم المعلم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-right">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px]"></div>

      <div className="max-w-5xl w-full z-10 animate-fadeIn">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-[32px] text-white text-5xl font-black mb-6 shadow-2xl shadow-emerald-200 transform hover:rotate-6 transition-transform">
            آ
          </div>
          <h1 className="text-5xl font-black text-emerald-900 mb-3 quran-font tracking-tight">منصة آفاق</h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed italic">بوابتكم الذكية لتعلم وحفظ القرآن الكريم بأحدث التقنيات</p>
        </div>

        {view === 'roles' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleClick(role.id)}
                className="group relative bg-white p-10 rounded-[48px] shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-emerald-500 hover:-translate-y-3 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute top-4 right-6 text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                  {role.badge}
                </div>
                <div className={`w-24 h-24 bg-${role.color}-50 text-${role.color}-600 rounded-[32px] flex items-center justify-center text-5xl mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  {role.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{role.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">{role.desc}</p>
                <div className="mt-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  ←
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto animate-scaleIn">
            <div className="bg-white p-10 rounded-[56px] shadow-2xl border border-slate-50">
              <div className="flex justify-between items-center mb-10">
                <button onClick={() => setView('roles')} className="text-slate-400 hover:text-emerald-600 font-bold text-sm flex items-center gap-2">
                   العودة <span>→</span>
                </button>
                <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  {view === 'login-manager' ? 'Admin Access' : 'Teacher Access'}
                </span>
              </div>
              
              <h2 className="text-2xl font-black text-slate-800 mb-8">
                {view === 'login-manager' ? 'دخول مدير المنصة' : 'دخول بوابة المعلمين'}
              </h2>

              <form onSubmit={(e) => handleLogin(e, view === 'login-manager' ? 'manager' : 'teacher')} className="space-y-6 text-right">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest mr-2">اسم المستخدم</label>
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-700 text-right"
                    placeholder="أدخل اسم المستخدم"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest mr-2">كلمة المرور</label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold tracking-widest text-slate-700 text-right"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold text-center animate-pulse bg-red-50 py-3 rounded-2xl border border-red-100">
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-l from-emerald-600 to-emerald-800 text-white rounded-3xl font-black shadow-xl shadow-emerald-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95"
                >
                  تأكيد الدخول
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 text-slate-300 text-[10px] font-bold tracking-[0.3em] uppercase pointer-events-none">
        AFAQ QURAN PLATFORM • SMART EDUCATION SYSTEM 2024
      </div>
    </div>
  );
};

export default LandingPage;
