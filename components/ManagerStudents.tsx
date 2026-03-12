import React, { useState, useEffect } from 'react';

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ 
    fullName: '', 
    parentPhone: '', 
    circle: 'حلقة البراعم',
    currentLevel: 'الجزء 30' 
  });

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    const filtered = allStudents.filter((s: any) => s.mosqueId === selectedMosque);
    setStudents(filtered);
  }, [selectedMosque]);

  const handleAddStudent = () => {
    if (newStudent.fullName) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const studentData = {
        ...newStudent,
        id: Date.now(),
        mosqueId: selectedMosque,
        progress: 0, // يبدأ من الصفر
        status: 'منتظم'
      };
      const updated = [...allStudents, studentData];
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-emerald-50">
        <h2 className="text-2xl font-black text-emerald-900 font-sans">شؤون الطلاب</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
        >
          + تسجيل طالب جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-[32px] border border-emerald-50 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:text-white transition-all">👶</div>
              <div>
                <h3 className="font-black text-emerald-900">{student.fullName}</h3>
                <p className="text-xs text-gray-400 font-bold">{student.circle} • {student.currentLevel}</p>
              </div>
            </div>
            <div className="text-left font-sans">
              <div className="text-[10px] text-gray-400 font-black uppercase mb-1">الإنجاز</div>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${student.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة الإضافة المختصرة */}
      {showAddModal && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-emerald-900 mb-8 border-b pb-4">تسجيل سريع</h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 mr-2">اسم الطالب الكامل</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 mt-1"
                  placeholder="الاسم رباعي"
                  value={newStudent.fullName}
                  onChange={e => setNewStudent({...newStudent, fullName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mr-2">جوال ولي الأمر</label>
                  <input 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 mt-1 text-left"
                    placeholder="05xxxxxxxx"
                    value={newStudent.parentPhone}
                    onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mr-2">الحلقة</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 mt-1"
                    value={newStudent.circle}
                    onChange={e => setNewStudent({...newStudent, circle: e.target.value})}
                  >
                    <option>حلقة البراعم</option>
                    <option>حلقة الحفاظ</option>
                    <option>حلقة التميز</option>
                  </select>
                </div>
              </div>
              <button onClick={handleAddStudent} className="w-full py-5 bg-emerald-900 text-white rounded-[24px] font-black shadow-xl mt-4">تأكيد التسجيل</button>
              <button onClick={() => setShowAddModal(false)} className="w-full py-2 text-gray-400 font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
