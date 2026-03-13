import React, { useState, useEffect } from 'react';

// القائمة الكاملة للسور كما هي في كودك
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
  
  // استخراج أسماء الحلقات الفريدة الموجودة مسبقاً
  const [availableCircles, setAvailableCircles] = useState<string[]>([]);

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
    const mosqueStudents = allStudents.filter((s: any) => s.mosqueId === selectedMosque);
    setStudents(mosqueStudents);
    
    // تجميع أسماء الحلقات المسجلة في هذا المسجد بدون تكرار
    const circles = Array.from(new Set(mosqueStudents.map((s: any) => s.circle).filter(Boolean))) as string[];
    setAvailableCircles(circles);
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
      
      // تحديث قائمة الحلقات المتاحة بعد الإضافة
      const circles = Array.from(new Set(updated.filter((s: any) => s.mosqueId === selectedMosque).map((s: any) => s.circle).filter(Boolean))) as string[];
      setAvailableCircles(circles);
      
      setShowAddModal(false);
      setEditingStudentId(null);
      setNewStudent(initialState);
    }
  };

  const deleteStudent = (id: number) => {
    if (window.confirm("حذف هذا الطالب؟")) {
      const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
      const updated = allStudents.filter((s: any) => s.id !== id);
      localStorage.setItem('afaq_students', JSON.stringify(updated));
      setStudents(updated.filter((s: any) => s.mosqueId === selectedMosque));
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة الطلاب</h2>
          <p className="text-xs text-gray-400 font-bold">إضافة وتعديل خطط الطلاب</p>
        </div>
        <button onClick={() => { setEditingStudentId(null); setNewStudent(initialState); setShowAddModal(true); }} className="w-full md:w-auto bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-800 shadow-xl transition-all">
          + إضافة طالب جديد
        </button>
      </div>

      {/* List - أضفت لك أزرار التعديل والحذف هنا */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm">
            <h3 className="font-black text-emerald-900 truncate text-sm">{student.fullName}</h3>
            <p className="text-[10px] text-gray-400 font-bold mb-3">{student.circle || 'بدون حلقة'}</p>
            <div className="flex gap-2">
              <button onClick={() => { setNewStudent({...student, tripleName: student.fullName}); setEditingStudentId(student.id); setShowAddModal(true); }} className="flex-1 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">تعديل</button>
              <button onClick={() => deleteStudent(student.id)} className="flex-1 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold">حذف</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl rounded-[40px] bg-white shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-black text-emerald-900">{editingStudentId ? 'تعديل طالب' : 'تسجيل طالب جديد'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-3xl">&times;</button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none border-2 border-transparent focus:border-emerald-500" placeholder="الاسم الثلاثي" value={newStudent.tripleName} onChange={e => setNewStudent({...newStudent, tripleName: e.target.value})} />
                
                {/* قائمة اختيار الحلقة الذكية */}
                <div className="relative">
                  <select 
                    className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none border-2 border-transparent focus:border-emerald-500 appearance-none"
                    value={newStudent.circle}
                    onChange={e => setNewStudent({...newStudent, circle: e.target.value})}
                  >
                    <option value="">اختر الحلقة...</option>
                    {availableCircles.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="new_circle">+ إضافة حلقة جديدة...</option>
                  </select>
                  
                  {/* إذا اختار حلقة جديدة أو لم تكن هناك حلقات، يظهر له حقل كتابة */}
                  {(newStudent.circle === 'new_circle' || availableCircles.length === 0) && (
                    <input 
                      className="mt-2 w-full p-4 rounded-2xl bg-emerald-50 font-bold outline-none border-2 border-emerald-200" 
                      placeholder="اكتب اسم الحلقة الجديدة هنا..." 
                      autoFocus
                      onBlur={(e) => {
                        if(e.target.value) {
                           setNewStudent({...newStudent, circle: e.target.value});
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* باقي حقول كودك (الجوالات والخطط) تظل كما هي في مكانها */}
              {/* ... */}
            </div>

            <div className="p-6 bg-gray-50 border-t flex gap-4">
              <button onClick={handleSaveStudent} className="flex-1 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl hover:bg-emerald-800 transition-all">حفظ البيانات</button>
              <button onClick={() => setShowAddModal(false)} className="px-10 py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerStudents;
