import React, { useState, useEffect } from 'react';

const ManagerCircles = ({ selectedMosque }: { selectedMosque: string }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', username: '', password: '', phone: '', type: 'معلم حلقة' });

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    setTeachers(all.filter((t: any) => t.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const deleteTeacher = (id: number) => {
    if(window.confirm("هل أنت متأكد من حذف هذه الحلقة؟")) {
      const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const updated = all.filter((t: any) => t.id !== id);
      localStorage.setItem('afaq_teachers', JSON.stringify(updated));
      setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFB] p-8" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة الحلقات القرآنية</h2>
          <p className="text-gray-400 text-sm mt-1 font-bold">يمكنك إضافة وإدارة الحلقات التابعة للمسجد الحالي</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setShowTeacherModal(true); }}
          className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl"
        >
          + إنشاء حلقة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-xl">
                  <svg className="w-8 h-8 text-emerald-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 9V21H9.5V15H14.5V21H19.5V9L12 2Z" /></svg>
                </div>
                <div>
                  <h4 className="font-black text-emerald-900 text-lg">{t.name}</h4>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">تلقين وحفظ</span>
                </div>
              </div>
              
              {/* الأزرار التي طلبتها فقط */}
              <div className="flex gap-1">
                <button onClick={() => { setNewTeacher(t); setEditingId(t.id); setShowTeacherModal(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => deleteTeacher(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-4 mt-2">
              <p className="text-[10px] text-gray-400 font-bold mb-1">المعلم المسؤول:</p>
              <p className="text-emerald-800 font-black text-sm">{t.teacherName || t.name}</p>
            </div>
          </div>
        ))}
      </div>
      {/* ... كود المودال يبقى كما هو بدون تغيير ... */}
    </div>
  );
};
