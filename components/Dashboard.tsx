
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StudyPlan } from '../types';

const chartData = [
  { name: 'الأحد', verses: 12, color: '#10b981' },
  { name: 'الإثنين', verses: 25, color: '#3b82f6' },
  { name: 'الثلاثاء', verses: 18, color: '#f59e0b' },
  { name: 'الأربعاء', verses: 30, color: '#8b5cf6' },
  { name: 'الخميس', verses: 40, color: '#10b981' },
  { name: 'السبت', verses: 22, color: '#06b6d4' },
];

const Dashboard: React.FC = () => {
  const [studentName, setStudentName] = useState('يوسف');
  const [progress, setProgress] = useState(65);
  const [studentPlan, setStudentPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    const loadStudentData = () => {
      const savedStudents = localStorage.getItem('afaq_students');
      if (savedStudents) {
        const students = JSON.parse(savedStudents);
        const current = students[0];
        if (current) {
          setStudentName(current.name);
          if (current.progress) setProgress(current.progress);
          if (current.plan) setStudentPlan(current.plan);
        }
      }
    };
    loadStudentData();
    window.addEventListener('storage', loadStudentData);
    return () => window.removeEventListener('storage', loadStudentData);
  }, []);

  return (
    <div className="space-y-10 animate-fadeIn pb-12 text-right">
      <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-12 rounded-[56px] text-white shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <span className="inline-block px-4 py-1.5 bg-emerald-700/50 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-600/30">مستوى متميز ★</span>
            <h1 className="text-5xl font-black mb-4 quran-font tracking-tight">مرحباً يا {studentName.split(' ')[0]}</h1>
            <p className="text-emerald-100/80 text-lg font-medium max-w-md leading-relaxed">"اقرأ وارتقِ ورتل كما كنت ترتل في الدنيا، فإن منزلتك عند آخر آية تقرؤها"</p>
          </div>
          <div className="flex flex-col items-center gap-4 bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl min-w-[240px]">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * progress) / 100} className="text-amber-400 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{progress}%</span>
                <span className="text-[9px] font-bold text-emerald-200">إنجاز الحفظ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[56px] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-800 mb-8">نشاطك الأكاديمي اليومي</h3>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                <Bar dataKey="verses" radius={[12, 12, 0, 0]} barSize={45}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[56px] shadow-sm border border-slate-100 h-fit">
          <h3 className="text-2xl font-black text-slate-800 quran-font mb-10">ورد اليوم</h3>
          <div className="space-y-6">
            {[
              { label: 'حفظ جديد', icon: '✨', data: studentPlan?.hifdh, color: 'emerald', isRange: false },
              { label: 'مراجعة قريبة (صغرى)', icon: '📌', data: studentPlan?.tathbeet, color: 'blue', isRange: true },
              { label: 'مراجعة بعيدة (كبرى)', icon: '🔄', data: studentPlan?.review, color: 'purple', isRange: true },
            ].map((task, i) => (
              <div key={i} className={`p-6 rounded-[32px] border-2 border-slate-50 hover:border-${task.color}-200 transition-all group`}>
                <div className="flex items-center gap-4 mb-4">
                  <span className={`w-10 h-10 rounded-xl bg-${task.color}-50 text-${task.color}-600 flex items-center justify-center text-xl`}>{task.icon}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.label}</span>
                </div>
                {task.data ? (
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-slate-800 quran-font">سورة {task.data.surah}</h4>
                    <p className="text-sm font-bold text-slate-500">
                      {task.isRange 
                        ? `من آية ${task.data.from} إلى آية ${task.data.to}` 
                        : `بداية من آية ${task.data.from} (الكمية: ${task.data.lines} أسطر)`
                      }
                    </p>
                  </div>
                ) : <p className="text-sm font-bold text-slate-300 italic">بانتظار تحديد الورد</p>}
              </div>
            ))}
          </div>
          <button disabled={!studentPlan} className={`w-full mt-10 py-6 ${studentPlan ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} text-white rounded-[32px] text-sm font-black transition-all shadow-2xl`}>
             {studentPlan ? 'تم إنجاز الورد اليومي ✅' : 'بانتظار اعتماد المنهج'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
