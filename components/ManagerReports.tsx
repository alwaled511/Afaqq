import React, { useState, useEffect } from 'react';

interface ManagerReportsProps {
  selectedMosque: string;
}

const ManagerReports: React.FC<ManagerReportsProps> = ({ selectedMosque }) => {
  const [stats, setStats] = useState({ teachers: 0, students: 0, circles: 0 });

  useEffect(() => {
    const teachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]').filter((t: any) => t.mosqueId === selectedMosque).length;
    const students = JSON.parse(localStorage.getItem('afaq_students') || '[]').filter((s: any) => s.mosqueId === selectedMosque).length;
    const circles = JSON.parse(localStorage.getItem('afaq_circles') || '[]').filter((c: any) => c.mosqueId === selectedMosque).length;
    
    setStats({ teachers, students, circles });
  }, [selectedMosque]);

  return (
    <div className="space-y-8 animate-fadeIn text-right">
      <h2 className="text-2xl font-black text-emerald-900">التقارير الإحصائية</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'إجمالي المعلمين', value: stats.teachers, icon: '👨‍🏫', color: 'emerald' },
          { label: 'إجمالي الطلاب', value: stats.students, icon: '👥', color: 'amber' },
          { label: 'إجمالي الحلقات', value: stats.circles, icon: '🕌', color: 'blue' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50">
            <div className="text-4xl mb-4">{item.icon}</div>
            <div className="text-3xl font-black text-emerald-900">{item.value}</div>
            <div className="text-sm text-gray-400 font-bold">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerReports;
