import React, { useState, useEffect } from 'react';

// القائمة الكاملة لسور القرآن الكريم مرتبة كما هي في كودك
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
        const studentData = { ...newStudent, id: Date.now(), mosqueId: selectedMosque, fullName: newStudent.tripleName, points: 0 };
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
    if (window.confirm("حذف الطالب؟")) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const updated = allStudents.filter((s: any) => s.id !== id);
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 text-right animate-fadeIn" dir="rtl">
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة الطلاب</h2>
          <p className="text-xs text-gray-400 font-bold">إضافة وتعديل خطط الطلاب</p>
        </div>
        <button onClick={() => { setEditingStudentId(null); setNewStudent(initialState); setShowAddModal(true); }} className="w-full md:w-auto bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-800 shadow-xl transition-all active:scale-95">
          + إضافة طالب جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 flex flex-col gap-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">👤</div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-black text-emerald-900 truncate text-sm">{student.fullName}</h3>
                <p className="text-[10px] text-gray-400 font-bold">{student.circle || 'بدون حلقة'}</p>
              </div>
            </div>
            <div className="flex gap-2 border-t pt-3">
              <button onClick={() => { setNewStudent({...student, tripleName: student.fullName}); setEditingStudentId(student.id); setShowAddModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black">تعديل</button>
              <button onClick={() => deleteStudent(student.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black">حذف</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-4 py-10">
            <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-hidden animate-scaleIn">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-emerald-900">{editingStudentId ? 'تعديل طالب' : 'نموذج تسجيل طالب'}</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-3xl font-light hover:text-red-500">&times;</button>
              </div>

              <div className="p-6 md:p-10 space-y-10">
                {/* الجزء الأول: المعلومات الشخصية */}
                <div className="space-y-6">
                  <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">المعلومات الشخصية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                    <input className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="اسم الحلقة" value={newStudent.circle} onChange={e => setNewStudent({...newStudent, circle: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="p-4 rounded-xl bg-gray-50 font-bold outline-none" placeholder="المرحلة الدراسية" value={newStudent.studyLevel} onChange={e => setNewStudent({...newStudent, studyLevel: e.target.value})} />
                    <input className="p-4 rounded-xl bg-gray-50 font-bold text-left outline-none" dir="ltr" placeholder="جوال الطالب" value={newStudent.studentPhone} onChange={e => setNewStudent({...newStudent, studentPhone: e.target.value})} />
                    <input className="p-4 rounded-xl bg-gray-50 font-bold text-left outline-none" dir="ltr" placeholder="جوال ولي الأمر" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                  </div>
                </div>

                {/* الجزء الثاني: خطة الحفظ (نفس كودك الأصلي تماماً) */}
                <div className="space-y-6">
                  <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">خطة الحفظ والهدف</h4>
                  <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100 space-y-4">
                    <div className="flex items-center gap-2 font-black text-emerald-800">
                      <input type="checkbox" checked={newStudent.hifzEnabled} onChange={e => setNewStudent({...newStudent, hifzEnabled: e.target.checked})} className="w-5 h-5 accent-emerald-600" />
                      <span>تفعيل خطة الحفظ</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <select className="w-full p-3 rounded-lg bg-white font-bold outline-none shadow-sm" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})}>
                        {quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="number" className="w-full p-3 rounded-lg bg-white font-bold outline-none shadow-sm" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} />
                      <input type="number" className="w-full p-3 rounded-lg bg-white font-bold outline-none shadow-sm" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} />
                      <select className="w-full p-3 rounded-lg bg-white font-bold outline-none shadow-sm" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select>
                    </div>
                  </div>

                  {/* الجزء الثالث: التثبيت والمراجعة */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50/40 p-6 rounded-3xl border border-blue-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 font-black text-blue-800">
                        <input type="checkbox" checked={newStudent.tathbitEnabled} onChange={e => setNewStudent({...newStudent, tathbitEnabled: e.target.checked})} className="w-5 h-5 accent-blue-600" />
                        <span>خطة التثبيت</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <select className="w-full p-3 rounded-lg bg-white font-bold text-xs outline-none" value={newStudent.tathbitStartSurah} onChange={e => setNewStudent({...newStudent, tathbitStartSurah: e.target.value})}>
                          {quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input type="number" className="w-full p-3 rounded-lg bg-white font-bold text-xs outline-none" value={newStudent.tathbitVerse} onChange={e => setNewStudent({...newStudent, tathbitVerse: e.target.value})} />
                      </div>
                    </div>

                    <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 font-black text-amber-800">
                        <input type="checkbox" checked={newStudent.murajaahEnabled} onChange={e => setNewStudent({...newStudent, murajaahEnabled: e.target.checked})} className="w-5 h-5 accent-amber-600" />
                        <span>خطة المراجعة</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="number" className="w-full p-3 rounded-lg bg-white font-bold text-xs outline-none" value={newStudent.murajaahLinesTarget} onChange={e => setNewStudent({...newStudent, murajaahLinesTarget: e.target.value})} />
                        <select className="w-full p-3 rounded-lg bg-white font-bold text-xs outline-none" value={newStudent.murajaahFromSurah} onChange={e => setNewStudent({...newStudent, murajaahFromSurah: e.target.value})}>
                          {quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t flex gap-4">
                <button onClick={handleSaveStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl hover:bg-emerald-800 transition-all">
                  {editingStudentId ? 'تعديل وحفظ الطالب' : 'اعتماد وحفظ الطالب'}
                </button>
                <button onClick={() => setShowAddModal(false)} className="px-10 py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
