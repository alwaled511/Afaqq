import React, { useState, useEffect } from 'react';

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // الحالة الابتدائية: حذفنا المجموعات وأبقينا الجوهر
  const initialState = { 
    tripleName: '', 
    circle: 'حلقة البراعم', studyLevel: 'ابتدائي',
    studentPhone: '', parentPhone: '',
    
    // إعدادات الحفظ (الأساس للانتقال التلقائي)
    hifzEnabled: true,
    hifzFromSurah: 'الناس', hifzVerse: '1', hifzLinesTarget: '5', hifzDirection: 'تصاعدي',
    
    // التثبيت والمراجعة
    tathbitEnabled: false,
    tathbitStartSurah: 'الناس', tathbitVerse: '1',
    murajaahEnabled: false,
    murajaahLinesTarget: '10', murajaahFromSurah: 'الفاتحة'
  };

  const [newStudent, setNewStudent] = useState(initialState);

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const handleAddStudent = () => {
    if (newStudent.tripleName) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      
      // هنا نجهز بيانات الطالب لدعم التسميع التلقائي
      const studentData = { 
        ...newStudent, 
        id: Date.now(), 
        mosqueId: selectedMosque, 
        fullName: newStudent.tripleName,
        points: 0,
        // هذه البيانات ستتحدث تلقائياً عند كل تسميع
        currentPosition: {
          surah: newStudent.hifzFromSurah,
          verse: parseInt(newStudent.hifzVerse)
        }
      };

      const updated = [...allStudents, studentData];
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false);
      setNewStudent(initialState);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 text-right animate-fadeIn" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">شؤون الطلاب</h2>
          <p className="text-xs text-gray-400 font-bold">إدارة بيانات المسجلين</p>
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

      {/* نافذة الإضافة */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4 py-10">
            <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-hidden animate-scaleIn">
              
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-emerald-900">تسجيل طالب جديد</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
              </div>

              <div className="p-6 md:p-10 space-y-10">
                
                {/* بيانات الهوية */}
                <div className="space-y-6">
                  <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">بيانات الطالب</h4>
                  <input 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="الاسم الثلاثي للطالب..."
                    value={newStudent.tripleName} 
                    onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select className="p-4 rounded-xl bg-gray-50 border-none font-bold outline-none" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})}>
                      <option>ابتدائي</option><option>متوسط</option><option>ثانوي</option><option>جامعي</option>
                    </select>
                    <input className="p-4 rounded-xl bg-gray-50 border-none font-bold text-left outline-none" dir="ltr" placeholder="جوال الطالب" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                    <select className="p-4 rounded-xl bg-gray-50 border-none font-bold outline-none" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})}>
                      <option>حلقة البراعم</option><option>حلقة الشباب</option><option>حلقة الحفاظ</option>
                    </select>
                  </div>
                </div>

                {/* الخطة التعليمية - بدون مجموعات */}
                <div className="space-y-6">
                  <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">خطة التسميع التلقائي</h4>
                  
                  {/* الحفظ */}
                  <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-emerald-800">
                      <input type="checkbox" checked={newStudent.hifzEnabled} onChange={e => setNewStudent({...newStudent, hifzEnabled: e.target.checked})} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                      <span>خطة الحفظ</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">من سورة</label><input className="w-full p-3 rounded-lg bg-white font-bold" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})} /></div>
                      <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">آية رقم</label><input className="w-full p-3 rounded-lg bg-white font-bold" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} /></div>
                      <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">الهدف اليومي (أسطر)</label><input type="number" className="w-full p-3 rounded-lg bg-white font-bold" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} /></div>
                      <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">اتجاه التقدم</label><select className="w-full p-3 rounded-lg bg-white font-bold" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* التثبيت */}
                    <div className="bg-blue-50/40 p-6 rounded-3xl border border-blue-100 space-y-4">
                      <div className="flex items-center gap-2 font-black text-blue-800">
                        <input type="checkbox" checked={newStudent.tathbitEnabled} onChange={e => setNewStudent({...newStudent, tathbitEnabled: e.target.checked})} className="w-5 h-5 accent-blue-600" />
                        <span>التثبيت</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] font-bold text-gray-500 block">من سورة</label><input className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.tathbitStartSurah} onChange={e => setNewStudent({...newStudent, tathbitStartSurah: e.target.value})} /></div>
                        <div><label className="text-[10px] font-bold text-gray-500 block">آية رقم</label><input className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.tathbitVerse} onChange={e => setNewStudent({...newStudent, tathbitVerse: e.target.value})} /></div>
                      </div>
                    </div>

                    {/* المراجعة */}
                    <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-100 space-y-4">
                      <div className="flex items-center gap-2 font-black text-amber-800">
                        <input type="checkbox" checked={newStudent.murajaahEnabled} onChange={e => setNewStudent({...newStudent, murajaahEnabled: e.target.checked})} className="w-5 h-5 accent-amber-600" />
                        <span>المراجعة</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] font-bold text-gray-500 block">الهدف (أسطر)</label><input type="number" className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.murajaahLinesTarget} onChange={e => setNewStudent({...newStudent, murajaahLinesTarget: e.target.value})} /></div>
                        <div><label className="text-[10px] font-bold text-gray-500 block">من سورة</label><input className="w-full p-3 rounded-lg bg-white font-bold text-sm" value={newStudent.murajaahFromSurah} onChange={e => setNewStudent({...newStudent, murajaahFromSurah: e.target.value})} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الحفظ */}
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
