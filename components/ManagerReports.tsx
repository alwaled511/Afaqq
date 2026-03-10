
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const aggregateWeekly = [
  { name: 'الأحد', hifdh: 45, review: 120, fix: 60 },
  { name: 'الإثنين', hifdh: 52, review: 140, fix: 80 },
  { name: 'الثلاثاء', hifdh: 48, review: 110, fix: 70 },
  { name: 'الأربعاء', hifdh: 61, review: 155, fix: 90 },
  { name: 'الخميس', hifdh: 70, review: 180, fix: 100 },
  { name: 'الجمعة', hifdh: 20, review: 50, fix: 30 },
  { name: 'السبت', hifdh: 55, review: 130, fix: 75 },
];

const aggregateMonthly = [
  { name: 'الأسبوع 1', hifdh: 320, review: 850, fix: 450 },
  { name: 'الأسبوع 2', hifdh: 350, review: 920, fix: 480 },
  { name: 'الأسبوع 3', hifdh: 290, review: 780, fix: 420 },
  { name: 'الأسبوع 4', hifdh: 410, review: 1050, fix: 560 },
];

const circleDataMap: Record<string, { weekly: any[], monthly: any[], stats: any }> = {
  'rayyan': {
    weekly: aggregateWeekly.map(d => ({ ...d, hifdh: Math.round(d.hifdh * 0.4), review: Math.round(d.review * 0.35), fix: Math.round(d.fix * 0.45) })),
    monthly: aggregateMonthly.map(d => ({ ...d, hifdh: Math.round(d.hifdh * 0.4), review: Math.round(d.review * 0.35), fix: Math.round(d.fix * 0.45) })),
    stats: { hifdh: '140', review: '310', fix: '227' }
  },
  'firdous': {
    weekly: aggregateWeekly.map(d => ({ ...d, hifdh: Math.round(d.hifdh * 0.3), review: Math.round(d.review * 0.45), fix: Math.round(d.fix * 0.25) })),
    monthly: aggregateMonthly.map(d => ({ ...d, hifdh: Math.round(d.hifdh * 0.3), review: Math.round(d.review * 0.45), fix: Math.round(d.fix * 0.25) })),
    stats: { hifdh: '105', review: '400', fix: '126' }
  }
};

