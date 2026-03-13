import React, { useState, useEffect } from 'react';

const quranSurahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [circles, setCircles] = useState<string[]>(['حلقة أبو بكر', 'حلقة عمر']);
  const [teachers, setTeachers] = useState<string[]>(['أحمد محمد', 'ياسر علي']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);

  const initialState = { 
    tripleName: '', circle: '', studyLevel: '', studentPhone: '', parentPhone: '',
    hifzEnabled: true, hifzFromSurah: 'النبأ', hifzVerse: '1', hifzLinesTarget: '10', hifzDirection: 'تصاعدي',
    tathbitEnabled: false, tathbitStartSurah: 'الناس', tathbitVerse: '1',
    murajaahEnabled: false, murajaahLinesTarget: '15', murajaahFromSurah: 'الفاتحة'
  };

  const [newStudent, setNewStudent] = useState(initialState);

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
  }, [selectedMosque]);

  // إدارة الطلاب (حفظ، حذف، تعديل)
  const handleSaveStudent = () => {
    if (newStudent.tripleName) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      let updated;
      if (editingStudentId) {
        updated = allStudents.map((s: any) => s.id === editingStudentId ? { ...newStudent, id: s.id, mosqueId: selectedMosque, fullName: newStudent.tripleName } : s);
      } else {
        const studentData = { ...newStudent, id: Date.now(), mosqueId: selectedMosque, fullName: newStudent.tripleName, points: 0 };
        updated = [...allStudents, studentData];
      }
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false); setEditingStudentId(null); setNewStudent(initialState);
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

  // إدارة الحلقات والمعلمين (حذف وتعديل)
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
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة المركز</h2>
          <p className="text-xs text-gray-400 font-bold">إدارة الطلاب والحلقات والمعلمين</p>
        </div>
        <button onClick={() => { setEditingStudentId(null); setNewStudent(initialState); setShowAddModal(true); }} className="bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-800 transition-all">
          + إضافة طالب جديد
        </button>
      </div>

      {/* إدارة الحلقات والمعلمين */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-emerald-50">
          <h3 className="font-black text-emerald-900 mb-4 border-r-4 border-emerald-500 pr-2">الحلقات</h3>
          <div className="space-y-2">
            {circles.map((c, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <span className="font-bold text-gray-700">{c}</span>
                <div className="flex gap-2">
                  <button onClick={() => editCircleOrTeacher(i, 'circle')} className="text-blue-500 text-xs font-bold">تعديل</button>
                  <button onClick={() => deleteCircleOrTeacher(i, 'circle')} className="text-red-500 text-xs font-bold">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-emerald-50">
          <h3 className="font-black text-emerald-900 mb-4 border-r-4 border-emerald-500 pr-2">المعلمون</h3>
          <div className="space-y-2">
            {teachers.map((t, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <span className="font-bold text-gray-700">{t}</span>
                <div className="flex gap-2">
                  <button onClick={() => editCircleOrTeacher(i, 'teacher')} className="text-blue-500 text-xs font-bold">تعديل</button>
                  <button onClick={() => deleteCircleOrTeacher(i, 'teacher')} className="text-red-500 text-xs font-bold">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* قائمة الطلاب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-[2.5rem] border border-emerald-50 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">👤</div>
              <div className="flex-1">
                <h3 className="font-black text-emerald-900 text-sm truncate">{student.fullName}</h3>
                <p className="text-[10px] text-emerald-600 font-bold">{student.circle || 'بدون حلقة'}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-50">
              <button onClick={() => { setNewStudent({...student, tripleName: student.fullName}); setEditingStudentId(student.id); setShowAddModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all">تعديل</button>
              <button onClick={() => deleteStudent(student.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black hover:bg-red-600 hover:text-white transition-all">حذف</button>
            </div>
          </div>
        ))}
      </div>

      {/* المودال - Modal (نفس التصميم الأصلي) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4 py-10">
            <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-emerald-900">{editingStudentId ? 'تعديل طالب' : 'تسجيل طالب'}</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-3xl">&times;</button>
              </div>
              <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input className="w-full p-4 rounded-2xl bg-gray-50 outline-none font-bold" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                  <input className="w-full p-4 rounded-2xl bg-gray-50 outline-none font-bold" placeholder="اسم الحلقة" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})} />
                </div>
                <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100 space-y-4">
                  <h4 className="font-black text-emerald-800">خطة الحفظ</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select className="p-3 rounded-lg bg-white font-bold outline-none" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})}>
                      {quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="number" className="p-3 rounded-lg bg-white font-bold outline-none" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} />
                    <input type="number" className="p-3 rounded-lg bg-white font-bold outline-none" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} />
                    <select className="p-3 rounded-lg bg-white font-bold outline-none" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t flex gap-4">
                <button onClick={handleSaveStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl hover:bg-emerald-800 shadow-lg">حفظ البيانات</button>
                <button onClick={() => setShowAddModal(false)} className="px-10 py-5 bg-white border text-gray-400 rounded-2xl font-black">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
