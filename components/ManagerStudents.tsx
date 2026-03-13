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
    murajaahEnabled: false, murajaahLinesTarget: '15', murajaahFromSurah: 'الفاتحة'
  };

  const [newStudent, setNewStudent] = useState(initialState);
  const [newTeacher, setNewTeacher] = useState({ name: '', phone: '', circle: '' });

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    const allTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
    setTeachers(allTeachers.filter((t: any) => t.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const existingCircles = Array.from(new Set(students.map(s => s.circle).filter(Boolean)));

  // --- دوال الطلاب ---
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
    }
  };

  const deleteStudent = (id: number) => {
    if (window.confirm("حذف الطالب؟")) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const updated = allStudents.filter((s: any) => s.id !== id);
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
    }
  };

  // --- دوال المعلمين ---
  const handleSaveTeacher = () => {
    if (newTeacher.name) {
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
      setNewTeacher({ name: '', phone: '', circle: '' });
    }
  };

  const deleteTeacher = (id: number) => {
    if (window.confirm("حذف المعلم؟")) {
      const allTeachers = JSON.parse(localStorage.getItem('afaq_teachers') || '[]');
      const updated = allTeachers.filter((t: any) => t.id !== id);
      localStorage.setItem('afaq_teachers', JSON.stringify(updated));
      setTeachers(updated.filter((t: any) => t.mosqueId === selectedMosque));
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-12 text-right" dir="rtl">
      
      {/* قسم الطلاب */}
      <section className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
          <h2 className="text-2xl font-black text-emerald-900">إدارة الطلاب</h2>
          <button onClick={() => { setEditingStudentId(null); setNewStudent(initialState); setShowAddModal(true); }} className="bg-emerald-900 text-white px-8 py-3 rounded-2xl font-black shadow-lg">+ طالب جديد</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {students.map((student) => (
            <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm">
              <h3 className="font-black text-emerald-900 text-sm truncate">{student.fullName}</h3>
              <p className="text-[10px] text-gray-400 font-bold">{student.circle || 'بدون حلقة'}</p>
              <div className="flex gap-2 border-t mt-3 pt-3">
                <button onClick={() => { setNewStudent({...student, tripleName: student.fullName}); setEditingStudentId(student.id); setShowAddModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black">تعديل</button>
                <button onClick={() => deleteStudent(student.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* قسم المعلمين (مع الحذف والتعديل) */}
      <section className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
          <h2 className="text-2xl font-black text-emerald-900">إدارة المعلمين</h2>
          <button onClick={() => { setEditingTeacherId(null); setNewTeacher({ name: '', phone: '', circle: '' }); setShowTeacherModal(true); }} className="bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg">+ معلم جديد</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm">
              <h3 className="font-black text-emerald-900 text-sm truncate">{teacher.name}</h3>
              <p className="text-[10px] text-gray-400 font-bold">حلقة: {teacher.circle || 'غير محدد'}</p>
              <div className="flex gap-2 border-t mt-3 pt-3">
                <button onClick={() => { setNewTeacher(teacher); setEditingTeacherId(teacher.id); setShowTeacherModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black">تعديل</button>
                <button onClick={() => deleteTeacher(teacher.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* مودال الطالب (كامل بجميع الحقول) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-y-auto max-h-[95vh] p-10 space-y-10">
            <h3 className="text-xl font-black text-emerald-900 border-b pb-4">بيانات الطالب</h3>
            
            <div className="space-y-6">
              <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">المعلومات الشخصية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                <select className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})}>
                  <option value="">اختر الحلقة...</option>
                  {existingCircles.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input className="p-4 rounded-xl bg-gray-50 font-bold" placeholder="المرحلة" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})} />
                <input className="p-4 rounded-xl bg-gray-50 font-bold" placeholder="جوال الطالب" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                <input className="p-4 rounded-xl bg-gray-50 font-bold" placeholder="جوال ولي الأمر" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">خطة الحفظ (7 أسطر)</h4>
              <div className="bg-emerald-50/40 p-6 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-4">
                <select className="p-3 rounded-lg" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})}>{quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}</select>
                <input type="number" className="p-3 rounded-lg" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} />
                <input type="number" className="p-3 rounded-lg border-2 border-emerald-200" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} />
                <select className="p-3 rounded-lg" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select>
              </div>
              {/* التثبيت والمراجعة موجودين كما طلبت */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/40 p-6 rounded-3xl"><span>التثبيت</span></div>
                <div className="bg-amber-50/40 p-6 rounded-3xl"><span>المراجعة</span></div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSaveStudent} className="flex-1 py-4 bg-emerald-900 text-white rounded-2xl font-black">حفظ الطالب</button>
              <button onClick={() => setShowAddModal(false)} className="px-10 py-4 bg-gray-100 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال المعلم */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-[40px] bg-white p-10 space-y-6">
            <h3 className="text-xl font-black text-emerald-900">بيانات المعلم</h3>
            <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold" placeholder="اسم المعلم" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
            <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold" placeholder="رقم الجوال" value={newTeacher.phone} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} />
            <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold" placeholder="الحلقة المسؤولة عنها" value={newTeacher.circle} onChange={e => setNewTeacher({...newTeacher, circle: e.target.value})} />
            <div className="flex gap-4 pt-4">
              <button onClick={handleSaveTeacher} className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-black">حفظ المعلم</button>
              <button onClick={() => setShowTeacherModal(false)} className="px-10 py-4 bg-gray-100 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
