import React, { useState, useEffect } from 'react';

const quranSurahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

const ManagerDashboard = ({ selectedMosque }: { selectedMosque: string }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'circles'>('circles');
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const studentInitial = { 
    tripleName: '', circle: '', studyLevel: '', studentPhone: '', parentPhone: '',
    hifzEnabled: true, hifzFromSurah: 'النبأ', hifzVerse: '1', hifzLinesTarget: '7', hifzDirection: 'تصاعدي',
    tathbitEnabled: true, tathbitStartSurah: 'الناس', tathbitVerse: '1', tathbitLines: '15',
    murajaahEnabled: true, murajaahFromSurah: 'الفاتحة', murajaahVerse: '1', murajaahLinesTarget: '15'
  };

  const [newStudent, setNewStudent] = useState(studentInitial);
  const [newTeacher, setNewTeacher] = useState({ name: '', username: '', password: '', phone: '', type: 'معلم حلقة' });

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    const allTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
    setTeachers(allTeachers.filter((t: any) => t.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const saveTeacher = () => {
    const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    let updated;
    if (editingId) {
      updated = all.map((t: any) => t.id === editingId ? { ...newTeacher, id: t.id, mosqueId: selectedMosque } : t);
    } else {
      updated = [...all, { ...newTeacher, id: Date.now(), mosqueId: selectedMosque }];
    }
    localStorage.setItem('afaq_teachers', JSON.stringify(updated));
    setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    setShowTeacherModal(false);
    setEditingId(null);
  };

  const deleteTeacher = (id: number) => {
    if(window.confirm("هل أنت متأكد من حذف هذه الحلقة؟")) {
      const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const updated = all.filter((t: any) => t.id !== id);
      localStorage.setItem('afaq_teachers', JSON.stringify(updated));
      setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    }
  };

  const saveStudent = () => {
    const all = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    let updated;
    if (editingId) {
      updated = all.map((s: any) => s.id === editingId ? { ...newStudent, id: s.id, mosqueId: selectedMosque, fullName: newStudent.tripleName } : s);
    } else {
      updated = [...all, { ...newStudent, id: Date.now(), mosqueId: selectedMosque, fullName: newStudent.tripleName }];
    }
    localStorage.setItem('afaq_students', JSON.stringify(updated));
    setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
    setShowStudentModal(false);
    setEditingId(null);
    setNewStudent(studentInitial);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFB] p-8" dir="rtl">
      {/* القائمة الجانبية أو التبديل العلوي حسب نظامك */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('circles')} className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'circles' ? 'bg-emerald-900 text-white' : 'bg-white text-gray-400'}`}>إدارة الحلقات</button>
        <button onClick={() => setActiveTab('students')} className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'students' ? 'bg-emerald-900 text-white' : 'bg-white text-gray-400'}`}>شؤون الطلاب</button>
      </div>

      {activeTab === 'circles' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-emerald-900">إدارة الحلقات القرآنية</h2>
              <p className="text-gray-400 text-sm mt-1 font-bold">يمكنك إضافة وإدارة الحلقات التابعة للمسجد الحالي</p>
            </div>
            <button onClick={() => { setEditingId(null); setNewTeacher({name:'', username:'', password:'', phone:'', type:'معلم حلقة'}); setShowTeacherModal(true); }} className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl">+ إنشاء حلقة جديدة</button>
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
                  {/* أزرار الحذف والتعديل المضافة */}
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
                  <p className="text-emerald-800 font-black text-sm">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* شؤون الطلاب (كما هي في صورك) */
        <div className="space-y-6">
           <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-emerald-900">سجل الطلاب</h2>
            <button onClick={() => { setEditingId(null); setNewStudent(studentInitial); setShowStudentModal(true); }} className="bg-emerald-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">إضافة طالب +</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-black text-emerald-900">{s.fullName}</h4>
                  <p className="text-xs text-emerald-600 font-bold">الحلقة: {s.circle}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setNewStudent({...s, tripleName: s.fullName}); setEditingId(s.id); setShowStudentModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs">تعديل</button>
                  <button onClick={() => { if(window.confirm("حذف الطالب؟")) { /* حذف طالب */ } }} className="p-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مودال المعلم (بيانات دخول المعلم - صورتك 3 و 4) */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[5000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-xl font-black text-emerald-900 text-center mb-8">بيانات دخول المعلم</h3>
            <div className="space-y-5">
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border-none outline-none" placeholder="اسم المعلم الثلاثي" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="p-4 rounded-2xl bg-emerald-50/30 font-bold border-none outline-none" placeholder="اسم المستخدم" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} />
                <input className="p-4 rounded-2xl bg-emerald-50/30 font-bold border-none outline-none" type="password" placeholder="كلمة المرور" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} />
              </div>
            </div>
            <button onClick={saveTeacher} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-black mt-8">حفظ المعلم</button>
            <button onClick={() => setShowTeacherModal(false)} className="w-full py-3 text-gray-400 font-bold">إلغاء</button>
          </div>
        </div>
      )}

      {/* مودال الطالب (خطة الحفظ - صورتك 1 و 2) */}
      {showStudentModal && (
        <div className="fixed inset-0 z-[5000] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-[3rem] p-8 space-y-8 my-8 shadow-2xl">
            <h3 className="text-2xl font-black text-emerald-900 border-b pb-4">تسجيل الطالب والخطة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h4 className="font-black text-emerald-800 border-r-4 border-emerald-500 pr-2">بيانات الطالب</h4>
                <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                <select className="w-full p-4 rounded-2xl bg-gray-50 font-bold border" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})}>
                  <option value="">اختر الحلقة...</option>
                  {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <div className="grid grid-cols-3 gap-2">
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="المرحلة" value={newStudent.studyLevel} />
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="جوال الطالب" value={newStudent.studentPhone} />
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="جوال ولي الأمر" value={newStudent.parentPhone} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-emerald-800 border-r-4 border-emerald-500 pr-2">الخطة الدراسية</h4>
                <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100 space-y-4 shadow-inner">
                  <div className="flex justify-between font-black text-emerald-900 text-sm"><span>خطة الحفظ</span><input type="checkbox" checked={newStudent.hifzEnabled} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <select className="p-3 rounded-xl bg-white font-bold border" value={newStudent.hifzFromSurah}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <input type="number" className="p-3 rounded-xl bg-white font-bold border-2 border-red-200" placeholder="آية" value={newStudent.hifzVerse} />
                    <input type="number" className="p-3 rounded-xl bg-white font-bold border-2 border-blue-200" placeholder="أسطر" value={newStudent.hifzLinesTarget} />
                    <select className="p-3 rounded-xl bg-white font-bold border" value={newStudent.hifzDirection}><option>تصاعدي</option><option>تنازلي</option></select>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={saveStudent} className="w-full py-5 bg-emerald-900 text-white rounded-[2rem] font-black text-xl shadow-xl">اعتماد وحفظ البيانات</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
