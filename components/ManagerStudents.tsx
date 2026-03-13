import React, { useState, useEffect } from 'react';

// --- المكون الفرعي لبطاقة الحلقة (إدارة الحلقات) ---
const CircleCard = ({ circle, onEdit, onDelete }: { circle: any, onEdit: () => void, onDelete: () => void }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm relative group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-50 p-2 rounded-xl">
          <svg className="w-8 h-8 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 9V21H9.5V15H14.5V21H19.5V9L12 2Z" />
          </svg>
        </div>
        <div>
          <h4 className="font-black text-emerald-900 text-lg">{circle.name || "اسم الحلقة"}</h4>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">تلقين وحفظ</span>
        </div>
      </div>
      
      {/* أزرار التحكم المضافة داخل البطاقة */}
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors" title="تعديل">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button onClick={onDelete} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="حذف">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>

    <div className="bg-gray-50/50 rounded-2xl p-4 mt-2">
      <p className="text-[10px] text-gray-400 font-bold mb-1">المعلم المسؤول:</p>
      <p className="text-emerald-800 font-black text-sm">{circle.teacherName || "لم يتم التعيين"}</p>
    </div>
  </div>
);

const ManagerDashboard = ({ selectedMosque }: { selectedMosque: string }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('teachers');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', username: '', password: '', phone: '', type: 'معلم حلقة' });

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    setTeachers(all.filter((t: any) => t.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const saveTeacher = () => {
    const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    let updated;
    const teacherData = { ...newTeacher, id: editingId || Date.now(), mosqueId: selectedMosque, teacherName: newTeacher.name };
    
    if (editingId) {
      updated = all.map((t: any) => t.id === editingId ? teacherData : t);
    } else {
      updated = [...all, teacherData];
    }
    
    localStorage.setItem('afaq_teachers', JSON.stringify(updated));
    setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    setShowTeacherModal(false);
    setEditingId(null);
  };

  const deleteTeacher = (id: number) => {
    if(window.confirm("هل أنت متأكد من حذف هذه الحلقة نهائياً؟")) {
      const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const updated = all.filter((t: any) => t.id !== id);
      localStorage.setItem('afaq_teachers', JSON.stringify(updated));
      setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFB] p-8" dir="rtl">
      {/* الرأس */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة الحلقات القرآنية</h2>
          <p className="text-gray-400 text-sm mt-1 font-bold">يمكنك إضافة وإدارة الحلقات التابعة للمسجد الحالي</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setNewTeacher({name:'', username:'', password:'', phone:'', type:'معلم حلقة'}); setShowTeacherModal(true); }}
          className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-900/20 hover:scale-105 transition-transform flex items-center gap-2"
        >
          <span>+ إنشاء حلقة جديدة</span>
        </button>
      </div>

      {/* شبكة الحلقات (نفس تصميم الصورة الأخيرة) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map(t => (
          <CircleCard 
            key={t.id} 
            circle={t} 
            onEdit={() => { setNewTeacher(t); setEditingId(t.id); setShowTeacherModal(true); }}
            onDelete={() => deleteTeacher(t.id)} 
          />
        ))}
      </div>

      {/* مودال إضافة/تعديل حلقة (بيانات دخول المعلم) */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[5000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-emerald-900 text-center mb-8">بيانات دخول المعلم</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 mr-2">اسم المعلم الثلاثي</label>
                <input className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 ring-emerald-500/20 font-bold" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 mr-2">اسم المستخدم</label>
                  <input className="w-full p-4 rounded-2xl bg-emerald-50/30 border-none outline-none font-bold" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 mr-2">كلمة المرور</label>
                  <input className="w-full p-4 rounded-2xl bg-emerald-50/30 border-none outline-none font-bold" type="password" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <button onClick={saveTeacher} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-black shadow-lg shadow-emerald-900/30 transition-all active:scale-95">حفظ المعلم</button>
              <button onClick={() => setShowTeacherModal(false)} className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">إلغاء العملية</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
