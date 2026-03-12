import React, { useState, useEffect } from 'react';

interface ManagerReportsProps {
  selectedMosque: string;
}

const ManagerReports: React.FC<ManagerReportsProps> = ({ selectedMosque }) => {
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
    const teachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]').filter((t: any) => t.mosqueId === selectedMosque).length;
    const students = JSON.parse(localStorage.getItem('afaq_students') || '[]').filter((s: any) => s.mosqueId === selectedMosque).length;
    const circles = JSON.parse(localStorage.getItem('afaq_circles') || '[]').filter((c: any) => c.mosqueId === selectedMosque).length;
    
    setStats({ teachers, students, circles });
    setMosqueName(mosques.find(m => m.id === selectedMosque)?.name || '');
  }, [selectedMosque]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn text-right">
      {/* هذا الجزء يظهر في الشاشة فقط ويختفي عند الطباعة */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-black text-emerald-900 font-sans">التقارير الإحصائية</h2>
          <p className="text-sm text-gray-500">متابعة أداء {mosqueName}</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <span>🖨️</span> طباعة تقرير المسجد (PDF)
        </button>
      </div>

      {/* تنسيق التقرير المخصص للطباعة */}
      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-emerald-50 print:shadow-none print:border-none print:p-0">
        <div className="hidden print:block text-center border-b-2 border-emerald-900 pb-8 mb-8">
          <h1 className="text-3xl font-black text-emerald-900 mb-2">منصة آفاق لتعليم القرآن الكريم</h1>
          <p className="text-xl text-gray-600">تقرير إحصائي رسمي - {mosqueName}</p>
          <p className="text-sm text-gray-400 mt-2">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'إجمالي المعلمين', value: stats.teachers, icon: '👨‍🏫', color: 'emerald' },
            { label: 'إجمالي الطلاب', value: stats.students, icon: '👥', color: 'amber' },
            { label: 'إجمالي الحلقات', value: stats.circles, icon: '🕌', color: 'blue' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 flex flex-col items-center print:bg-white print:border-slate-200">
              <div className="text-4xl mb-4 print:text-2xl">{item.icon}</div>
              <div className="text-4xl font-black text-emerald-900 mb-1">{item.value}</div>
              <div className="text-xs text-gray-400 font-black uppercase tracking-widest">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 hidden print:block border-t border-dashed border-gray-200 pt-8">
          <div className="flex justify-between text-sm font-bold text-gray-500">
            <p>ختم إدارة الجمعية:</p>
            <p>توقيع المشرف العام:</p>
          </div>
          <div className="h-24"></div>
        </div>
      </div>

      {/* إضافة كود CSS مخصص للإخفاء عند الطباعة */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\:block, .print\:block * { visibility: visible; }
          .print\:block { position: absolute; left: 0; top: 0; width: 100%; }
          aside, header, button, .print\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ManagerReports;
