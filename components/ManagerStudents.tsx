import React, { useState, useEffect } from 'react';

const quranSurahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingTeacherId, setEditingTeacherId] = useState<number | null>(null);
  const [isAddingNewCircle, setIsAddingNewCircle] = useState(false);

  const initialState = { 
    tripleName: '', circle: '', studyLevel: '', studentPhone: '', parentPhone: '',
    hifzEnabled: true, hifzFromSurah: 'النبأ', hifzVerse: '1', hifzLinesTarget: '7', hifzDirection: 'تصاعدي',
    tathbitEnabled: false, tathbitStartSurah: 'الناس', tathbitVerse: '1',
    murajaahEnabled: false, murajaahLinesTarget: '15', murajaahFromSurah: 'الفاتحة',
    circleTeacher: '' 
  };

  const [newStudent, setNewStudent] = useState(initialState);
  const [newTeacher, setNewTeacher] = useState({ name: '', phone: '', username: '', password: '' });

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    const allTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
    setTeachers(allTeachers.filter((t: any) => t.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const existingCircles = Array.from(new Set(students.map(s => s.circle).filter(Boolean)));

  const handleSaveStudent = () => {
    if (newStudent.tripleName) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      let updated;
      if (editingStudentId) {
        updated = allStudents.map((s: any) => s.id === editingStudentId ? { ...newStudent, id: s.id, mosqueId: selectedMosque, fullName: newStudent.tripleName } : s);
      } else {
        updated = [...allStudents, { ...newStudent, id: Date.now(), mosqueId: selectedMosque, fullName: newStudent.tripleName }];
      }
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false);
      setEditingStudentId(null);
      setNewStudent(initialState);
      setIsAddingNewCircle(false);
    }
  };

  const handleSaveTeacher = () => {
    if (newTeacher.name && newTeacher.username && newTeacher.password) {
      const allTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      let updated;
      if (editingTeacherId) {
        updated = allTeachers.map((t: any) => t.id === editingTeacherId ? { ...newTeacher, id: t.id, mosqueId: selectedMosque } : t);
      } else {
        updated = [...allTeachers, { ...newTeacher, id: Date.now(), mosqueId: selectedMosque }];
      }
      localStorage.setItem('afaq_teachers', JSON.stringify(updated));
      setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
      setShowTeacherModal(false);
      setEditingTeacherId(null);
      setNewTeacher({ name: '', phone: '', username: '', password: '' });
    } else {
      alert("يرجى إكمال بيانات المعلم (الاسم، اسم المستخدم، كلمة المرور)");
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-10 text-right font-sans" dir="rtl">
      
      {/* إدارة الطلاب */}
      <section className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
          <h2 className="text-2xl font-black text-emerald-900">إدارة الطلاب</h2>
          <button onClick={() => { setEditingStudentId(null); setNewStudent(initialState); setShowAddModal(true); }} className="bg-emerald-900 text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-all active:scale-95">+ إضافة طالب</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {students.map((student) => (
            <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm">
              <h3 className="font-black text-emerald-900 text-sm truncate">{student.fullName}</h3>
              <p className="text-[10px] text-gray-400 font-bold">{student.circle || 'بدون حلقة'}</p>
              <div className="flex gap-2 border-t mt-3 pt-3">
                <button onClick={() => { setNewStudent({...student, tripleName: student.fullName}); setEditingStudentId(student.id); setShowAddModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black">تعديل</button>
                <button onClick={() => { if(window.confirm("حذف؟")) { const updated = students.filter(s => s.id !== student.id); localStorage.setItem('afaq_students', JSON.stringify(updated)); setStudents(updated); } }} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* إدارة المعلمين */}
      <section className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
          <h2 className="text-2xl font-black text-emerald-900">إدارة المعلمين</h2>
          <button onClick={() => { setEditingTeacherId(null); setNewTeacher({ name: '', phone: '', username: '', password: '' }); setShowTeacherModal(true); }} className="bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-all active:scale-95">+ إضافة معلم</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm">
              <h3 className="font-black text-emerald-900 text-sm truncate">{teacher.name}</h3>
              <p className="text-[10px] text-gray-400 font-bold">المستخدم: {teacher.username}</p>
              <div className="flex gap-2 border-t mt-3 pt-3">
                <button onClick={() => { setNewTeacher(teacher); setEditingTeacherId(teacher.id); setShowTeacherModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black">تعديل</button>
                <button onClick={() => { if(window.confirm("حذف المعلم؟")) { const updated = teachers.filter(t => t.id !== teacher.id); localStorage.setItem('afaq_teachers', JSON.stringify(updated)); setTeachers(updated); } }} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* مودال المعلم (مع اسم المستخدم وكلمة المرور) */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[40px] bg-white p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-black text-emerald-900 border-b pb-2">بيانات دخول المعلم</h3>
            <div className="space-y-4">
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none border" placeholder="اسم المعلم (الثلاثي)" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none border" placeholder="رقم الجوال" value={newTeacher.phone} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full p-4 rounded-2xl bg-emerald-50 font-bold outline-none border border-emerald-100" placeholder="اسم المستخدم" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} />
                <input className="w-full p-4 rounded-2xl bg-emerald-50 font-bold outline-none border border-emerald-100" type="password" placeholder="كلمة المرور" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveTeacher} className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-black shadow-lg">حفظ المعلم</button>
              <button onClick={() => setShowTeacherModal(false)} className="px-8 py-4 bg-gray-100 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال الطالب (بدون تغيير في الحقول) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-y-auto max-h-[95vh] p-8 space-y-8">
            <h3 className="text-2xl font-black text-emerald-900 border-b pb-4">تسجيل الطالب والخطة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-black text-emerald-800 border-r-4 border-emerald-500 pr-2 text-sm">بيانات الطالب</h4>
                <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                
                {/* اختيار حلقة ومعلم */}
                {!isAddingNewCircle ? (
                  <select className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none" value={newStudent.circle} onChange={e => e.target.value === "ADD_NEW" ? setIsAddingNewCircle(true) : setNewStudent({...newStudent, circle: e.target.value})}>
                    <option value="">اختر الحلقة...</option>
                    {existingCircles.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="ADD_NEW" className="text-emerald-600 font-black">+ إضافة حلقة ومعلم جديد...</option>
                  </select>
                ) : (
                  <div className="space-y-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <input className="w-full p-3 rounded-xl bg-white font-bold outline-none border" placeholder="اسم الحلقة الجديدة" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})} />
                    <select className="w-full p-3 rounded-xl bg-white font-bold outline-none border" value={newStudent.circleTeacher} onChange={e => setNewStudent({...newStudent, circleTeacher: e.target.value})}>
                      <option value="">اختر المعلم المسؤول...</option>
                      {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                    <button onClick={() => setIsAddingNewCircle(false)} className="text-[10px] font-bold text-gray-400 underline">العودة</button>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs" placeholder="المرحلة" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})} />
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs" placeholder="جوال الطالب" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                  <input className="p-3 rounded-xl bg-gray-50 font-bold text-xs" placeholder="جوال ولي الأمر" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-emerald-800 border-r-4 border-emerald-500 pr-2 text-sm">الخطة الدراسية</h4>
                {/* الحفظ 7 أسطر */}
                <div className="bg-emerald-50/50 p-4 rounded-2xl space-y-3 border border-emerald-100">
                   <div className="flex justify-between items-center font-black text-xs text-emerald-900"><span>خطة الحفظ</span><input type="checkbox" checked={newStudent.hifzEnabled} readOnly /></div>
                   <div className="grid grid-cols-2 gap-2">
                     <select className="p-2 rounded-lg bg-white font-bold text-xs" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                     <input type="number" className="p-2 rounded-lg bg-white font-bold text-xs" placeholder="آية" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} />
                     <input type="number" className="p-2 rounded-lg bg-white font-bold text-xs border-2 border-emerald-200" placeholder="أسطر" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} />
                     <select className="p-2 rounded-lg bg-white font-bold text-xs" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select>
                   </div>
                </div>
                {/* التثبيت والمراجعة */}
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-blue-50/30 p-3 rounded-xl border border-blue-50">
                      <span className="block font-black text-blue-900 text-[10px] mb-1">التثبيت</span>
                      <select className="w-full p-2 rounded-lg text-[10px] font-bold" value={newStudent.tathbitStartSurah} onChange={e => setNewStudent({...newStudent, tathbitStartSurah: e.target.value})}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                   </div>
                   <div className="bg-amber-50/30 p-3 rounded-xl border border-amber-50">
                      <span className="block font-black text-amber-900 text-[10px] mb-1">المراجعة</span>
                      <input type="number" className="w-full p-2 rounded-lg text-[10px] font-bold" value={newStudent.murajaahLinesTarget} onChange={e => setNewStudent({...newStudent, murajaahLinesTarget: e.target.value})} />
                   </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSaveStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all">اعتماد وحفظ البيانات</button>
              <button onClick={() => setShowAddModal(false)} className="px-10 py-5 bg-gray-100 text-gray-400 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
