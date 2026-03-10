
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statsData = [
  { name: 'يناير', students: 40, achievements: 20 },
  { name: 'فبراير', students: 50, achievements: 31 },
  { name: 'مارس', students: 60, achievements: 45 },
  { name: 'أبريل', students: 85, achievements: 58 },
];

const ManagerDashboard: React.FC = () => {
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    circles: 0
  });
  const [featuredTeachers, setFeaturedTeachers] = useState<any[]>([]);

  useEffect(() => {
    const updateStats = () => {
      const students = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const teachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const circles = JSON.parse(localStorage.getItem('afaq_circles') || '[]');
      
      setCounts({
        students: students.length,
        teachers: teachers.length,
        circles: circles.length
      });

      // عرض أول 3 معلمين كمعلمين متميزين
      setFeaturedTeachers(teachers.slice(0, 3).map((t: any) => ({
        ...t,
        rating: 5.0, // تقييم افتراضي
        students: students.filter((s: any) => {
          const circle = circles.find((c: any) => c.name === s.circle);
          return circle && circle.teacher === t.name;
        }).length
      })));
    };

    updateStats();
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateStats);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn text-right">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'إجمالي الطلاب', value: counts.students.toLocaleString(), color: 'emerald', icon: '🎓' },
          { label: 'المعلمون النشطون', value: counts.teachers.toLocaleString(), color: 'blue', icon: '👨‍🏫' },
          { label: 'الحلقات الحالية', value: counts.circles.toLocaleString(), color: 'amber', icon: '🕌' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className={`p-5 rounded-[20px] text-2xl group-hover:rotate-12 transition-transform shadow-inner ${item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{item.icon}</span>
            </div>
            <h3 className="text-4xl font-black text-slate-800">{item.value}</h3>
            <p className="text-sm text-slate-400 mt-1 font-black uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800">نمو المنصة الأكاديمي</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black">تحديث مباشر</span>
          </div>
          <div className="w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%" aspect={1.8}>
              <LineChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', direction: 'rtl'}} />
                <Line type="monotone" dataKey="students" stroke="#10b981" strokeWidth={4} dot={{r: 4, fill: '#10b981'}} />
                <Line type="monotone" dataKey="achievements" stroke="#f59e0b" strokeWidth={4} dot={{r: 4, fill: '#f59e0b'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6 quran-font">الكادر التعليمي المتميز</h3>
          <div className="space-y-5">
            {featuredTeachers.length > 0 ? featuredTeachers.map((teacher, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 group">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">{teacher.name.charAt(0)}</div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-sm">{teacher.name}</h4>
                  <p className="text-xs text-slate-500 font-bold">{teacher.specialty} • {teacher.students} طالب</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-sm font-black">★</span>
                  <span className="text-sm font-black">{teacher.rating}</span>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-slate-400 font-bold">يرجى إضافة معلمين لعرض الإحصائيات</div>
            )}
          </div>
          <button className="w-full mt-8 py-4 text-emerald-600 text-[11px] font-black hover:bg-emerald-50 rounded-2xl border border-dashed border-emerald-100 transition-all">تحليل التقارير الأكاديمية</button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
