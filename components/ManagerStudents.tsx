
import React, { useState, useEffect } from 'react';
import { SURAHS } from '../constants';
import { StudyPlan } from '../types';

const ManagerStudents: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  
  const initialPlanState: StudyPlan = {
    hifdh: { surah: 'البقرة', from: 1, to: 1, lines: 15 },
    tathbeet: { surah: 'الفاتحة', from: 1, to: 7, lines: 7 },
    review: { surah: 'النبأ', from: 1, to: 40, lines: 20 },
    lastUpdated: new Date().toISOString()
  };

  const [studentForm, setStudentForm] = useState({
    name: '',
    circle: '',
    idNumber: '',
    birthDate: '',
    status: 'نشط',
    parentPhone: '',
    plan: initialPlanState
  });

  useEffect(() => {
    const loadData = () => {
      const savedStudents = localStorage.getItem('afaq_students');
      const savedCircles = localStorage.getItem('afaq_circles');
      
      if (savedStudents) setStudents(JSON.parse(savedStudents));
      if (savedCircles) setCircles(JSON.parse(savedCircles));
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setStudentForm({ 
      name: '', 
      circle: '', 
      idNumber: '', 
      birthDate: '', 
      status: 'نشط', 
      parentPhone: '',
      plan: initialPlanState
    });
    setShowAddModal(true);
  };

  const openEditModal = (student: any) => {
    setEditingId(student.id);
    setStudentForm({
      name: student.name,
      circle: student.circle || '',
      idNumber: student.idNumber || '',
      birthDate: student.birthDate || '',
      status: student.status || 'نشط',
      parentPhone: student.parentPhone || '',
      plan: student.plan || initialPlanState
    });
    setShowAddModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedStudents;

    const finalStudentData = {
      ...studentForm,
      plan: { ...studentForm.plan, lastUpdated: new Date().toISOString() }
    };

    if (editingId) {
      updatedStudents = students.map(s => 
        s.id === editingId ? { ...s, ...finalStudentData } : s
      );
    } else {
      const newStudent = {
        id: Date.now().toString(),
        ...finalStudentData,
        progress: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      updatedStudents = [newStudent, ...students];
    }

    setStudents(updatedStudents);
    localStorage.setItem('afaq_students', JSON.stringify(updatedStudents));
    window.dispatchEvent(new Event('storage'));
    setShowAddModal(false);
  };

  const updatePlanItem = (type: keyof StudyPlan, field: string, value: any) => {
    if (type === 'lastUpdated') return;
    setStudentForm({
      ...studentForm,
      plan: {
        ...studentForm.plan,
        [type]: {
          ...(studentForm.plan[type] as any),
          [field]: value
        }
      }
    });
  };

  const labelClass = "block text-[10px] font-black text-slate-400 mb-1 tracking-widest uppercase";
  const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all";

  const renderPlanSection = (type: 'hifdh' | 'tathbeet' | 'review', label: string, color: string) => {
    const isRange = type === 'tathbeet' || type === 'review';
    
    return (
      <div className={`p-6 rounded-[32px] border-2 border-slate-50 bg-slate-50/30 space-y-4`}>
        <h4 className={`text-xs font-black text-${color}-700 flex items-center gap-2`}>
          <span className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`}></span>
          {label}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className={labelClass}>السورة</label>
            <select 
              className={inputClass}
              value={studentForm.plan[type].surah}
              onChange={(e) => updatePlanItem(type, 'surah', e.target.value)}
            >
              {SURAHS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>من آية</label>
            <input 
              type="number" 
              className={inputClass} 
              value={studentForm.plan[type].from}
              onChange={(e) => updatePlanItem(type, 'from', parseInt(e.target.value) || 0)}
            />
          </div>
          {isRange ? (
            <div>
              <label className={labelClass}>إلى آية</label>
              <input 
                type="number" 
                className={inputClass} 
                value={studentForm.plan[type].to}
                onChange={(e) => updatePlanItem(type, 'to', parseInt(e.target.value) || 0)}
              />
            </div>
          ) : (
            <div>
              <label className={labelClass}>عدد الأسطر</label>
              <input 
                type="number" 
                className={`${inputClass} bg-amber-50/30 border-amber-100 text-amber-700`} 
                value={studentForm.plan[type].lines}
                onChange={(e) => updatePlanItem(type, 'lines', parseInt(e.target.value) || 0)}
              />
            </div>
          )}
          {!isRange && <div></div>} {/* spacer for hifdh layout */}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-right">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 quran-font">شؤون الطلاب</h2>
          <p className="text-slate-500 text-sm font-medium">إدارة السجلات والخطط الدراسية لكل طالب</p>
        </div>
        <button onClick={openAddModal} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl flex items-center gap-2 active:scale-95"><span>➕</span> تسجيل طالب جديد</button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <th className="px-8 py-5">اسم الطالب</th>
              <th className="px-6 py-5">رقم ولي الأمر</th>
              <th className="px-6 py-5">الحلقة</th>
              <th className="px-6 py-5">الخطة</th>
              <th className="px-8 py-5 text-left">الإدارة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.length > 0 ? students.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black">{st.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-slate-800">{st.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{st.idNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-bold text-slate-700">{st.parentPhone || 'غير متوفر'}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-bold text-slate-500">{st.circle || 'غير محدد'}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black ${st.plan ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {st.plan ? '✅ مفعلة' : '⚠️ غير محددة'}
                  </span>
                </td>
                <td className="px-8 py-5 text-left">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEditModal(st)} className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm flex items-center gap-2 text-xs font-bold">📝 تعديل</button>
                    <button onClick={() => { if(window.confirm('حذف؟')){setStudents(students.filter(s=>s.id!==st.id)); localStorage.setItem('afaq_students', JSON.stringify(students.filter(s=>s.id!==st.id))); window.dispatchEvent(new Event('storage')); }}} className="p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm flex items-center gap-2 text-xs font-bold">🗑️ حذف</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold">لا يوجد طلاب مسجلين حالياً</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[56px] shadow-2xl animate-scaleIn overflow-hidden max-h-[95vh] flex flex-col">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-black text-slate-800 quran-font">{editingId ? 'تعديل بيانات الطالب' : 'تسجيل طالب جديد'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold text-xl hover:text-red-500 transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSaveStudent} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>الاسم الكامل</label>
                  <input required type="text" className={inputClass} value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>رقم ولي الأمر</label>
                  <input required type="tel" className={inputClass} value={studentForm.parentPhone} onChange={(e) => setStudentForm({...studentForm, parentPhone: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>الحلقة</label>
                  <select required className={inputClass} value={studentForm.circle} onChange={(e) => setStudentForm({...studentForm, circle: e.target.value})}>
                    <option value="">اختر الحلقة...</option>
                    {circles.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-black text-emerald-800 border-r-4 border-emerald-500 pr-3">تخصيص المنهج الأكاديمي</h4>
                {renderPlanSection('hifdh', 'حفظ جديد (نقطة البداية + كمية)', 'emerald')}
                {renderPlanSection('tathbeet', 'تثبيت ومراجعة صغرى (نطاق آيات)', 'blue')}
                {renderPlanSection('review', 'مراجعة كبرى (نطاق آيات)', 'purple')}
              </div>
            </form>

            <div className="p-8 bg-white border-t flex gap-4 shrink-0">
              <button type="submit" onClick={handleSaveStudent} className="flex-1 bg-emerald-600 text-white py-5 rounded-[24px] font-black shadow-xl hover:bg-emerald-700 transition-all active:scale-95">حفظ البيانات والمنهج</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="px-12 py-5 bg-slate-100 text-slate-500 rounded-[24px] font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
