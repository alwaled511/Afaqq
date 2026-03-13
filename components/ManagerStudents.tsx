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
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 text-right animate-fadeIn w-full" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 gap-4">
        <h2 className="text-2xl font-black text-emerald-900">إدارة شؤون الطلاب</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-800 transition-all shadow-xl text-lg"
        >
          + إضافة طالب جديد
        </button>
      </div>

      {/* قائمة الطلاب الحالية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">👦</div>
            <div className="overflow-hidden">
              <h3 className="font-black text-emerald-900 truncate">{student.fullName}</h3>
              <p className="text-xs text-gray-400 font-bold">{student.circle} | {student.studyLevel}</p>
            </div>
          </div>
        ))}
      </div>

      {/* النافذة المنبثقة (Modal) - تم تحسينها لتملأ الشاشة ووضوحها عالي */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-2 md:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[32px] p-6 md:p-10 shadow-2xl relative">
            <h3 className="text-2xl font-black text-emerald-900 mb-8 border-b pb-4">نموذج تسجيل طالب جديد</h3>
            
            <div className="space-y-8">
              {/* قسم الاسم */}
              <section>
                <p className="text-emerald-600 font-black text-sm mb-4">أولاً: الاسم الرباعي</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'الاسم الأول', key: 'firstName' },
                    { label: 'اسم الأب', key: 'fatherName' },
                    { label: 'اسم الجد', key: 'grandFatherName' },
                    { label: 'اسم العائلة', key: 'familyName' }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] font-black text-gray-400 mb-1">{field.label}</label>
                      <input 
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                        value={(newStudent as any)[field.key]}
                        onChange={e => setNewStudent({...newStudent, [field.key]: e.target.value})}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* قسم التواصل والمرحلة */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1">المرحلة الدراسية</label>
                  <select className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})}>
                    <option>ابتدائي</option><option>متوسط</option><option>ثانوي</option><option>جامعي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1">جوال الطالب</label>
                  <input className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-left font-bold" dir="ltr" placeholder="05xxxxxxxx" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1">جوال ولي الأمر</label>
                  <input className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-left font-bold" dir="ltr" placeholder="05xxxxxxxx" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                </div>
              </section>

              {/* قسم خطة الحفظ */}
              <section className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                <p className="text-emerald-700 font-black text-sm mb-4">ثانياً: خطة الحفظ والمقدار</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">بداية الحفظ من سورة:</label>
                    <input className="w-full p-4 rounded-xl bg-white border border-emerald-100 font-bold" placeholder="مثلاً: الناس" value={newStudent.startSurah} onChange={e => setNewStudent({...newStudent, startSurah: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">اتجاه الحفظ:</label>
                    <select className="w-full p-4 rounded-xl bg-white border border-emerald-100 font-bold" value={newStudent.direction} onChange={e => setNewStudent({...newStudent, direction: e.target.value})}>
                      <option>تصاعدي (من الناس إلى الفاتحة)</option>
                      <option>تنازلي (من البقرة إلى الناس)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">الهدف اليومي:</label>
                    <select className="w-full p-4 rounded-xl bg-white border border-emerald-100 font-bold" value={newStudent.target} onChange={e => setNewStudent({...newStudent, target: e.target.value})}>
                      <option>وجه واحد</option><option>وجهين</option><option>نصف وجه</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={handleAddStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl shadow-lg hover:bg-emerald-800 transition-all">حفظ البيانات</button>
              <button onClick={() => setShowAddModal(false)} className="px-8 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all">إغاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
