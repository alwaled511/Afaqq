
import React from 'react';

const TeacherSessions: React.FC = () => {
  const sessions = [
    { id: '1', title: 'حلقة الريان (حفظ)', time: '04:30 م', location: 'القاعة الكبرى', students: 12, status: 'قادمة' },
    { id: '2', title: 'حلقة النور (مراجعة)', time: '06:15 م', location: 'قاعة الفاروق', students: 8, status: 'قادمة' },
    { id: '3', title: 'حلقة التميز (تثبيت)', time: '08:30 م', location: 'أونلاين', students: 15, status: 'مجدولة' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">جدول حلقات اليوم</h2>
          <p className="text-slate-500 text-sm">إدارة الحلقات الحضورية وعن بعد لهذا اليوم</p>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex flex-col items-center justify-center shadow-inner">
                <span className="text-xs font-bold">الوقت</span>
                <span className="text-sm font-black">{session.time.split(' ')[0]}</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">{session.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400">📍 {session.location}</span>
                  <span className="text-xs text-slate-400">👥 {session.students} طالب</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-100">
                {session.status}
              </span>
              <button className="flex-1 md:flex-none px-8 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100">
                تحضير الطلاب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSessions;
