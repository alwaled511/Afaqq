import React, { useState, useEffect } from 'react';

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // الحالة الابتدائية للنموذج - خانة اسم واحدة وأهداف بالأسطر
  const initialState = { 
    tripleName: '', 
    circle: 'حلقة البراعم', studyLevel: 'ابتدائي',
    studentPhone: '', parentPhone: '',
    
    hifzEnabled: true,
    hifzFromSurah: 'الناس', hifzVerse: '1', hifzLinesTarget: '5', hifzGroup: 'المجموعة الأولى', hifzDirection: 'تصاعدي',
    
    tathbitEnabled: false,
    tathbitStartSurah: 'الناس', tathbitVerse: '1', tathbitGroup: 'المجموعة الأولى',
    
    murajaahEnabled: false,
    murajaahType: 'تلقائي', murajaahGroup: 'المجموعة الأولى', murajaahLinesTarget: '10', 
    murajaahFromSurah: 'الفاتحة', murajaahToSurah: 'الناس'
  };

  const [newStudent, setNewStudent] = useState(initialState);

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const handleAddStudent = () => {
    if (newStudent.tripleName) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const studentData = { ...newStudent, id: Date.now(), mosqueId: selectedMosque, fullName: newStudent.tripleName, points: 0 };
      const updated = [...allStudents, studentData];
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false);
      setNewStudent(initialState);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 text-right animate-fadeIn" dir="rtl">
      
      {/* البار العلوي */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">شؤون الطلاب</h2>
          <p className="text-xs text-gray-400 font-bold">إدارة المسجلين في المسجد الحالي</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="w-full md:w-auto bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-800 transition-all shadow-xl active:scale-95">
          + إضافة طالب جديد
        </button>
      </div>

      {/* قائمة الطلاب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">👤</div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-black text-emerald-900 truncate text-sm">{student.fullName}</h3>
              <p className="text-[10px] text-gray-400 font-bold">{student.circle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة الإضافة المحدثة */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4 py-10">
            <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-hidden animate-scaleIn">
              
              {/* العنوان */}
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-emerald-900">تسجيل طالب جديد</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
              </div>

              {/* المحتوى */}
              <div className="p-6 md:p-10 space-y-12">
                
                {/* القسم الأول: الهوية */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-r-4 border-emerald-500 pr-3">
                    <span className="text-emerald-900 font-black">بيانات الطالب</span>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 mr-1">الاسم الثلاثي</label>
                      <input 
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="أدخل الاسم الثلاثي للطالب..."
                        value={newStudent.tripleName} 
                        onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[11px] font-black text-gray-400 block mb-1">المرحلة الدراسية</label>
                      <select className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})}>
                        <option>ابتدائي</option><option>متوسط</option><option>ثانوي</option><option>جامعي</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-gray-400 block mb-1">جوال الطالب</label>
                      <input className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-left" dir="ltr" placeholder="05xxxxxxxx" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-gray-400 block mb-1">جوال ولي الأمر</label>
                      <input className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-left" dir="ltr" placeholder="05xxxxxxxx" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-gray-400 block mb-1">تحديد الحلقة</label>
                      <select className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})}>
                        <option>حلقة البراعم</option><option>حلقة الشباب</option><option>حلقة الحفاظ</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* القسم الثاني: الخطة التعليمية (أسطر) */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-r-4 border-emerald-500 pr-3">
                    <span className="text-emerald-900 font-black">الخطة التعليمية اليومية</span>
                  </div>

                  {/* الحفظ */}
                  <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-emerald-800">
                      <input type="checkbox" checked={newStudent.hifzEnabled} onChange={e => setNewStudent({...newStudent, hifzEnabled: e.target.checked})} className="w-5 h-5 accent-emerald-600" />
                      <span>خطة الحفظ الجديد</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div><label className="text-[10px] font-bold text-gray-500">من سورة</label><input className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})} /></div>
                      <div><label className="text-[10px] font-bold text-gray-500">آية رقم</label><input className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} /></div>
                      <div><label className="text-[10px] font-bold text-gray-500">الهدف (عدد الأسطر)</label><input type="number" className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} /></div>
                      <div><label className="text-[10px] font-bold text-gray-500">المجموعة</label><select className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.hifzGroup} onChange={e => setNewStudent({...newStudent, hifzGroup: e.target.value})}><option>المجموعة الأولى</option></select></div>
                      <div><label className="text-[10px] font-bold text-gray-500">الاتجاه</label><select className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select></div>
                    </div>
                  </div>

                  {/* التثبيت والمراجعة بنفس التنسيق... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* التثبيت */}
                    <div className="bg-blue-50/40 p-6 rounded-3xl border border-blue-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 font-black text-blue-800">
                        <input type="checkbox" checked={newStudent.tathbitEnabled} onChange={e => setNewStudent({...newStudent, tathbitEnabled: e.target.checked})} className="w-5 h-5 accent-blue-600" />
                        <span>التثبيت</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div><label className="text-[10px] font-bold text-gray-500 block">من سورة</label><input className="w-full p-3 rounded-lg bg-white font-bold text-xs" value={newStudent.tathbitStartSurah} onChange={e => setNewStudent({...newStudent, tathbitStartSurah: e.target.value})} /></div>
                        <div><label className="text-[10px] font-bold text-gray-500 block">آية رقم</label><input className="w-full p-3 rounded-lg bg-white font-bold text-xs" value={newStudent.tathbitVerse} onChange={e => setNewStudent({...newStudent, tathbitVerse: e.target.value})} /></div>
                        <div><label className="text-[10px] font-bold text-gray-500 block">المجموعة</label><select className="w-full p-3 rounded-lg bg-white font-bold text-xs" value={newStudent.tathbitGroup} onChange={e => setNewStudent({...newStudent, tathbitGroup: e.target.value})}><option>الأولى</option></select></div>
                      </div>
                    </div>

                    {/* المراجعة */}
                    <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 font-black text-amber-800">
                        <input type="checkbox" checked={newStudent.murajaahEnabled} onChange={e => setNewStudent({...newStudent, murajaahEnabled: e.target.checked})} className="w-5 h-5 accent-amber-600" />
                        <span>المراجعة</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div><label className="text-[10px] font-bold text-gray-500 block">الهدف (أسطر)</label><input type="number" className="w-full p-3 rounded-lg bg-white font-bold text-xs" value={newStudent.murajaahLinesTarget} onChange={e => setNewStudent({...newStudent, murajaahLinesTarget: e.target.value})} /></div>
                        <div><label className="text-[10px] font-bold text-gray-500 block">من سورة</label><input className="w-full p-3 rounded-lg bg-white font-bold text-xs" value={newStudent.murajaahFromSurah} onChange={e => setNewStudent({...newStudent, murajaahFromSurah: e.target.value})} /></div>
                        <div><label className="text-[10px] font-bold text-gray-500 block">المجموعة</label><select className="w-full p-3 rounded-lg bg-white font-bold text-xs" value={newStudent.murajaahGroup} onChange={e => setNewStudent({...newStudent, murajaahGroup: e.target.value})}><option>الأولى</option></select></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="p-6 bg-gray-50 border-t flex gap-4">
                <button onClick={handleAddStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl hover:bg-emerald-800 transition-all shadow-lg active:scale-95">حفظ بيانات الطالب</button>
                <button onClick={() => setShowAddModal(false)} className="px-10 py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black hover:bg-gray-100 transition-all">إلغاء</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
