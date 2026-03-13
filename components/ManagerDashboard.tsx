import React, { useState, useEffect } from 'react';

interface ManagerDashboardProps {
  selectedMosque: string;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ selectedMosque }) => {
  const [stats, setStats] = useState({ teachers: 0, students: 0, circles: 0 });
  const [mosqueName, setMosqueName] = useState('');

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

  useEffect(() => {
    // تصفية البيانات بناءً على المسجد المختار فقط
    const teachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]').filter((t: any) => t.mosqueId === selectedMosque);
    const students = JSON.parse(localStorage.getItem('afaq_students') || '[]').filter((s: any) => s.mosqueId === selectedMosque);
    const circles = JSON.parse(localStorage.getItem('afaq_circles') || '[]').filter((c: any) => c.mosqueId === selectedMosque);
    
    setStats({ teachers: teachers.length, students: students.length, circles: circles.length });
    setMosqueName(mosques.find(m => m.id === selectedMosque)?.name || '');
  }, [selectedMosque]);

  return (
    <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
      <div className="bg-[#0C1E14] p-8 md:p-12 rounded-[40px] shadow-2xl text-white relative overflow-hidden border border-emerald-800/50">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4">نظرة عامة على {mosqueName}</h2>
          <p className="text-emerald-400 font-bold max-w-xl text-sm leading-relaxed">
            مرحباً بك في لوحة تحكم الإدارة. الأرقام أدناه تمثل إحصائيات المسجد الحالي المختار من القائمة العلوية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'إجمالي المعلمين', value: stats.teachers, icon: '👨‍🏫', color: 'bg-emerald-50 text-emerald-900 border-emerald-100' },
          { label: 'الطلاب المسجلين', value: stats.students, icon: '👥', color: 'bg-amber-50 text-amber-900 border-amber-100' },
          { label: 'الحلقات القائمة', value: stats.circles, icon: '🕌', color: 'bg-blue-50 text-blue-900 border-blue-100' },
        ].map((item, i) => (
          <div key={i} className={`p-8 rounded-[32px] border shadow-sm flex flex-col items-center hover:scale-105 transition-transform duration-300 ${item.color}`}>
            <div className="text-5xl mb-4">{item.icon}</div>
            <div className="text-4xl font-black mb-1">{item.value}</div>
            <div className="text-xs font-black uppercase tracking-widest opacity-60">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;
