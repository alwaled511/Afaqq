
import React from 'react';

const TeacherCurriculum: React.FC = () => {
  const resources = [
    { title: 'تحفة الأطفال', type: 'تجويد', format: 'PDF', icon: '📖' },
    { title: 'الجزرية في التجويد', type: 'تجويد', format: 'صوتيات', icon: '🔊' },
    { title: 'تفسير ابن كثير (مختصر)', type: 'تفسير', format: 'PDF', icon: '📜' },
    { title: 'قواعد التلقي والحفظ', type: 'منهجية', format: 'فيديو', icon: '🎥' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">المصادر التعليمية</h2>
        <p className="text-slate-500 text-sm">مجموعة من الكتب والوسائط لدعم العملية التعليمية في الحلقة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:border-amber-200 transition-all flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-amber-100 group-hover:scale-110 transition-transform">
              {res.icon}
            </div>
            <h4 className="font-bold text-slate-800 mb-2">{res.title}</h4>
            <div className="flex gap-2 mb-6">
              <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border">{res.type}</span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{res.format}</span>
            </div>
            <button className="mt-auto w-full py-3 bg-slate-50 text-slate-600 text-xs font-bold rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all">
              فتح المصدر
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCurriculum;
