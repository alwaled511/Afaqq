import React, { useState, useEffect } from 'react';

const quranSurahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبيائ", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
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
  // الحفاظ على الحقول الجديدة التي أضفناها سوياً
  const [newTeacher, setNewTeacher] = useState({ circleName: '', teacherName: '', username: '', password: '', phone: '' });

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    const allTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
    setTeachers(allTeachers.filter((t: any) => t.mosqueId === selectedMosque));
  }, [selectedMosque]);

  // --- دوال المعلمين ---
  const handleSaveTeacher = () => {
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
    setNewTeacher({ circleName: '', teacherName: '', username: '', password: '', phone: '' });
  };

  const handleDeleteTeacher = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الحلقة؟")) {
      const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const updated = all.filter((t: any) => t.id !== id);
      localStorage.setItem('afaq_teachers', JSON.stringify(updated));
      setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 font-sans" dir="rtl">
      
      <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm max-w-fit mx-auto border border-emerald-50">
        <button onClick={() => setActiveTab('students')} className={`px-10 py-3 rounded-xl font-black transition-all ${activeTab === 'students' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-400'}`}>شؤون الطلاب</button>
        <button onClick={() => setActiveTab('teachers')} className={`px-10 py-3 rounded-xl font-black transition-all ${activeTab === 'teachers' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-400'}`}>إدارة الحلقات</button>
      </div>

      {activeTab === 'teachers' ? (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
            <h2 className="text-xl font-black text-emerald-900">سجل المعلمين والحلقات</h2>
            <button onClick={() => { setEditingId(null); setNewTeacher({circleName:'', teacherName:'', username:'', password:'', phone:''}); setShowTeacherModal(true); }} className="bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold shadow-md hover:bg-emerald-800 transition-all">إضافة معلم جديد +</button>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-50 overflow-hidden">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-emerald-50 text-emerald-900 font-black text-sm">
                  <th className="p-5">اسم الحلقة</th>
                  <th className="p-5">اسم المعلم</th>
                  <th className="p-5">اسم المستخدم</th>
                  <th className="p-5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-bold text-emerald-950">{t.circleName}</td>
                    <td className="p-5 font-bold text-gray-700">{t.teacherName}</td>
                    <td className="p-5 font-mono text-xs text-gray-500">{t.username}</td>
                    <td className="p-5 flex justify-center gap-3">
                      <button onClick={() => { setNewTeacher(t); setEditingId(t.id); setShowTeacherModal(true); }} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-200">تعديل</button>
                      <button onClick={() => handleDeleteTeacher(t.id)} className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-200">حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in">
           <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
            <h2 className="text-xl font-black text-emerald-900">سجل الطلاب</h2>
            <button onClick={() => { setEditingId(null); setNewStudent(studentInitial); setShowStudentModal(true); }} className="bg-emerald-900 text-white px-8 py-3 rounded-2xl font-bold shadow-md hover:bg-emerald-950 transition-all">إضافة طالب جديد +</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-black text-emerald-900">{s.tripleName}</h4>
                  <p className="text-xs text-emerald-600 font-bold">الحلقة: {s.circle}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setNewStudent({...s, tripleName: s.fullName || s.tripleName}); setEditingId(s.id); setShowStudentModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs">تعديل</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مودال المعلم */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[3000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative">
            <h3 className="text-xl font-black text-emerald-900 text-center border-b pb-4">بيانات دخول المعلم</h3>
            <div className="space-y-4">
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none focus:border-emerald-500" placeholder="اسم الحلقة" value={newTeacher.circleName} onChange={e => setNewTeacher({...newTeacher, circleName: e.target.value})} />
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none focus:border-emerald-500" placeholder="اسم المعلم" value={newTeacher.teacherName} onChange={e => setNewTeacher({...newTeacher, teacherName: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="p-4 rounded-2xl bg-emerald-50/50 font-bold border border-emerald-100 outline-none" placeholder="اسم المستخدم" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} />
                <input className="p-4 rounded-2xl bg-emerald-50/50 font-bold border border-emerald-100 outline-none" type="password" placeholder="كلمة المرور" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} />
              </div>
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none text-sm" placeholder="رقم الجوال" value={newTeacher.phone} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSaveTeacher} className="flex-1 py-4 bg-emerald-800 text-white rounded-2xl font-black shadow-lg">حفظ البيانات</button>
              <button onClick={() => setShowTeacherModal(false)} className="px-6 py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال الطالب - كما هو تماماً بدون أي تغيير */}
      {showStudentModal && (
        <div className="fixed inset-0 z-[3000] bg-black/60 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="w-full max-w-5xl bg-white rounded-[3rem] p-8 space-y-8 my-8 shadow-2xl">
            <h3 className="text-2xl font-black text-emerald-900 border-b pb-4">تسجيل الطالب والخطة الدراسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h4 className="font-black text-emerald-800 border-r-4 border-emerald-500 pr-2">بيانات الطالب</h4>
                <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                <select className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})}>
                  <option value="">اختر الحلقة...</option>
                  {teachers.map(t => <option key={t.id} value={t.circleName}>{t.circleName}</option>)}
                </select>
                <div className="grid grid-cols-3 gap-2">
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="المرحلة" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})} />
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="جوال الطالب" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs border" placeholder="جوال ولي الأمر" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-emerald-800 border-r-4 border-emerald-500 pr-2">خطة الحفظ والهدف</h4>
                <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100 space-y-4 shadow-inner">
                  <div className="flex justify-between font-black text-emerald-900 text-sm"><span>تفعيل الحفظ</span><input type="checkbox" checked={newStudent.hifzEnabled} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <select className="p-3 rounded-xl bg-white font-bold border text-sm" value={newStudent.hifzFromSurah}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <input type="number" className="p-3 rounded-xl bg-white font-bold border-2 border-red-200" placeholder="آية" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} />
                    <input type="number" className="p-3 rounded-xl bg-white font-bold border-2 border-blue-200" placeholder="أسطر" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} />
                    <select className="p-3 rounded-xl bg-white font-bold border text-sm" value={newStudent.hifzDirection}><option>تصاعدي</option><option>تنازلي</option></select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100 space-y-2 text-center">
                    <span className="font-black text-blue-900 text-[10px]">التثبيت</span>
                    <select className="w-full p-1 rounded-lg text-[10px] bg-white border" value={newStudent.tathbitStartSurah}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <div className="flex gap-1"><input className="w-1/2 p-1 rounded bg-white border text-[10px]" placeholder="آية" value={newStudent.tathbitVerse} /><input className="w-1/2 p-1 rounded bg-white border text-[10px]" placeholder="سطر" value={newStudent.tathbitLines} /></div>
                  </div>
                  <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100 space-y-2 text-center">
                    <span className="font-black text-amber-900 text-[10px]">المراجعة</span>
                    <select className="w-full p-1 rounded-lg text-[10px] bg-white border" value={newStudent.murajaahFromSurah}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <div className="flex gap-1"><input className="w-1/2 p-1 rounded bg-white border text-[10px]" placeholder="آية" value={newStudent.murajaahVerse} /><input className="w-1/2 p-1 rounded bg-white border text-[10px]" placeholder="سطر" value={newStudent.murajaahLinesTarget} /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowStudentModal(false)} className="flex-1 py-5 bg-emerald-900 text-white rounded-[2rem] font-black text-xl shadow-xl">رجوع</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
