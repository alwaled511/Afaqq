import React, { useState, useEffect } from 'react';

interface ManagerTeachersProps {
  onEnterTeacherPortal: (name: string) => void;
  selectedMosque: string;
}

const ManagerTeachers: React.FC<ManagerTeachersProps> = ({ onEnterTeacherPortal, selectedMosque }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // النموذج الجديد بناءً على طلبك
  const [newTeacher, setNewTeacher] = useState({ 
    fullName: '', 
    phone: '', 
    teacherType: 'معلم حلقة', 
    password: '' 
  });

  useEffect(() => {
    const savedTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    const filtered = savedTeachers.filter((t: any) => t.mosqueId === selectedMosque);
    setTeachers(filtered);
  }, [selectedMosque]);

  const handleAddTeacher = () => {
    if (newTeacher.fullName && newTeacher.phone) {
      const savedTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const teacherWithMosque = { 
        ...newTeacher, 
        id: Date.now(), 
        mosqueId: selectedMosque,
        name: newTeacher.fullName // نستخدم هذا للعرض في البطاقات
      };
      
      const updatedAll = [...savedTeachers, teacherWithMosque];
      localStorage.setItem('afaq_teachers', JSON.stringify(updatedAll));
      
      setTeachers(updatedAll.filter((t: any) => t.mosqueId === selectedMosque));
      setShowAddModal(false);
      setNewTeacher({ fullName: '', phone: '', teacherType: 'معلم حلقة', password: '' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-emerald-50 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة الكادر التعليمي</h2>
          <p className="text-sm text-gray-400 mt-1">يمكنك إضافة وتعديل بيانات المعلمين بكل سهولة</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> إضافة معلم جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white p-6 rounded-[32px] border border-emerald-50 hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-emerald-900 group-hover:text-white transition-colors">👨‍🏫</div>
              <div>
                <h3 className="font-black text-emerald-900">{teacher.fullName}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{teacher.teacherType}</p>
              </div>
            </div>
            <button 
              onClick={() => onEnterTeacherPortal(teacher.fullName)}
              className="w-full py-4 bg-emerald-50 text-emerald-900 rounded-2xl text-xs font-black hover:bg-emerald-900 hover:text-white transition-all shadow-sm"
            >
              دخول لملف المعلم
            </button>
          </div>
        ))}
      </div>

      {/* نافذة الإضافة المطورّة - تشبه لقطة الشاشة التي أرفقتها */}
      {showAddModal && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#FDFDFD] w-full max-w-2xl rounded-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="mb-8 border-b border-gray-100 pb-6">
              <h3 className="text-2xl font-black text-emerald-900">إضافة معلم جديد</h3>
              <p className="text-gray-400 text-sm mt-1">البيانات الشخصية والمهنية</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 mr-2">الاسم الكامل</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 text-right"
                  value={newTeacher.fullName}
                  onChange={e => setNewTeacher({...newTeacher, fullName: e.target.value})}
                  placeholder="مثال: محمد بن خالد السلمان"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 mr-2">رقم الجوال</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 text-left"
                  dir="ltr"
                  value={newTeacher.phone}
                  onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})}
                  placeholder="05x xxxx xxx"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 mr-2">نوع المعلم</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500"
                  value={newTeacher.teacherType}
                  onChange={e => setNewTeacher({...newTeacher, teacherType: e.target.value})}
                >
                  <option>معلم حلقة</option>
                  <option>مشرف مسار</option>
                  <option>مصحح تلاوة</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 mr-2">كلمة المرور</label>
                <input 
                  type="password"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 text-right"
                  value={newTeacher.password}
                  onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <button 
                onClick={handleAddTeacher}
                className="w-full py-5 bg-emerald-900 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-800 transition-all"
              >
                تأكيد إضافة المعلم
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-full py-4 text-gray-400 font-bold hover:text-red-500 transition-colors"
              >
                إلغاء العملية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTeachers;
