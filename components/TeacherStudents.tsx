import React, { useState, useEffect } from 'react';
import { SURAHS } from '../constants';
import { StudyPlan } from '../types';

interface TeacherStudentsProps {
  teacherName?: string;
}

const TeacherStudents: React.FC<TeacherStudentsProps> = ({ teacherName }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  const [planForm, setPlanForm] = useState<StudyPlan>({
    hifdh: { surah: 'البقرة', from: 1, to: 1, lines: 15 },
    tathbeet: { surah: 'الفاتحة', from: 1, to: 7, lines: 7 },
    review: { surah: 'النبأ', from: 1, to: 40, lines: 20 },
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    const loadFilteredData = () => {
      const savedStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const savedCircles = JSON.parse(localStorage.getItem('afaq_circles') || '[]');
      
      const teacherCircles = savedCircles
        .filter((c: any) => c.teacher === teacherName)
        .map((c: any) => c.name);
      
      const filtered = savedStudents.filter((s: any) => teacherCircles.includes(s.circle));
      setStudents(filtered);
    };

    loadFilteredData();
    window.addEventListener('storage', loadFilteredData);
    return () => window.removeEventListener('storage', loadFilteredData);
  }, [teacherName]);

  const openPlanModal = (student: any) => {
    setSelectedStudent(student);
    if (student.plan) {
      setPlanForm(student.plan);
    } else {
      setPlanForm({
        hifdh: { surah: 'البقرة', from: 1, to: 1, lines: 15 },
        tathbeet: { surah: 'النبأ', from: 1, to: 30, lines: 5 },
        review: { surah: 'الملك', from: 1, to: 30, lines: 30 },
        lastUpdated: new Date().toISOString()
      });
    }
    setShowPlanModal(true);
  };

  const handleSavePlan = () => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    const updatedAll = allStudents.map((s: any) => 
      s.id === selectedStudent.id ? { ...s, plan: { ...planForm, lastUpdated: new Date().toISOString() } } : s
    );
    localStorage.setItem('afaq_students', JSON.stringify(updatedAll));
    window.dispatchEvent(new Event('storage'));
    setShowPlanModal(false);
    alert(`تم بنجاح تحديث المنهج للطالب: ${selectedStudent.name}`);
  };

  const renderPlanField = (type: 'hifdh' | 'tathbeet' | 'review', label: string, icon: string, color: string) => {
    const isRange = type !== 'hifdh';
    
    return (
      <div className={`p-8 bg-white rounded-[40px] border-2 border-slate-50 hover:border-${color}-200 transition-all group`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 bg-${color}-50 text-${color}-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
            {icon}
          </div>
          <h4 className="text-lg font-black text-slate-800">{label}</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">السورة</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
              value={planForm[type].surah}
              onChange={(e) => setPlanForm({...planForm, [type]: {...planForm[type], surah: e.target.value}})}
            >
              {SURAHS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">من آية</label>
            <input 
              type="number"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-center"
              value={planForm[type].from}
              onChange={(e) => setPlanForm({...planForm, [type]: {...planForm[type], from: parseInt(e.target.value) || 0}})}
            />
          </div>

          {isRange ? (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">إلى آية</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-center"
                value={planForm[type].to}
                onChange={(e) => setPlanForm({...planForm, [type]: {...planForm[type], to: parseInt(e.target.value) || 0}})}
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">الكمية (أسطر)</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-black text-center"
                value={planForm[type].lines}
                onChange={(e) => setPlanForm({...planForm, [type]: {...planForm[type], lines: parseInt(e.target.value) || 0}})}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 quran-font">تخصيص المنهج الأكاديمي</h2>
          <p className="text-slate-500 font-medium mt-1">تحديد نطاق الآيات للمراجعة والكمية للحفظ</p>
        </div>
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-emerald-100">📋</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {students.length > 0 ? students.map((s) => (
          <div key={s.id} className="bg-white p-8 rounded-[48px] shadow-sm border border-slate-100 hover:border-emerald-200 transition-all group flex flex-col h-full">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-slate-50 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
                {s.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 truncate">{s.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{s.circle}</p>
              </div>
            </div>
            <button onClick={() => openPlanModal(s)} className="mt-auto w-full py-5 bg-emerald-600 text-white rounded-[24px] text-sm font-black shadow-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3">
              <span>⚙️</span> تعديل المنهج الدراسي
            </button>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[56px] border border-dashed border-slate-100 text-slate-400 font-black">لا يوجد طلاب نشطين</div>
        )}
      </div>

      {showPlanModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-[#F8FAFB] w-full max-w-4xl rounded-[64px] shadow-2xl animate-scaleIn overflow-hidden max-h-[95vh] flex flex-col">
            <div className="p-10 border-b bg-white flex justify-between items-center text-right">
              <div>
                <h3 className="text-2xl font-black text-slate-800 quran-font">تحديد منهج الطالب</h3>
                <p className="text-sm text-slate-400 font-bold mt-1">ضبط نطاقات الحفظ والمراجعة للطالب: {selectedStudent?.name}</p>
              </div>
              <button onClick={() => setShowPlanModal(false)} className="text-2xl">✕</button>
            </div>
            
            <div className="p-10 space-y-8 overflow-y-auto scrollbar-hide text-right">
              {/* Added missing icon argument to the calls below to fix the 4-argument requirement */}
              {renderPlanField('hifdh', 'حفظ جديد (نقطة البداية + أسطر)', '✨', 'emerald')}
              {renderPlanField('tathbeet', 'تثبيت ومراجعة صغرى (نطاق)', '📌', 'blue')}
              {renderPlanField('review', 'مراجعة كبرى (نطاق)', '🔄', 'purple')}
            </div>

            <div className="p-10 bg-white border-t flex gap-6">
              <button onClick={handleSavePlan} className="flex-1 bg-emerald-600 text-white py-6 rounded-[32px] font-black shadow-2xl hover:bg-emerald-700 transition-all active:scale-95">حفظ واعتماد المنهج</button>
              <button onClick={() => setShowPlanModal(false)} className="px-12 py-6 bg-slate-100 text-slate-500 rounded-[32px] font-black hover:bg-slate-200 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;