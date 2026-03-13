import React, { useState, useEffect } from 'react';

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newStudent, setNewStudent] = useState({ 
    firstName: '', fatherName: '', grandFatherName: '', familyName: '',
    circle: 'حلقة البراعم', studyLevel: 'ابتدائي',
    studentPhone: '', parentPhone: '',
    startSurah: 'الناس', direction: 'الناس إلى الفاتحة', target: '1 وجه'
  });

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.familyName) {
      const fullName = `${newStudent.firstName} ${newStudent.fatherName} ${newStudent.grandFatherName} ${newStudent.familyName}`.trim();
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const studentData = { ...newStudent, id: Date.now(), mosqueId: selectedMosque, fullName: fullName, currentSurah: newStudent.startSurah, points: 0 };
      const updated = [...allStudents, studentData];
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false);
      setNewStudent({ 
        firstName: '', fatherName: '', grandFatherName: '', familyName: '',
        circle: 'حلقة البراعم', studyLevel: 'ابتدائي',
        studentPhone: '', parentPhone: '',
        startSurah: 'الناس', direction: 'الناس إلى الفاتحة', target: '1 وجه'
      });
    }
  };

  return (
    <div className="w-full min-h-screen p-2 md:p-8 space-y-6 text-right animate-fadeIn" dir="rtl">
      {/* الهيدر العلوي */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">شؤون الطلاب</h2>
          <p className="text-xs text-gray-400 font-bold">إدارة بيانات طلاب المسجد المختار</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto bg-emerald-900 text-white px-12 py-4 rounded-2xl font-black hover:bg-emerald-800 transition-all shadow-xl text-lg active:scale-95"
        >
          + إضافة طالب جديد
        </button>
      </div>

      {/* عرض الطلاب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">👤</div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-black text-emerald-900 truncate text-sm">{student.fullName}</h3>
              <p className="text-[10px] text-gray-400 font-bold">{student.circle}</p>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-black">لا يوجد طلاب مسجلين في هذا المسجد حتى الآن.</p>
          </div>
        )}
      </div>

      {/* النافذة المنبثقة (Modal) - مع حل مشكلة السحب والتمرير */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 sm:p-6">
          
          {/* الحاوية الرئيسية للنافذة: أقصى ارتفاع 90% من الشاشة لضمان عدم الخروج من الشاشة */}
          <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn relative">
            
            {/* 1. رأس النافذة (ثابت) */}
            <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center shrink-0 z-10">
              <h3 className="text-xl font-black text-emerald-900">تسجيل طالب جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors text-2xl font-black">&times;</button>
            </div>

            {/* 2. منطقة الخانات (قابلة للتمرير Scroll) */}
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
              
              {/* قسم الاسم الرباعي */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-r-4 border-emerald-500 pr-3">
                  <span className="text-emerald-900 font-black">المعلومات الأساسية</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'الاسم الأول', key: 'firstName' },
                    { label: 'اسم الأب', key: 'fatherName' },
                    { label: 'اسم الجد', key: 'grandFatherName' },
                    { label: 'اسم العائلة', key: 'familyName' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-[11px] font-black text-gray-500 mr-1">{field.label}</label>
                      <input 
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-emerald-900"
                        value={(newStudent as any)[field.key]}
                        onChange={e => setNewStudent({...newStudent, [field.key]: e.target.value})}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* قسم التواصل */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 mr-1">المرحلة الدراسية</label>
                  <select className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})}>
                    <option>ابتدائي</option><option>متوسط</option><option>ثانوي</option><option>جامعي</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 mr-1">جوال الطالب</label>
                  <input className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-left outline-none" dir="ltr" placeholder="05xxxxxxxx" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 mr-1">جوال ولي الأمر</label>
                  <input className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-left outline-none" dir="ltr" placeholder="05xxxxxxxx" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                </div>
              </div>

              {/* قسم خطة الحفظ */}
              <div className="bg-emerald-50/50 p-6 rounded-[1.5rem] border border-emerald-100 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-900 font-black text-sm">خطة الحفظ والهدف اليومي</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-600 mr-1">بداية الحفظ من سورة</label>
                    <input className="w-full p-4 rounded-xl bg-white border border-emerald-100 outline-none font-bold shadow-sm" placeholder="مثال: الناس" value={newStudent.startSurah} onChange={e => setNewStudent({...newStudent, startSurah: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-600 mr-1">اتجاه الحفظ</label>
                    <select className="w-full p-4 rounded-xl bg-white border border-emerald-100 outline-none font-bold shadow-sm" value={newStudent.direction} onChange={e => setNewStudent({...newStudent, direction: e.target.value})}>
                      <option>تصاعدي (من الناس إلى الفاتحة)</option>
                      <option>تنازلي (من البقرة إلى الناس)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-600 mr-1">الهدف اليومي</label>
                    <select className="w-full p-4 rounded-xl bg-white border border-emerald-100 outline-none font-bold shadow-sm" value={newStudent.target} onChange={e => setNewStudent({...newStudent, target: e.target.value})}>
                      <option>وجه واحد</option><option>وجهين</option><option>نصف وجه</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. منطقة الأزرار (ثابتة في الأسفل) */}
            <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-100 flex gap-4 shrink-0 z-10">
              <button onClick={handleAddStudent} className="flex-1 py-4 bg-emerald-900 text-white rounded-xl font-black text-lg shadow-md hover:bg-emerald-800 transition-all active:scale-95">حفظ واعتماد الطالب</button>
              <button onClick={() => setShowAddModal(false)} className="px-6 sm:px-10 py-4 bg-white border border-gray-200 text-gray-500 rounded-xl font-black hover:bg-gray-100 transition-all">إلغاء</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
