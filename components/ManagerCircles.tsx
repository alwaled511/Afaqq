
import React, { useState, useEffect } from 'react';

const ManagerCircles: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [circles, setCircles] = useState<any[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    time: 'بعد العصر',
    capacity: '20',
    days: 'الأحد - الخميس'
  });

  const timesList = ['بعد الفجر', 'بعد الظهر', 'بعد العصر', 'بعد المغرب', 'بعد العشاء'];

  useEffect(() => {
    const loadData = () => {
      const savedCircles = localStorage.getItem('afaq_circles');
      const savedTeachers = localStorage.getItem('afaq_teachers');
      
      if (savedCircles) setCircles(JSON.parse(savedCircles));
      if (savedTeachers) setAvailableTeachers(JSON.parse(savedTeachers));
    };
    
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', teacher: '', time: 'بعد العصر', capacity: '20', days: 'الأحد - الخميس' });
    setShowModal(true);
  };

  const openEditModal = (circle: any) => {
    setEditingId(circle.id);
    setFormData({
      name: circle.name,
      teacher: circle.teacher,
      time: circle.time,
      capacity: circle.max.toString(),
      days: circle.days || 'الأحد - الخميس'
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;

    if (editingId) {
      updated = circles.map(c => 
        c.id === editingId 
          ? { ...c, name: formData.name, teacher: formData.teacher, time: formData.time, max: parseInt(formData.capacity), days: formData.days } 
          : c
      );
    } else {
      const newCircle = {
        id: 'C' + Math.floor(Math.random() * 1000),
        name: formData.name,
        teacher: formData.teacher,
        time: formData.time,
        days: formData.days,
        students: 0,
        max: parseInt(formData.capacity) || 20
      };
      updated = [newCircle, ...circles];
    }
    
    setCircles(updated);
    localStorage.setItem('afaq_circles', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const circleToDelete = circles.find(c => c.id === id);
    if (!circleToDelete) return;

    if (window.confirm(`⚠️ هل أنت متأكد من حذف "${circleToDelete.name}"؟ سيتم إزالة كافة البيانات المرتبطة بها.`)) {
      const updatedCircles = circles.filter(c => c.id !== id);
      setCircles(updatedCircles);
      localStorage.setItem('afaq_circles', JSON.stringify(updatedCircles));
      
      const savedStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const updatedStudents = savedStudents.map((s: any) => 
        s.circle === circleToDelete.name ? { ...s, circle: 'غير محدد' } : s
      );
      localStorage.setItem('afaq_students', JSON.stringify(updatedStudents));
      
      window.dispatchEvent(new Event('storage'));
      alert('تم حذف الحلقة بنجاح.');
    }
  };

  const inputClass = "w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium text-right";
  const labelClass = "block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest text-right";

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 quran-font">إدارة الحلقات القرآنية</h2>
          <p className="text-slate-500 text-sm font-medium">تحكم في توزيع الحلقات، المعلمين، والأوقات</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
        >
          <span>➕</span> إضافة حلقة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circles.length > 0 ? circles.map((circle) => (
          <div key={circle.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:border-emerald-200 transition-all group flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-4 left-4 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(circle)} className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm">📝</button>
              <button onClick={() => handleDelete(circle.id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm">🗑️</button>
            </div>
            
            <div className="mb-6">
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase mb-3 inline-block">{circle.time}</span>
              <h3 className="text-2xl font-black text-slate-800 mb-1 leading-tight">{circle.name}</h3>
              <p className="text-xs text-slate-400 font-bold tracking-tight">بإشراف: {circle.teacher || 'غير محدد'}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
               <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span>نسبة الإشغال</span>
                 <span className="text-slate-700">{circle.students} / {circle.max} طالب</span>
               </div>
               <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                 <div 
                   className="h-full bg-emerald-500 rounded-full transition-all duration-700 shadow-sm" 
                   style={{ width: `${Math.min(100, (circle.students/circle.max)*100)}%` }}
                 ></div>
               </div>
               <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg w-fit">
                 <span>🗓️</span> {circle.days}
               </p>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200 text-slate-400">
            <div className="text-6xl mb-6 opacity-30">🕌</div>
            <p className="text-xl font-black text-slate-800">لا توجد حلقات نشطة</p>
            <p className="text-sm font-medium mt-2">ابدأ بإنشاء أول حلقة لتحفيظ القرآن في المنصة</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-scaleIn overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-800 quran-font">{editingId ? 'تعديل الحلقة' : 'إنشاء حلقة جديدة'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className={labelClass}>اسم الحلقة</label>
                <input required value={formData.name} type="text" className={inputClass} placeholder="مثل: حلقة الريان" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>المعلم المشرف</label>
                <select required className={inputClass} value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})}>
                  <option value="">اختر معلماً...</option>
                  {availableTeachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                {availableTeachers.length === 0 && <p className="text-[10px] text-amber-600 font-black mt-2">⚠️ لا يوجد معلمين مسجلين، يرجى إضافة معلم أولاً</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>وقت الحلقة</label>
                  <select className={inputClass} value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                    {timesList.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>السعة القصوى</label>
                  <input value={formData.capacity} type="number" className={inputClass} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClass}>أيام العمل</label>
                <input value={formData.days} type="text" className={inputClass} placeholder="الأحد - الخميس" onChange={(e) => setFormData({...formData, days: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-5 rounded-[24px] font-black shadow-xl hover:bg-emerald-700 transition-all active:scale-95">حفظ التغييرات</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[24px] font-bold hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerCircles;
