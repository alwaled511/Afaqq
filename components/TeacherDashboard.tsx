
import React, { useState, useEffect } from 'react';
import { SURAHS } from '../constants';

interface TeacherDashboardProps {
  teacherName?: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacherName }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showRecitationModal, setShowRecitationModal] = useState(false);
  
  const [recitationForm, setRecitationForm] = useState<any>({
    hifdh: { surah: '', grade: '10', lines: 0 },
    tathbeet: { surah: '', grade: '10', lines: 0, from: 0, to: 0 },
    review: { surah: '', grade: '10', lines: 0, from: 0, to: 0 },
    notes: ''
  });

  useEffect(() => {
    const loadData = () => {
      const savedStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const savedCircles = JSON.parse(localStorage.getItem('afaq_circles') || '[]');
      
      const teacherCircles = savedCircles
        .filter((c: any) => c.teacher === teacherName)
        .map((c: any) => c.name);
      
      const filteredStudents = savedStudents.filter((s: any) => teacherCircles.includes(s.circle));
      setStudents(filteredStudents);
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [teacherName]);

  const handleAttendance = (studentId: string, status: string) => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    const updatedAll = allStudents.map((s: any) => s.id === studentId ? { ...s, attendance: status } : s);
    localStorage.setItem('afaq_students', JSON.stringify(updatedAll));
    window.dispatchEvent(new Event('storage'));
  };

  const openRecitation = (student: any) => {
    setSelectedStudent(student);
    setRecitationForm({
      hifdh: student.plan?.hifdh ? { ...student.plan.hifdh, grade: '10' } : { surah: 'النبأ', grade: '10', lines: 0 },
      tathbeet: student.plan?.tathbeet ? { ...student.plan.tathbeet, grade: '10' } : { surah: 'النازعات', grade: '10', lines: 0, from: 0, to: 0 },
      review: student.plan?.review ? { ...student.plan.review, grade: '10' } : { surah: 'النبأ', grade: '10', lines: 0, from: 0, to: 0 },
      notes: ''
    });
    setShowRecitationModal(true);
  };

  const saveRecitation = () => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    
    // حساب إجمالي الأسطر لهذه الجلسة
    const sessionLines = (Number(recitationForm.hifdh.lines) || 0) + 
                         (Number(recitationForm.tathbeet.lines) || 0) + 
                         (Number(recitationForm.review.lines) || 0);

    // إنشاء ملخص نصي لما تم تسميعه
    const summaryParts = [];
    if (recitationForm.hifdh.lines > 0) summaryParts.push(`حفظ: ${recitationForm.hifdh.surah}`);
    if (recitationForm.tathbeet.lines > 0 || recitationForm.tathbeet.from > 0) summaryParts.push(`تثبيت: ${recitationForm.tathbeet.surah}`);
    if (recitationForm.review.lines > 0) summaryParts.push(`مراجعة: ${recitationForm.review.surah}`);
    
    const summaryText = summaryParts.length > 0 ? summaryParts.join(' | ') : 'لم يتم التسميع';

    const updatedAll = allStudents.map((s: any) => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          status: 'تم التسميع',
          lastGrade: recitationForm.hifdh.grade,
          lastRecitationSummary: summaryText,
          totalLinesToday: sessionLines,
          history: [...(s.history || []), { 
            date: new Date().toISOString(), 
            summary: recitationForm,
            totalLines: sessionLines
          }]
        };
      }
      return s;
    });

    localStorage.setItem('afaq_students', JSON.stringify(updatedAll));
    window.dispatchEvent(new Event('storage'));
    setShowRecitationModal(false);
  };

  // حساب إجمالي أسطر الحلقة اليوم
  const totalCircleLines = students.reduce((acc, curr) => acc + (curr.totalLinesToday || 0), 0);

  const labelClass = "block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest";
  const inputClass = "w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all";

  return (
    <div className="space-y-6 animate-fadeIn text-right pb-10">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner">👨‍🏫</div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 quran-font">تحضير الطلاب وتسميعهم</h2>
            <p className="text-slate-500 text-sm font-medium">مرحباً {teacherName}، تابع إنجاز طلابك اليومي</p>
          </div>
        </div>
        
        <div className="bg-emerald-600 text-white px-8 py-4 rounded-3xl shadow-xl flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase opacity-80 mb-1">إجمالي أسطر الحلقة</p>
            <p className="text-3xl font-black">{totalCircleLines}</p>
          </div>
          <div className="w-[1px] h-10 bg-white/20"></div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase opacity-80 mb-1">عدد المختبرين</p>
            <p className="text-3xl font-black">{students.filter(s => s.status === 'تم التسميع').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <th className="px-8 py-5 text-right w-1/4">الطالب وبيانات التسميع</th>
              <th className="px-6 py-5 text-center">الأسطر</th>
              <th className="px-6 py-5 text-center">حالة التحضير</th>
              <th className="px-8 py-5 text-left">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length > 0 ? students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-right">
                  <div className="font-bold text-slate-800 text-lg mb-1">{student.name}</div>
                  {student.lastRecitationSummary && (
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black border border-emerald-100">
                      📖 {student.lastRecitationSummary}
                    </div>
                  )}
                  {!student.lastRecitationSummary && (
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">بانتظار التسميع اليوم...</div>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                   <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center mx-auto border-2 ${student.totalLinesToday > 0 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                     <span className="text-lg font-black">{student.totalLinesToday || 0}</span>
                     <span className="text-[8px] font-bold uppercase">سطر</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex justify-center gap-1.5">
                     {[
                       { key: 'حاضر', icon: '✅', color: 'emerald' },
                       { key: 'غائب', icon: '❌', color: 'red' },
                       { key: 'متأخر', icon: '⏳', color: 'amber' },
                       { key: 'مستأذن', icon: '📝', color: 'blue' }
                     ].map((btn) => (
                       <button
                         key={btn.key}
                         onClick={() => handleAttendance(student.id, btn.key)}
                         className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm transition-all border shadow-sm ${
                           student.attendance === btn.key 
                           ? `bg-${btn.color}-600 text-white border-${btn.color}-600 scale-110 shadow-lg` 
                           : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                         }`}
                       >
                         {btn.icon}
                       </button>
                     ))}
                   </div>
                </td>
                <td className="px-8 py-5 text-left">
                  {student.attendance === 'حاضر' ? (
                    <button 
                      onClick={() => openRecitation(student)} 
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black shadow-xl transition-all active:scale-95 animate-scaleIn ${
                        student.status === 'تم التسميع' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {student.status === 'تم التسميع' ? '🔄 تحديث التسميع' : '🎙️ رصد التسميع'}
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 italic px-4">بانتظار التحضير</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="py-24 text-center text-slate-400 font-black text-xl">لا يوجد طلاب في حلقاتك حالياً</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showRecitationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-8 bg-emerald-900 text-white flex justify-between items-center text-right">
              <div>
                <h3 className="text-xl font-black quran-font">رصد درجات: {selectedStudent?.name}</h3>
                <p className="text-xs text-emerald-200 font-bold mt-1">تأكد من إدخال عدد الأسطر بدقة للحساب الإجمالي</p>
              </div>
              <button onClick={() => setShowRecitationModal(false)} className="text-2xl hover:rotate-90 transition-transform">✕</button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
              {[
                { id: 'hifdh', title: 'حفظ جديد', color: 'emerald', icon: '✨' },
                { id: 'tathbeet', title: 'تثبيت ومراجعة صغرى', color: 'blue', icon: '📌' },
                { id: 'review', title: 'مراجعة كبرى', color: 'purple', icon: '🔄' }
              ].map((section: any) => {
                const isRange = section.id !== 'hifdh';
                return (
                  <div key={section.id} className="p-5 bg-slate-50 rounded-[32px] border-2 border-slate-100 group hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg`}>{section.icon}</span>
                        <h4 className="text-sm font-black text-slate-800">{section.title}</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                      <div className="w-full">
                        <label className={labelClass}>السورة</label>
                        <select className={inputClass} value={recitationForm[section.id].surah} onChange={(e) => setRecitationForm({...recitationForm, [section.id]: {...recitationForm[section.id], surah: e.target.value}})}>
                          <option value="">اختر السورة...</option>
                          {SURAHS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>

                      <div className="w-full">
                        <label className={labelClass}>عدد الأسطر المنجزة</label>
                        <input 
                          type="number" 
                          className={`${inputClass} bg-amber-50 border-amber-100 text-amber-700`}
                          value={recitationForm[section.id].lines}
                          onChange={(e) => setRecitationForm({...recitationForm, [section.id]: {...recitationForm[section.id], lines: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="w-full">
                        <label className={labelClass}>الدرجة</label>
                        <div className="flex gap-1.5">
                          {(section.id === 'review' ? ['10', '9', '8', 'يعاد'] : ['10', '9', 'يعاد']).map(g => (
                            <button 
                              key={g} 
                              onClick={() => setRecitationForm({...recitationForm, [section.id]: {...recitationForm[section.id], grade: g}})}
                              className={`flex-1 h-10 rounded-xl text-[10px] font-black border transition-all flex items-center justify-center ${
                                recitationForm[section.id].grade === g 
                                ? `bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105` 
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {g === 'يعاد' ? '🔄' : g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-8 bg-white border-t flex gap-4">
              <button onClick={saveRecitation} className="flex-1 py-5 bg-emerald-600 text-white rounded-[24px] font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
                حفظ الدرجات وحساب الأسطر
              </button>
              <button onClick={() => setShowRecitationModal(false)} className="px-12 py-5 bg-slate-50 text-slate-500 rounded-[24px] font-black hover:bg-slate-100 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
