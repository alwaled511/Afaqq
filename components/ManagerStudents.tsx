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
      // تصغير الفورم بعد الحفظ
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

      {/* عرض الطلاب كبطاقات واضحة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">👤</div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-black text-emerald-900 truncate text-sm">{student.fullName}</h3>
              <p className="text-[10px] text-gray-400 font-bold">{student.circle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* النافذة المنبثقة - حل مشكلة "نصف الشاشة" */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] flex items-start md:items-center justify-center p-0 md:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-6xl md:rounded-[40px] shadow-2xl min-h-screen md:min-h-0 relative animate-slideUp">
            
            {/* رأس النافذة */}
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10 md:rounded-t-[40px]">
              <h3 className="text-xl font-black text-emerald-900">تسجيل طالب جديد في المسجد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-300 hover:text-red-500 transition-colors text-3xl font-light">×</button>
            </div>

            <div className="p-6 md:p-10 space-y-10 pb-24">
              {/* قسم الاسم الرباعي */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-r-4 border-emerald-500 pr-3">
                  <span className="text-emerald-900 font-black">المعلومات الأساسية</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'الاسم الأول', key: 'firstName' },
                    { label: 'اسم الأب', key: 'fatherName' },
                    { label: 'اسم الجد', key: 'grandFatherName' },
                    { label: 'اسم العائلة', key: 'familyName' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-black text-gray-400 mr-1">{field.label}</label>
                      <input 
                        className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
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
                  <label className="text-xs font-black text-gray-400 mr-1">المرحلة الدراسية</label>
                  <select className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})}>
                    <option>ابتدائي</option><option>متوسط</option><option>ثانوي</option><option>جامعي</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 mr-1">جوال الطالب</label>
                  <input className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-left" dir="ltr" placeholder="05xxxxxxxx" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 mr-1">جوال ولي الأمر</label>
                  <input className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-left" dir="ltr" placeholder="05xxxxxxxx" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                </div>
              </div>

              {/* قسم خطة الحفظ */}
              <div className="bg-emerald-50/50 p-6 md:p-8 rounded-[2rem] border border-emerald-100 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-800 font-black text-sm">خطة الحفظ والهدف اليومي</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-600 mr-1">بداية الحفظ من سورة</label>
                    <input className="w-full p-4 rounded-xl bg-white border-none font-bold shadow-sm" value={newStudent.startSurah} onChange={e => setNewStudent({...newStudent, startSurah: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-600 mr-1">اتجاه الحفظ</label>
                    <select className="w-full p-4 rounded-xl bg-white border-none font-bold shadow-sm" value={newStudent.direction} onChange={e => setNewStudent({...newStudent, direction: e.target.value})}>
                      <option>تصاعدي (من الناس إلى الفاتحة)</option>
                      <option>تنازلي (من البقرة إلى الناس)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-600 mr-1">الهدف اليومي</label>
                    <select className="w-full p-4 rounded-xl bg-white border-none font-bold shadow-sm" value={newStudent.target} onChange={e => setNewStudent({...newStudent, target: e.target.value})}>
                      <option>وجه واحد</option><option>وجهين</option><option>نصف وجه</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التحكم الثابتة في الأسفل */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t flex gap-4 md:rounded-b-[40px]">
              <button onClick={handleAddStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-800 transition-all active:scale-95">حفظ بيانات الطالب</button>
              <button onClick={() => setShowAddModal(false)} className="px-10 py-5 bg-gray-100 text-gray-400 rounded-2xl font-black hover:bg-gray-200 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
