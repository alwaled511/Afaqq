import React, { useState, useEffect } from 'react';

// القائمة الكاملة لسور القرآن الكريم مرتبة
const quranSurahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [circles, setCircles] = useState<string[]>(['حلقة أبو بكر', 'حلقة عمر']);
  const [teachers, setTeachers] = useState<string[]>(['أحمد محمد', 'ياسر علي']);
  
  const initialState = { 
    tripleName: '', 
    circle: '', 
    studyLevel: '',
    studentPhone: '', 
    parentPhone: '',
    hifzEnabled: true,
    hifzFromSurah: 'النبأ',
    hifzVerse: '1', 
    hifzLinesTarget: '10', 
    hifzDirection: 'تصاعدي',
    tathbitEnabled: false,
    tathbitStartSurah: 'الناس', 
    tathbitVerse: '1',
    murajaahEnabled: false,
    murajaahLinesTarget: '15', 
    murajaahFromSurah: 'الفاتحة'
  };

  const [newStudent, setNewStudent] = useState(initialState);

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const handleSaveStudent = () => {
    if (newStudent.tripleName) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      let updated;
      if (editingStudentId) {
        updated = allStudents.map((s: any) => 
          s.id === editingStudentId ? { ...newStudent, id: s.id, mosqueId: selectedMosque, fullName: newStudent.tripleName } : s
        );
      } else {
        const studentData = { 
          ...newStudent, 
          id: Date.now(), 
          mosqueId: selectedMosque, 
          fullName: newStudent.tripleName,
          points: 0,
          currentPosition: { surah: newStudent.hifzFromSurah, verse: parseInt(newStudent.hifzVerse) }
        };
        updated = [...allStudents, studentData];
      }
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false);
      setEditingStudentId(null);
      setNewStudent(initialState);
    }
  };

  const deleteStudent = (id: number) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const updated = allStudents.filter((s: any) => s.id !== id);
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
    }
  };

  const editCircleOrTeacher = (index: number, type: 'circle' | 'teacher') => {
    const current = type === 'circle' ? circles[index] : teachers[index];
    const newValue = window.prompt("تعديل الاسم:", current);
    if (newValue) {
      if (type === 'circle') { const updated = [...circles]; updated[index] = newValue; setCircles(updated); }
      else { const updated = [...teachers]; updated[index] = newValue; setTeachers(updated); }
    }
  };

  const deleteCircleOrTeacher = (index: number, type: 'circle' | 'teacher') => {
    if (window.confirm("تأكيد الحذف؟")) {
      if (type === 'circle') setCircles(circles.filter((_, i) => i !== index));
      else setTeachers(teachers.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 text-right animate-fadeIn" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة الطلاب</h2>
          <p className="text-xs text-gray-400 font-bold">إضافة وتعديل خطط الطلاب</p>
        </div>
        <button onClick={() => { setEditingStudentId(null); setNewStudent(initialState); setShowAddModal(true); }} className="w-full md:w-auto bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-800 shadow-xl transition-all active:scale-95">
          + إضافة طالب جديد
        </button>
      </div>

      {/* إدارة الحلقات والمعلمين */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm">
          <h3 className="font-black text-emerald-900 mb-4 border-r-4 border-emerald-500 pr-2">الحلقات المتاحة</h3>
          <div className="space-y-2">
            {circles.map((c, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <span className="font-bold text-gray-700">{c}</span>
                <div className="flex gap-2">
                  <button onClick={() => editCircleOrTeacher(i, 'circle')} className="text-blue-500 text-xs font-bold hover:underline">تعديل</button>
                  <button onClick={() => deleteCircleOrTeacher(i, 'circle')} className="text-red-500 text-xs font-bold hover:underline">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm">
          <h3 className="font-black text-emerald-900 mb-4 border-r-4 border-emerald-500 pr-2">المعلمون</h3>
          <div className="space-y-2">
            {teachers.map((t, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <span className="font-bold text-gray-700">{t}</span>
                <div className="flex gap-2">
                  <button onClick={() => editCircleOrTeacher(i, 'teacher')} className="text-blue-500 text-xs font-bold hover:underline">تعديل</button>
                  <button onClick={() => deleteCircleOrTeacher(i, 'teacher')} className="text-red-500 text-xs font-bold hover:underline">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-300 font-bold">لا يوجد طلاب مسجلين حالياً</div>
        ) : (
          students.map((student) => (
            <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">👤</div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-black text-emerald-900 truncate text-sm">{student.fullName}</h3>
                  <p className="text-[10px] text-gray-400 font-bold">{student.circle || 'لم يتم تحديد حلقة'}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-50">
                <button onClick={() => { setNewStudent({...student, tripleName: student.fullName}); setEditingStudentId(student.id); setShowAddModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all">تعديل</button>
                <button onClick={() => deleteStudent(student.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black hover:bg-red-600 hover:text-white transition-all">حذف</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4 py-10">
            <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-hidden animate-scaleIn">
              
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-emerald-900">{editingStudentId ? 'تعديل بيانات الطالب' : 'نموذج تسجيل طالب'}</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-3xl font-light hover:text-red-500 transition-colors">&times;</button>
              </div>

              <div className="p-6 md:p-10 space-y-10">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">المعلومات الشخصية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 mr-1">الاسم الثلاثي</label>
                      <input className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="أدخل الاسم الثلاثي للطالب..." value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 mr-1">اسم الحلقة</label>
                      <input className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="مثال: حلقة الفجر..." value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="p-4 rounded-xl bg-gray-50 font-bold outline-none" placeholder="المرحلة الدراسية" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})} />
                    <input className="p-4 rounded-xl bg-gray-50 font-bold text-left outline-none" dir="ltr" placeholder="جوال الطالب" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                    <input className="p-4 rounded-xl bg-gray-50 font-bold text-left outline-none" dir="ltr" placeholder="جوال ولي الأمر" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                  </div>
                </div>

                {/* Plan Info - الحفظ */}
                <div className="space-y-6">
                  <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">خطة الحفظ والهدف</h4>
                  <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100 space-y-4">
                    <div className="flex items-center gap-2 font-black text-emerald-800">
                      <input type="checkbox" checked={newStudent.hifzEnabled} onChange={e => setNewStudent({...newStudent, hifzEnabled: e.target.checked})} className="w-5 h-5 accent-emerald-600" />
                      <span>تفعيل خطة الحفظ</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 mb-1 block">من سورة</label>
                        <select className="w-full p-3 rounded-lg bg-white font-bold outline-none shadow-sm" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})}>
                          {quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">آية رقم</label><input type="number" className="w-full p-3 rounded-lg bg-white font-bold outline-none shadow-sm" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} /></div>
                      <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">الهدف اليومي (أسطر)</label><input type="number" className="w-full p-3 rounded-lg bg-white font-bold outline-none shadow-sm" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} /></div>
                      <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">الاتجاه</label><select className="w-full p-3 rounded-lg bg-white font-bold outline-none shadow-sm" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select></div>
                    </div>
                  </div>

                  {/* التثبيت والمراجعة - الأجزاء التي كانت ناقصة */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50/40 p-6 rounded-3xl border border-blue-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 font-black text-blue-800">
                        <input type="checkbox" checked={newStudent.tathbitEnabled} onChange={e => setNewStudent({...newStudent, tathbitEnabled: e.target.checked})} className="w-5 h-5 accent-blue-600" />
                        <span>خطة التثبيت</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400">من سورة</label>
                          <select className="w-full p-3 rounded-lg bg-white font-bold text-xs outline-none" value={newStudent.tathbitStartSurah} onChange={e => setNewStudent({...newStudent, tathbitStartSurah: e.target.value})}>
                            {quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div><label className="text-[10px] font-bold text-gray-400">آية رقم</label><input type="number" className="w-full p-3 rounded-lg bg-white font-bold text-xs outline-none" value={newStudent.tathbitVerse} onChange={e => setNewStudent({...newStudent, tathbitVerse: e.target.value})} /></div>
                      </div>
                    </div>

                    <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 font-black text-amber-800">
                        <input type="checkbox" checked={newStudent.murajaahEnabled} onChange={e => setNewStudent({...newStudent, murajaahEnabled: e.target.checked})} className="w-5 h-5 accent-amber-600" />
                        <span>خطة المراجعة</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] font-bold text-gray-400">الهدف (أسطر)</label><input type="number" className="w-full p-3 rounded-lg bg-white font-bold text-xs outline-none" value={newStudent.murajaahLinesTarget} onChange={e => setNewStudent({...newStudent, murajaahLinesTarget: e.target.value})} /></div>
                        <div>
                          <label className="text-[10px] font-bold text-
