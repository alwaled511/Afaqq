import React, { useState, useEffect } from 'react';

const quranSurahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

const ManagerDashboard = ({ selectedMosque }: { selectedMosque: string }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
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

  // --- دوال إدارة المعلمين (الحلقات) ---
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
    setNewTeacher({ name: '', username: '', password: '', phone: '', type: 'معلم حلقة' });
  };

  const deleteTeacher = (id: number) => {
    if(window.confirm("هل أنت متأكد من حذف هذا المعلم (الحلقة)؟ سيؤثر ذلك على ارتباط الطلاب به.")) {
      const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const updated = all.filter((t: any) => t.id !== id);
      localStorage.setItem('afaq_teachers', JSON.stringify(updated));
      setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    }
  };

  // --- دوال شؤون الطلاب ---
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

  const deleteStudent = (id: number) => {
    if(window.confirm("هل أنت متأكد من حذف بيانات هذا الطالب نهائياً؟")) {
      const all = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const updated = all.filter((s: any) => s.id !== id);
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* التبويبات الرئيسية */}
      <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm max-w-fit mx-auto border border-emerald-50">
        <button onClick={() => setActiveTab('students')} className={`px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'students' ? 'bg-emerald-900 text-white shadow-md' : 'text-gray-400'}`}>شؤون الطلاب</button>
        <button onClick={() => setActiveTab('teachers')} className={`px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'teachers' ? 'bg-emerald-900 text-white shadow-md' : 'text-gray-400'}`}>إدارة المعلمين</button>
      </div>

      {activeTab === 'students' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-emerald-900">سجل الطلاب</h2>
            <button onClick={() => { setEditingId(null); setNewStudent(studentInitial); setShowStudentModal(true); }} className="bg-emerald-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">إضافة طالب</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-emerald-900 text-lg">{s.fullName}</h4>
                    <p className="text-sm text-emerald-600 font-bold">حلقة: {s.circle || 'لم يحدد'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setNewStudent({...s, tripleName: s.fullName}); setEditingId(s.id); setShowStudentModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => deleteStudent(s.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-emerald-900">سجل المعلمين والحلقات</h2>
            <button onClick={() => { setEditingId(null); setNewTeacher({name:'', username:'', password:'', phone:'', type:'معلم حلقة'}); setShowTeacherModal(true); }} className="bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">إضافة معلم/حلقة</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map(t => (
              <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-emerald-900 text-lg">{t.name}</h4>
                    <p className="text-sm text-gray-400 font-bold">المستخدم: {t.username}</p>
                    <p className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md mt-1 inline-block">{t.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setNewTeacher(t); setEditingId(t.id); setShowTeacherModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => deleteTeacher(t.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مودال المعلم المحدث (من الصورة) */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-black text-emerald-900 text-center border-b pb-4">بيانات دخول المعلم</h3>
            <div className="space-y-4">
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none focus:border-emerald-500" placeholder="اسم المعلم الثلاثي" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="p-4 rounded-2xl bg-emerald-50/50 font-bold border border-emerald-100 outline-none" placeholder="اسم المستخدم" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} />
                <input className="p-4 rounded-2xl bg-emerald-50/50 font-bold border border-emerald-100 outline-none" type="password" placeholder="كلمة المرور" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} />
              </div>
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none" placeholder="رقم الجوال" value={newTeacher.phone} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} />
            </div>
            <div className="flex gap-3">
              <button onClick={saveTeacher} className="flex-1 py-4 bg-emerald-800 text-white rounded-2xl font-black shadow-lg">حفظ البيانات</button>
              <button onClick={() => setShowTeacherModal(false)} className="px-6 py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال الطالب (المعلومات الشخصية + الخطة الدراسية) */}
      {showStudentModal && (
        <div className="fixed inset-0 z-[3000] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-[3rem] p-8 space-y-8 my-8">
            <h3 className="text-2xl font-black text-emerald-900 border-b pb-4">تسجيل الطالب والخطة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* بيانات الطالب */}
              <div className="space-y-4">
                <h4 className="font-black text-emerald-800 border-r-4 border-emerald-500 pr-2">بيانات الطالب</h4>
                <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                <select className="w-full p-4 rounded-2xl bg-gray-50 font-bold border" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})}>
                  <option value="">اختر الحلقة...</option>
                  {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <div className="grid grid-cols-3 gap-2">
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="المرحلة" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})} />
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="جوال الطالب" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="جوال ولي الأمر" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                </div>
              </div>
              {/* الخطة الدراسية */}
              <div className="space-y-4">
                <h4 className="font-black text-emerald-800 border-r-4 border-emerald-500 pr-2">الخطة الدراسية</h4>
                <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100 space-y-4">
                  <div className="flex justify-between font-black text-emerald-900 text-sm"><span>خطة الحفظ</span><input type="checkbox" checked={newStudent.hifzEnabled} onChange={e => setNewStudent({...newStudent, hifzEnabled: e.target.checked})} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <select className="p-3 rounded-xl bg-white font-bold border" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <input type="number" className="p-3 rounded-xl bg-white font-bold border-2 border-red-200" placeholder="رقم الآية" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} />
                    <input type="number" className="p-3 rounded-xl bg-white font-bold border-2 border-blue-200" placeholder="عدد الأسطر" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} />
                    <select className="p-3 rounded-xl bg-white font-bold border" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select>
                  </div>
                </div>
                {/* التثبيت والمراجعة */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100 space-y-2 text-center"><span className="font-black text-blue-900 text-[10px]">التثبيت</span>
                    <select className="w-full p-1 rounded-lg text-[10px] bg-white border" value={newStudent.tathbitStartSurah} onChange={e => setNewStudent({...newStudent, tathbitStartSurah: e.target.value})}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <div className="flex gap-1"><input className="w-1/2 p-1 rounded bg-white border text-[10px]" placeholder="آية" value={newStudent.tathbitVerse} onChange={e => setNewStudent({...newStudent, tathbitVerse: e.target.value})} /><input className="w-1/2 p-1 rounded bg-white border text-[10px]" placeholder="سطر" value={newStudent.tathbitLines} onChange={e => setNewStudent({...newStudent, tathbitLines: e.target.value})} /></div>
                  </div>
                  <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100 space-y-2 text-center"><span className="font-black text-amber-900 text-[10px]">المراجعة</span>
                    <select className="w-full p-1 rounded-lg text-[10px] bg-white border" value={newStudent.murajaahFromSurah} onChange={e => setNewStudent({...newStudent, murajaahFromSurah: e.target.value})}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <div className="flex gap-1"><input className="w-1/2 p-1 rounded bg-white border text-[10px]" placeholder="آية" value={newStudent.murajaahVerse} onChange={e => setNewStudent({...newStudent, murajaahVerse: e.target.value})} /><input className="w-1/2 p-1 rounded bg-white border text-[10px]" placeholder="سطر" value={newStudent.murajaahLinesTarget} onChange={e => setNewStudent({...newStudent, murajaahLinesTarget: e.target.value})} /></div>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={saveStudent} className="w-full py-5 bg-emerald-900 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-emerald-800 transition-colors">اعتماد وحفظ البيانات</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
