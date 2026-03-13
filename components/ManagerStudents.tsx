import React, { useState, useEffect } from 'react';

const quranSurahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبيائ", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

const ManagerDashboard = ({ selectedMosque }: { selectedMosque: string }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]); // هؤلاء هم المعلمون المسجلون
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
  
  // حالة المعلم الجديد (لأغراض قسم إدارة المعلمين)
  const [newTeacher, setNewTeacher] = useState({ name: '', username: '', password: '', phone: '' });

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    const allTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
    setTeachers(allTeachers.filter((t: any) => t.mosqueId === selectedMosque));
  }, [selectedMosque]);

  // --- دوال المعلمين وحفظ الحلقات ---
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
    setNewTeacher({ name: '', username: '', password: '', phone: '' });
  };

  const handleDeleteTeacher = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الحلقة/المعلم؟")) {
      const all = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const updated = all.filter((t: any) => t.id !== id);
      localStorage.setItem('afaq_teachers', JSON.stringify(updated));
      setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 font-sans" dir="rtl">
      
      {/* التبديل بين الأقسام */}
      <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm max-w-fit mx-auto border border-emerald-50">
        <button onClick={() => setActiveTab('students')} className={`px-10 py-3 rounded-xl font-black transition-all ${activeTab === 'students' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-400'}`}>شؤون الطلاب</button>
        <button onClick={() => setActiveTab('teachers')} className={`px-10 py-3 rounded-xl font-black transition-all ${activeTab === 'teachers' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-400'}`}>إدارة الحلقات</button>
      </div>

      {activeTab === 'teachers' ? (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
            <h2 className="text-xl font-black text-emerald-900">سجل الحلقات</h2>
            <button onClick={() => { setEditingId(null); setNewTeacher({name:'', username:'', password:'', phone:''}); setShowTeacherModal(true); }} className="bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold shadow-md hover:bg-emerald-800 transition-all">إنشاء حلقة جديدة +</button>
          </div>

          {/* عرض الحلقات كبطاقات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative flex flex-col justify-between min-h-[180px]">
                <div className="absolute top-6 left-6 flex gap-2 z-10">
                  <button onClick={() => { setNewTeacher(t); setEditingId(t.id); setShowTeacherModal(true); }} className="p-2 bg-gray-50 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  <button onClick={() => handleDeleteTeacher(t.id)} className="p-2 bg-gray-50 text-red-500 hover:bg-red-50 rounded-xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-2xl flex-shrink-0"><svg className="w-8 h-8 text-emerald-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 9V21H9.5V15H14.5V21H19.5V9L12 2Z" /></svg></div>
                  <div className="pt-1">
                    <h4 className="font-black text-gray-900 text-lg mb-2">{t.name || "اسم الحلقة"}</h4>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">تلقين وحفظ</span>
                  </div>
                </div>
                <div className="bg-gray-50/70 rounded-2xl p-4 mt-auto text-center border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold mb-1">المعلم المسؤول:</p>
                  <p className="text-emerald-800 font-black text-sm">{t.teacherName || "لم يتم التعيين"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* قسم الطلاب */
        <div className="space-y-6 animate-in fade-in">
           <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
            <h2 className="text-xl font-black text-emerald-900">سجل الطلاب</h2>
            <button onClick={() => { setEditingId(null); setNewStudent(studentInitial); setShowStudentModal(true); }} className="bg-emerald-900 text-white px-8 py-3 rounded-2xl font-bold shadow-md hover:bg-emerald-950 transition-all">إضافة طالب جديد +</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm flex justify-between items-center">
                <div><h4 className="font-black text-emerald-900">{s.fullName}</h4><p className="text-xs text-emerald-600 font-bold">الحلقة: {s.circle}</p></div>
                <div className="flex gap-2">
                  <button onClick={() => { setNewStudent({...s, tripleName: s.fullName}); setEditingId(s.id); setShowStudentModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs">تعديل</button>
                  <button onClick={() => { if(window.confirm("حذف الطالب؟")) { /* حذف الطالب */ } }} className="p-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مودال إضافة حلقة للمسجد (تم تحديثه ليجلب أسماء المعلمين) */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[3000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative">
            <h3 className="text-xl font-black text-emerald-900 text-center border-b pb-4">إضافة حلقة للمسجد</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 pr-2">اسم الحلقة</label>
                <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none focus:border-emerald-500 transition-all" placeholder="مثال: حلقة الإخلاص" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              </div>

              {/* التحديث الجديد هنا: اختيار المعلم من المعلمين المسجلين */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 pr-2">اسم المعلم المسؤول</label>
                <select 
                  className="w-full p-4 rounded-2xl bg-gray-50 font-bold border outline-none focus:border-emerald-500 transition-all"
                  value={newTeacher.name} // يمكنك تخزين اسم المعلم أو معرفه هنا
                  onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                >
                  <option value="">اختر المعلم من القائمة...</option>
                  {/* هنا يتم جلب الأسماء من مصفوفة teachers التي قمت بتسجيلها في إدارة المعلمين */}
                  {teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-400 pr-2">اسم المستخدم</label>
                   <input className="p-4 rounded-2xl bg-emerald-50/50 font-bold border border-emerald-100 outline-none w-full" placeholder="User123" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-400 pr-2">كلمة المرور</label>
                   <input className="p-4 rounded-2xl bg-emerald-50/50 font-bold border border-emerald-100 outline-none w-full" type="password" placeholder="••••••••" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button onClick={handleSaveTeacher} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-900 transition-all">تأكيد الإنشاء</button>
              <button onClick={() => setShowTeacherModal(false)} className="w-full py-2 text-gray-400 font-bold text-sm">إلغاء العملية</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال الطالب (بدون تغيير) */}
      {showStudentModal && (
        <div className="fixed inset-0 z-[3000] bg-black/60 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="w-full max-w-5xl bg-white rounded-[3rem] p-8 space-y-8 my-8 shadow-2xl">
            <h3 className="text-2xl font-black text-emerald-900 border-b pb-4">تسجيل الطالب والخطة الدراسية</h3>
            {/* ... بقية كود مودال الطالب ... */}
            <div className="flex gap-4 pt-4">
              <button onClick={() => { /* حفظ الطالب */ }} className="flex-1 py-5 bg-emerald-900 text-white rounded-[2rem] font-black text-xl shadow-xl">حفظ الطالب</button>
              <button onClick={() => setShowStudentModal(false)} className="px-10 py-5 bg-gray-100 text-gray-400 rounded-[2rem] font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
