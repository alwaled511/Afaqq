import React, { useState, useEffect } from 'react';

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // نموذج الطالب الشامل كما في الصورة
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
      
      const studentData = {
        ...newStudent,
        id: Date.now(),
        mosqueId: selectedMosque,
        fullName: fullName,
        currentSurah: newStudent.startSurah, // يربط مع المعلم لبداية الحفظ
        points: 0
      };
      
      const updated = [...allStudents, studentData];
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 text-right animate-fadeIn" dir="rtl">
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-emerald-50">
        <h2 className="text-2xl font-black text-emerald-900">شؤون الطلاب</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg"
        >
          + تسجيل طالب جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-[32px] border border-emerald-50 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl">👦</div>
            <div>
              <h3 className="font-black text-emerald-900 text-lg">{student.fullName}</h3>
              <p className="text-xs text-gray-500 font-bold mt-1">
                {student.circle} • يبدأ من: {student.startSurah}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-[#0C1E14]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FDFDFD] w-full max-w-4xl rounded-[40px] p-10 shadow-2xl my-8">
            <h3 className="text-3xl font-black text-emerald-900 mb-8 border-b-2 border-emerald-100 pb-4">إضافة طالب جديد</h3>
            
            {/* القسم الأول: المعلومات الأساسية */}
            <div className="mb-8">
              <h4 className="text-sm font-black text-amber-600 mb-4 bg-amber-50 inline-block px-4 py-1 rounded-full">المعلومات الأساسية</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">الاسم الأول</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mt-1" value={newStudent.firstName} onChange={e => setNewStudent({...newStudent, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">اسم الأب</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mt-1" value={newStudent.fatherName} onChange={e => setNewStudent({...newStudent, fatherName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">اسم الجد</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mt-1" value={newStudent.grandFatherName} onChange={e => setNewStudent({...newStudent, grandFatherName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">اسم العائلة</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mt-1" value={newStudent.familyName} onChange={e => setNewStudent({...newStudent, familyName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">المرحلة الدراسية</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mt-1" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})}>
                    <option>ابتدائي</option><option>متوسط</option><option>ثانوي</option><option>جامعي</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">الحلقة المرشحة</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mt-1" placeholder="اسم الحلقة" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">جوال الطالب</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mt-1 text-left" dir="ltr" placeholder="05x..." value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">جوال ولي الأمر</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mt-1 text-left" dir="ltr" placeholder="05x..." value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                </div>
              </div>
            </div>

            {/* القسم الثاني: خطة الحفظ والمراجعة */}
            <div className="mb-8 p-6 bg-slate-50 rounded-[24px] border border-slate-100">
              <h4 className="text-sm font-black text-emerald-700 mb-4 bg-emerald-100 inline-block px-4 py-1 rounded-full">إعدادات الحفظ والتسميع</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-600">يبدأ الحفظ من سورة:</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 mt-1" value={newStudent.startSurah} onChange={e => setNewStudent({...newStudent, startSurah: e.target.value})}>
                    <option value="الناس">الناس (للمبتدئين)</option>
                    <option value="النبأ">النبأ (جزء عم)</option>
                    <option value="المجادلة">المجادلة (قد السمع)</option>
                    <option value="البقرة">البقرة (للحفاظ)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">اتجاه الحفظ:</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 mt-1" value={newStudent.direction} onChange={e => setNewStudent({...newStudent, direction: e.target.value})}>
                    <option>من الناس إلى الفاتحة (تصاعدي)</option>
                    <option>من البقرة إلى الناس (تنازلي)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">الهدف اليومي (المقدار):</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 mt-1" value={newStudent.target} onChange={e => setNewStudent({...newStudent, target: e.target.value})}>
                    <option>نصف وجه</option>
                    <option>1 وجه</option>
                    <option>2 وجه (مقطعين)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleAddStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-800 transition-all">اعتماد وتسجيل الطالب</button>
              <button onClick={() => setShowAddModal(false)} className="px-8 py-5 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-100 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
