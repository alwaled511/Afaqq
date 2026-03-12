import React, { useState, useEffect } from 'react';

interface ManagerTeachersProps {
  onEnterTeacherPortal: (name: string) => void;
  selectedMosque: string; // استلام المسجد المختار من App.tsx
}

const ManagerTeachers: React.FC<ManagerTeachersProps> = ({ onEnterTeacherPortal, selectedMosque }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', phone: '', email: '', specialty: 'حفظ' });

  // تحميل المعلمين وفلترتهم حسب المسجد
  useEffect(() => {
    const savedTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    // فلترة: اعرض فقط المعلمين الذين يتبعون المسجد المختار
    const filtered = savedTeachers.filter((t: any) => t.mosqueId === selectedMosque);
    setTeachers(filtered);
  }, [selectedMosque]); // يتحدث الترتيب فور تغيير المسجد في الشريط العلوي

  const handleAddTeacher = () => {
    if (newTeacher.name) {
      const savedTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const teacherWithMosque = { 
        ...newTeacher, 
        id: Date.now(), 
        mosqueId: selectedMosque // ربط المعلم بالمسجد النشط حالياً
      };
      
      const updatedAll = [...savedTeachers, teacherWithMosque];
      localStorage.setItem('afaq_teachers', JSON.stringify(updatedAll));
      
      // تحديث القائمة المعروضة فوراً
      setTeachers(updatedAll.filter((t: any) => t.mosqueId === selectedMosque));
      setShowAddModal(false);
      setNewTeacher({ name: '', phone: '', email: '', specialty: 'حفظ' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة المعلمين</h2>
          <p className="text-sm text-gray-500">عرض الكادر التعليمي للمسجد المختار</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-800 transition-all"
        >
          + إضافة معلم جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.length > 0 ? teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-emerald-50 hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl">👨‍🏫</div>
              <div>
                <h3 className="font-bold text-emerald-900">{teacher.name}</h3>
                <p className="text-xs text-gray-400">{teacher.specialty}</p>
              </div>
            </div>
            <button 
              onClick={() => onEnterTeacherPortal(teacher.name)}
              className="w-full py-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-black hover:bg-emerald-900 hover:text-white transition-all"
            >
              دخول لملف المعلم
            </button>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-emerald-100">
            <p className="text-gray-400 font-bold text-lg">لا يوجد معلمون مضافون لهذا المسجد بعد</p>
          </div>
        )}
      </div>

      {/* نافذة إضافة معلم */}
      {showAddModal && (
        <div className="fixed inset-0 bg-emerald-950/20 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl">
            <h3 className="text-xl font-black text-emerald-900 mb-6 text-center">إضافة معلم للمسجد</h3>
            <div className="space-y-4">
              <input 
                placeholder="اسم المعلم"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500"
                value={newTeacher.name}
                onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
              />
              <button 
                onClick={handleAddTeacher}
                className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-black shadow-lg"
              >
                تأكيد الإضافة
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-full py-4 text-gray-400 font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTeachers;
