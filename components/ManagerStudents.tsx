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
    tathbitEnabled: true, tathbitStartSurah: 'الناس', tathbitVerse: '1', tathbitLines: '15',
    murajaahEnabled: true, murajaahLinesTarget: '15', murajaahFromSurah: 'الفاتحة', murajaahVerse: '1',
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
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-10 text-right" dir="rtl">
      
      {/* رأس الصفحة مع الأزرار */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
        <h2 className="text-2xl font-black text-emerald-900">لوحة الإدارة</h2>
        <div className="flex gap-4">
          <button onClick={() => { setEditingTeacherId(null); setNewTeacher({name:'', phone:'', username:'', password:''}); setShowTeacherModal(true); }} className="bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg">إضافة معلم</button>
          <button onClick={() => { setEditingStudentId(null); setNewStudent(initialState); setShowAddModal(true); }} className="bg-emerald-900 text-white px-6 py-3 rounded-2xl font-black shadow-lg">إضافة طالب</button>
        </div>
      </div>

      {/* قائمة الطلاب الحالية */}
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

      {/* مودال الطالب المحدث - الحقول حسب الصور */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-y-auto max-h-[95vh] p-8 space-y-8">
            <h3 className="text-2xl font-black text-emerald-900 border-b pb-4 text-center">نموذج تسجيل طالب</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* القسم الأول: المعلومات الشخصية */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-r-4 border-emerald-500 pr-3">
                  <h4 className="font-black text-emerald-800">المعلومات الشخصية</h4>
                </div>
                
                <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none border border-transparent focus:border-emerald-500" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                
                <div className="space-y-3">
                   {!isAddingNewCircle ? (
                      <select className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none border border-transparent focus:border-emerald-500" value={newStudent.circle} onChange={e => e.target.value === "ADD_NEW" ? setIsAddingNewCircle(true) : setNewStudent({...newStudent, circle: e.target.value})}>
                        <option value="">اختر الحلقة...</option>
                        {existingCircles.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="ADD_NEW" className="text-emerald-600 font-black">+ إضافة حلقة ومعلم جديد...</option>
                      </select>
                   ) : (
                     <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                        <input className="w-full p-3 rounded-xl bg-white font-bold outline-none border" placeholder="اسم الحلقة الجديدة" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})} />
                        <select className="w-full p-3 rounded-xl bg-white font-bold outline-none border" value={newStudent.circleTeacher} onChange={e => setNewStudent({...newStudent, circleTeacher: e.target.value})}>
                          <option value="">المعلم المسؤول</option>
                          {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input className="p-4 rounded-xl bg-gray-50 font-bold text-xs outline-none" placeholder="المرحلة الدراسية" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})} />
                  <input className="p-4 rounded-xl bg-gray-50 font-bold text-xs outline-none" placeholder="جوال الطالب" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                  <input className="p-4 rounded-xl bg-gray-50 font-bold text-xs outline-none" placeholder="جوال ولي الأمر" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                </div>
              </div>

              {/* القسم الثاني: خطة الحفظ والهدف (حسب الصور) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-r-4 border-emerald-500 pr-3">
                  <h4 className="font-black text-emerald-800">خطة الحفظ والهدف</h4>
                </div>

                {/* الحفظ - مع الحقول الملونة في الصورة */}
                <div className="bg-emerald-50/40 p-5 rounded-[2.5rem] border border-emerald-100 space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <span className="font-black text-emerald-900 text-sm">تفعيل خطة الحفظ</span>
                    <input type="checkbox" checked={newStudent.hifzEnabled} onChange={e => setNewStudent({...newStudent, hifzEnabled: e.target.checked})} className="w-5 h-5 accent-emerald-600" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <select className="p-3 rounded-xl bg-white font-bold text-sm shadow-sm" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})}>
                      {quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {/* الحقل الأحمر: رقم الآية */}
                    <input type="number" className="p-3 rounded-xl bg-white font-bold text-sm shadow-sm border-2 border-red-200 focus:border-red-400 outline-none" placeholder="رقم الآية" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} />
                    
                    {/* الحقل الأزرق: عدد الأسطر */}
                    <input type="number" className="p-3 rounded-xl bg-white font-bold text-sm shadow-sm border-2 border-blue-200 focus:border-blue-400 outline-none" placeholder="عدد الأسطر" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} />
                    
                    <select className="p-3 rounded-xl bg-white font-bold text-sm shadow-sm" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}>
                      <option>تصاعدي</option>
                      <option>تنازلي</option>
                    </select>
                  </div>
                </div>

                {/* التثبيت والمراجعة بنفس النظام */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50/40 p-4 rounded-3xl border border-blue-100 space-y-2">
                    <span className="font-black text-blue-900 text-[10px]">التثبيت</span>
                    <select className="w-full p-2 rounded-lg text-[10px] font-bold shadow-sm" value={newStudent.tathbitStartSurah} onChange={e => setNewStudent({...newStudent, tathbitStartSurah: e.target.value})}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <div className="grid grid-cols-2 gap-1">
                      <input type="number" className="p-2 rounded-lg text-[10px] font-bold bg-white" placeholder="آية" value={newStudent.tathbitVerse} onChange={e => setNewStudent({...newStudent, tathbitVerse: e.target.value})} />
                      <input type="number" className="p-2 rounded-lg text-[10px] font-bold bg-white" placeholder="سطر" value={newStudent.tathbitLines} onChange={e => setNewStudent({...newStudent, tathbitLines: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="bg-amber-50/40 p-4 rounded-3xl border border-amber-100 space-y-2">
                    <span className="font-black text-amber-900 text-[10px]">المراجعة</span>
                    <select className="w-full p-2 rounded-lg text-[10px] font-bold shadow-sm" value={newStudent.murajaahFromSurah} onChange={e => setNewStudent({...newStudent, murajaahFromSurah: e.target.value})}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <div className="grid grid-cols-2 gap-1">
                      <input type="number" className="p-2 rounded-lg text-[10px] font-bold bg-white" placeholder="آية" value={newStudent.murajaahVerse} onChange={e => setNewStudent({...newStudent, murajaahVerse: e.target.value})} />
                      <input type="number" className="p-2 rounded-lg text-[10px] font-bold bg-white" placeholder="سطر" value={newStudent.murajaahLinesTarget} onChange={e => setNewStudent({...newStudent, murajaahLinesTarget: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button onClick={handleSaveStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-emerald-800 transition-colors">اعتماد وحفظ البيانات</button>
              <button onClick={() => setShowAddModal(false)} className="px-12 py-5 bg-gray-100 text-gray-500 rounded-3xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال المعلم */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[40px] bg-white p-10 space-y-6 shadow-2xl">
            <h3 className="text-xl font-black text-emerald-900 border-b pb-4">بيانات دخول المعلم</h3>
            <div className="space-y-4">
              <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold border" placeholder="اسم المعلم الثلاثي" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="p-4 rounded-2xl bg-emerald-50 font-bold border border-emerald-100" placeholder="اسم المستخدم" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} />
                <input className="p-4 rounded-2xl bg-emerald-50 font-bold border border-emerald-100" type="password" placeholder="كلمة المرور" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} />
              </div>
            </div>
            <button onClick={handleSaveTeacher} className="w-full py-4 bg-emerald-700 text-white rounded-2xl font-black shadow-lg">حفظ المعلم</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