const ManagerReports: React.FC = () => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedCircle, setSelectedCircle] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const circles = [
    { id: 'all', name: 'جميع الحلقات' },
    { id: 'rayyan', name: 'حلقة الريان' },
    { id: 'firdous', name: 'حلقة الفردوس' },
    { id: 'tamayuz', name: 'حلقة التميز' },
    { id: 'abrar', name: 'حلقة الأبرار' },
  ];

  let currentData = reportType === 'weekly' ? aggregateWeekly : aggregateMonthly;
  let summaryStats = {
    hifdh: reportType === 'weekly' ? '351' : '1,370',
    review: reportType === 'weekly' ? '885' : '3,600',
    fix: reportType === 'weekly' ? '505' : '1,910'
  };

  if (selectedCircle !== 'all' && circleDataMap[selectedCircle]) {
    const circleData = circleDataMap[selectedCircle];
    currentData = reportType === 'weekly' ? circleData.weekly : circleData.monthly;
    summaryStats = {
      hifdh: reportType === 'weekly' ? circleData.stats.hifdh : (parseInt(circleData.stats.hifdh) * 4).toString(),
      review: reportType === 'weekly' ? circleData.stats.review : (parseInt(circleData.stats.review) * 4).toString(),
      fix: reportType === 'weekly' ? circleData.stats.fix : (parseInt(circleData.stats.fix) * 4).toString(),
    };
  }

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            window.print();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  const MetricBar = ({ label, value, max, color }: { label: string, value: number, max: number, color: 'emerald' | 'blue' | 'purple' }) => {
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500'
    };
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] font-bold text-slate-400">
          <span>{label}</span>
          <span>{value} سطر</span>
        </div>
        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <div 
            className={`h-full ${colorMap[color]} transition-all duration-700`} 
            style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 print:p-0">
      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-sm w-full text-center space-y-6 animate-scaleIn">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-emerald-100">
              📄
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 mb-2">جاري تجهيز التقرير</h3>
              <p className="text-sm text-slate-500 font-medium">نقوم بتحليل البيانات وإحصائيات الحلقات...</p>
            </div>
            <div className="space-y-3">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border">
                <div 
                  className="h-full bg-gradient-to-l from-emerald-500 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{progress}% اكتمل</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">تقارير الإنجاز الأكاديمي</h2>
          <p className="text-slate-500 text-sm">متابعة إحصائيات أسطر الحفظ والمراجعة والتثبيت</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">🕌</span>
            <select 
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none min-w-[160px] shadow-sm cursor-pointer"
            >
              {circles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setReportType('weekly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${reportType === 'weekly' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              تقرير أسبوعي
            </button>
            <button 
              onClick={() => setReportType('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${reportType === 'monthly' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              تقرير شهري
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {[
          { label: 'أسطر الحفظ', value: summaryStats.hifdh, color: 'emerald', icon: '✨' },
          { label: 'أسطر المراجعة', value: summaryStats.review, color: 'blue', icon: '🔄' },
          { label: 'أسطر التثبيت', value: summaryStats.fix, color: 'purple', icon: '📌' },
        ].map((stat, i) => {
          const bgColors: Record<string, string> = { emerald: 'bg-emerald-50', blue: 'bg-blue-50', purple: 'bg-purple-50' };
          const textColors: Record<string, string> = { emerald: 'text-emerald-600', blue: 'text-blue-600', purple: 'text-purple-600' };
          const borderColors: Record<string, string> = { emerald: 'border-emerald-100', blue: 'border-blue-100', purple: 'border-purple-100' };
          
          return (
            <div key={i} className="bg-white p-5 lg:p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4 lg:gap-5 hover:border-emerald-100 transition-colors group">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 ${bgColors[stat.color]} ${textColors[stat.color]} rounded-2xl flex items-center justify-center text-xl lg:text-2xl shadow-inner border ${borderColors[stat.color]} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className={`text-xl lg:text-2xl font-black text-slate-800`}>{stat.value} <span className="text-xs font-medium text-slate-400">سطر</span></h4>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-[32px] shadow-sm border border-slate-100 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 quran-font">توزيع الإنجاز الأكاديمي لـ {circles.find(c => c.id === selectedCircle)?.name}</h3>
              <p className="text-xs text-slate-400 font-medium">معدل الإنجاز بناءً على الورد اليومي المسجل</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold bg-slate-50 p-2 rounded-xl border border-slate-100 print:hidden">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> حفظ</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> مراجعة</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> تثبيت</div>
            </div>
          </div>
          
          <div className="w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%" aspect={2}>
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHifdh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFix" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', direction: 'rtl', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}
                />
                <Area type="monotone" name="حفظ" dataKey="hifdh" stroke="#10b981" fillOpacity={1} fill="url(#colorHifdh)" strokeWidth={3} />
                <Area type="monotone" name="مراجعة" dataKey="review" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReview)" strokeWidth={3} />
                <Area type="monotone" name="تثبيت" dataKey="fix" stroke="#a855f7" fillOpacity={1} fill="url(#colorFix)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
              {selectedCircle === 'all' ? 'ترتيب الحلقات' : 'مقارنة أداء الطلاب (تفصيلي)'}
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">حسب الأسطر</span>
            </h3>
            
            <div className="space-y-6">
              {selectedCircle === 'all' ? (
                [
                  { name: 'حلقة الريان', val: 1420, max: 1500, color: 'emerald' },
                  { name: 'حلقة الفردوس', val: 1180, max: 1500, color: 'blue' },
                  { name: 'حلقة التميز', val: 950, max: 1500, color: 'amber' },
                  { name: 'حلقة الأبرار', val: 840, max: 1500, color: 'purple' },
                ].map((item, i) => {
                  const barColors: Record<string, string> = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500', purple: 'bg-purple-500' };
                  return (
                    <div key={i} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{item.name}</span>
                        <span className="text-[10px] font-black text-slate-400">{item.val} سطر</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
                        <div 
                          className={`h-full ${barColors[item.color]} transition-all duration-1000 rounded-full shadow-sm`} 
                          style={{width: `${(item.val / item.max) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                [
                  { name: 'أحمد محمد', hifdh: 45, review: 120, fix: 75 },
                  { name: 'سليمان بكر', hifdh: 40, review: 110, fix: 60 },
                  { name: 'ياسين فهد', hifdh: 35, review: 95, fix: 50 },
                  { name: 'عمر اليافعي', hifdh: 30, review: 80, fix: 30 },
                ].map((student, i) => (
                  <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{student.name}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <MetricBar label="الحفظ الجديد" value={student.hifdh} max={60} color="emerald" />
                      <MetricBar label="المراجعة" value={student.review} max={150} color="blue" />
                      <MetricBar label="التثبيت" value={student.fix} max={100} color="purple" />
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={handleDownloadPDF}
              className="w-full mt-8 py-4 bg-emerald-600 text-white text-[11px] font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 print:hidden"
            >
              <span>📥</span> تحميل التقرير التفصيلي (PDF)
            </button>
          </div>

          <div className="bg-emerald-800 p-6 rounded-[32px] shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-2">توصية آفاق الذكية</h4>
              <p className="text-sm font-medium leading-relaxed">
                {selectedCircle === 'all' 
                  ? 'يُنصح بالتركيز على "حلقة الأبرار" لرفع معدل المراجعة لديهم، حيث يقل أداؤهم بنسبة 15% عن المتوسط العام.'
                  : `أداء هذه الحلقة في "الحفظ الجديد" ممتاز جداً. نقترح زيادة وقت "التثبيت" لضمان جودة المخرجات.`
                }
              </p>
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-700/50 rounded-full blur-2xl opacity-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
