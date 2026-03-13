import React, { useState, useEffect } from 'react';

// قائمة السور
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
  const [isAddingNewCircle, setIsAddingNewCircle] = useState(false);

  const initialState = { 
    tripleName: '', 
    circle: '', 
    studyLevel: '',
    studentPhone: '', 
    parentPhone: '',
    hifzEnabled: true,
    hifzFromSurah: 'النبأ',
    hifzVerse: '1', 
    hifzLinesTarget: '33', 
    hifzDirection: 'تصاعدي'
  };

  const [newStudent, setNewStudent] = useState(initialState);

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    setStudents(allStudents.filter((s: any) => s.mosqueId === selectedMosque));
  }, [selectedMosque]);

  // استخراج الحلقات تلقائياً
  const existingCircles = Array.from(new Set(students.map(s => s.circle).filter(Boolean)));

  const handleSaveStudent = () => {
    if (newStudent.tripleName) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      let updated;
      if (editingStudentId) {
        updated = allStudents.map((s: any) => 
          s.id === editingStudentId ? { ...newStudent, id: s.id, mosqueId: selectedMosque, fullName: newStudent.tripleName } : s
        );
      } else {
        const studentData = { ...newStudent, id: Date.now(), mosqueId: selectedMosque, fullName: newStudent.tripleName };
        updated = [...allStudents, studentData];
      }
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
      setShowAddModal(false);
      setEditingStudentId(null);
      setNewStudent(initialState);
      setIsAddingNewCircle(false);
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
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 text-right" dir="rtl">
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة الطلاب</h2>
        </div>
        <button onClick={() => { setEditingStudentId(null); setNewStudent(initialState); setShowAddModal(true); }} className="bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl active:scale-95">
          + إضافة طالب جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 flex flex-col gap-4">
            <h3 className="font-black text-emerald-900 text-sm truncate">{student.fullName}</h3>
            <p className="text-[10px] text-gray-400 font-bold">{student.circle}</p>
            <div className="flex gap-2 border-t pt-3">
              <button onClick={() => { setNewStudent({...student, tripleName: student.fullName}); setEditingStudentId(student.id); setShowAddModal(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black">تعديل</button>
              <button onClick={() => deleteStudent(student.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black">حذف</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-emerald-900">{editingStudentId ? 'تعديل طالب' : 'تسجيل طالب'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-3xl text-gray-400">&times;</button>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-6">
                <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">المعلومات الشخصية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold text-emerald-900 outline-none" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                  
                  <div className="w-full">
                    {!isAddingNewCircle ? (
                      <select 
                        className="w-full p-4 rounded-2xl bg-gray-50 font-bold text-emerald-900 outline-none appearance-none"
                        value={newStudent.circle}
                        onChange={(e) => {
                          if (e.target.value === "ADD_NEW") { setIsAddingNewCircle(true); setNewStudent({...newStudent, circle: ''}); }
                          else { setNewStudent({...newStudent, circle: e.target.value}); }
                        }}
                      >
                        <option value="">اختر الحلقة...</option>
                        {existingCircles.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="ADD_NEW" className="text-emerald-600 font-bold">+ إضافة حلقة جديدة...</option>
                      </select>
                    ) : (
                      <input 
                        className="w-full p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 font-bold outline-none" 
                        placeholder="اكتب اسم الحلقة الجديدة..." 
                        value={newStudent.circle}
                        onChange={e => setNewStudent({...newStudent, circle: e.target.value})}
                        autoFocus
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-emerald-900 font-black border-r-4 border-emerald-500 pr-3">خطة الحفظ والهدف</h4>
                 <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <select className="p-3 rounded-lg bg-white font-bold outline-none" value={newStudent.hifzFromSurah} onChange={e => setNewStudent({...newStudent, hifzFromSurah: e.target.value})}>
                        {quranSurahs.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="number" className="p-3 rounded-lg bg-white font-bold outline-none" placeholder="آية" value={newStudent.hifzVerse} onChange={e => setNewStudent({...newStudent, hifzVerse: e.target.value})} />
                      <input type="number" className="p-3 rounded-lg bg-white font-bold outline-none border-2 border-emerald-200" placeholder="أسطر" value={newStudent.hifzLinesTarget} onChange={e => setNewStudent({...newStudent, hifzLinesTarget: e.target.value})} />
                      <select className="p-3 rounded-lg bg-white font-bold outline-none" value={newStudent.hifzDirection} onChange={e => setNewStudent({...newStudent, hifzDirection: e.target.value})}><option>تصاعدي</option><option>تنازلي</option></select>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-4">
              <button onClick={handleSaveStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl active:scale-95 transition-all">حفظ البيانات</button>
              <button onClick={() => setShowAddModal(false)} className="px-10 py-5 bg-white border text-gray-400 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
