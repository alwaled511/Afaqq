
import React, { useState, useEffect } from 'react';

interface ManagerTeachersProps {
  onEnterTeacherPortal?: (teacherName: string) => void;
}

const ManagerTeachers: React.FC<ManagerTeachersProps> = ({ onEnterTeacherPortal }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    specialty: 'حفظ ومراجعة',
    status: 'نشط',
    username: '',
    password: ''
  });

  useEffect(() => {
    const loadTeachers = () => {
      const saved = localStorage.getItem('afaq_teachers');
      if (saved) setTeachers(JSON.parse(saved));
    };
    loadTeachers();
    window.addEventListener('storage', loadTeachers);
    return () => window.removeEventListener('storage', loadTeachers);
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ fullName: '', specialty: 'حفظ ومراجعة', status: 'نشط', username: '', password: '' });
    setShowModal(true);
  };

  const openEditModal = (teacher: any) => {
    setEditingId(teacher.id);
    setFormData({ 
      fullName: teacher.name, 
      specialty: teacher.specialty, 
      status: teacher.status, 
      username: teacher.username || '', 
      password: teacher.password || '' 
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;

    if (editingId) {
      updated = teachers.map(t => 
        t.id === editingId 
          ? { ...t, name: formData.fullName, specialty: formData.specialty, status: formData.status, username: formData.username, password: formData.password } 
          : t
      );
    } else {
      const newTeacher = {
        id: 'T' + Date.now(),
        name: formData.fullName,
        specialty: formData.specialty,
        students: 0,
        status: formData.status,
        joinDate: new Date().toISOString().split('T')[0],
        username: formData.username,
        password: formData.password
      };
      updated = [newTeacher, ...teachers];
    }
    
    setTeachers(updated);
    localStorage.setItem('afaq_teachers', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setShowModal(false);
    alert(editingId ? 'تم تحديث بيانات المعلم بنجاح' : 'تمت إضافة المعلم بنجاح');
  };

  const handleDelete = (id: string) => {
    const teacherToDelete = teachers.find(t => t.id === id);
    if (!teacherToDelete) return;

    if (window.confirm(`⚠️ تحذير نهائي: هل أنت متأكد من حذف المعلم "${teacherToDelete.name}"؟\nسيتم حذف حسابه نهائياً وفك ارتباطه بكافة الحلقات.`)) {
      const updatedTeachers = teachers.filter(t => t.id !== id);
      setTeachers(updatedTeachers);
      localStorage.setItem('afaq_teachers', JSON.stringify(updatedTeachers));
      
      const savedCircles = JSON.parse(localStorage.getItem('afaq_circles') || '[]');
      const updatedCircles = savedCircles.map((circle: any) => 
        circle.teacher === teacherToDelete.name ? { ...circle, teacher: 'غير محدد' } : circle
      );
      localStorage.setItem('afaq_circles', JSON.stringify(updatedCircles));

      window.dispatchEvent(new Event('storage'));
      alert('تم حذف المعلم وتحديث بيانات الحلقات المرتبطة بنجاح.');
    }
  };

  const inputClass = "w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium text-right";
  const labelClass = "block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest text-right";

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 quran-font">إدارة شؤون المعلمين</h2>
          <p className="text-slate-500 text-sm font-medium">التحكم في حسابات المعلمين، صلاحيات الدخول، ومتابعة الأداء</p>
        </div>
        <button onClick={openAddModal} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl flex items-center gap-2 active:scale-95"><span>➕</span> إضافة معلم جديد</button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">بيانات المعلم</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">التخصص</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">حالة الحساب</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-left">أدوات التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {teachers.length > 0 ? teachers.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black shadow-inner">{t.name.charAt(0)}</div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-700">{t.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider">اسم المستخدم: {t.username}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-xs font-bold text-slate-500">{t.specialty}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black ${t.status === 'نشط' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{t.status}</span>
                </td>
                <td className="px-8 py-5 text-left">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => onEnterTeacherPortal?.(t.name)}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-black hover:bg-emerald-100 transition-all shadow-sm"
                    >
                      🚪 دخول البوابة
                    </button>
                    <button onClick={() => openEditModal(t)} className="px-4 py-2 bg-white border border-slate-200 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-50 transition-all shadow-sm">📝 تعديل</button>
                    <button onClick={() => handleDelete(t.id)} className="px-4 py-2 bg-white border border-red-100 text-red-600 rounded-xl text-[10px] font-black hover:bg-red-50 transition-all shadow-sm">🗑️ حذف</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-slate-400 font-bold">لا يوجد معلمين مسجلين حالياً</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-scaleIn overflow-hidden border border-white/20">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-800 quran-font">{editingId ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors font-bold text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>الاسم الكامل</label>
                  <input required value={formData.fullName} type="text" className={inputClass} placeholder="أدخل اسم المعلم الثلاثي" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass}>التخصص الأكاديمي</label>
                  <select className={inputClass} value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})}>
                    <option value="تجويد وقراءات">تجويد وقراءات</option>
                    <option value="حفظ ومراجعة">حفظ ومراجعة</option>
                    <option value="تفسير وعلوم قرآن">تفسير وعلوم قرآن</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass}>حالة الحساب</label>
                  <select className={inputClass} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="نشط">نشط</option>
                    <option value="إجازة">إجازة</option>
                    <option value="موقف">موقف</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-5 border-t border-slate-100 flex flex-col gap-4">
                <h4 className="text-[11px] font-black text-emerald-800 uppercase tracking-widest text-right">بيانات الدخول النظامية</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>اسم المستخدم</label>
                    <input required value={formData.username} type="text" className={inputClass} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>كلمة المرور</label>
                    <input required value={formData.password} type="text" className={inputClass} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-5 rounded-[24px] font-black shadow-xl hover:bg-emerald-700 transition-all active:scale-95">حفظ البيانات</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[24px] font-bold hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTeachers;
