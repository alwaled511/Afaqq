import React, { useState, useEffect } from 'react';

// قائمة السور الكاملة
const quranSurahs = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

const SUCCESS_CRITERIA = {
  lesson: { maxErrors: 0, maxHesitation: 1 },
  tathbit: { maxErrors: 1, maxHesitation: 3 },
  murajaah: { maxErrors: 2, maxHesitation: 4 }
};

const StudentRecitation: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [counters, setCounters] = useState({
    lesson: { errors: 0, hesitations: 0 },
    tathbit: { errors: 0, hesitations: 0 },
    murajaah: { errors: 0, hesitations: 0 }
  });

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    setStudents(savedStudents);
  }, []);

  const handleAction = (type: 'lesson' | 'tathbit' | 'murajaah', field: 'errors' | 'hesitations') => {
    setCounters(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: prev[type][field] + 1 }
    }));
  };

  const checkStatus = (type: 'lesson' | 'tathbit' | 'murajaah') => {
    const { errors, hesitations } = counters[type];
    const criteria = SUCCESS_CRITERIA[type];
    if (errors > criteria.maxErrors || hesitations > criteria.maxHesitation) return 'يجب الإعادة ⚠️';
    return 'ناجح ✅';
  };

  const saveProgress = () => {
    if (!selectedStudent) return;
    const isLessonSuccess = checkStatus('lesson') === 'ناجح ✅';
    
    const updatedStudents = students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          tathbitStartSurah: isLessonSuccess ? s.hifzFromSurah : s.tathbitStartSurah,
          tathbitVerse: isLessonSuccess ? s.hifzVerse : s.tathbitVerse,
          // هنا يتم الانتقال التلقائي للآية التالية (بزيادة افتراضية 5 آيات)
          hifzVerse: isLessonSuccess ? (parseInt(s.hifzVerse) + 5).toString() : s.hifzVerse,
        };
      }
      return s;
    });

    localStorage.setItem('afaq_students', JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
    alert("تم اعتماد التسميع وتحديث الخطة آلياً");
    setSelectedStudent(null);
    setCounters({ lesson: { errors: 0, hesitations: 0 }, tathbit: { errors: 0, hesitations: 0 }, murajaah: { errors: 0, hesitations: 0 } });
  };

  return (
    <div className="w-full p-4 md:p-8 bg-gray-50 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* قائمة الطلاب */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-black text-emerald-900 mr-2">قائمة التسميع</h3>
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            {students.map(student => (
              <button key={student.id} onClick={() => setSelectedStudent(student)} className={`w-full p-4 flex items-center gap-4 border-b transition-all ${selectedStudent?.id === student.id ? 'bg-emerald-50' : 'bg-white'}`}>
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">👤</div>
                <div className="text-right flex-1">
                  <p className="font-black text-sm text-emerald-900">{student.fullName}</p>
                  <p className="text-[10px] text-gray-400 font-bold">الحفظ: {student.hifzFromSurah}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* لوحة التحكم */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6">
              <div className="bg-emerald-900 text-white p-6 rounded-[2.5rem] shadow-xl">
                <h2 className="text-xl font-black">{selectedStudent.fullName}</h2>
                <p className="text-emerald-300 text-xs font-bold">المطلوب اليوم: {selectedStudent.hifzLinesTarget} أسطر</p>
              </div>

              {['lesson', 'tathbit', 'murajaah'].map((type) => (
                <div key={type} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-gray-700">
                      {type === 'lesson' ? 'الدرس الجديد' : type === 'tathbit' ? 'التثبيت' : 'المراجعة'}
                    </h4>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black ${checkStatus(type as any).includes('الإعادة') ? 'bg-red-500 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                      {checkStatus(type as any)}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleAction(type as any, 'errors')} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100">
                      خطأ ({counters[type].errors})
                    </button>
                    <button onClick={() => handleAction(type as any, 'hesitations')} className="flex-1 py-3 bg-amber-50 text-amber-600 rounded-xl font-bold border border-amber-100">
                      تردد ({counters[type].hesitations})
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={saveProgress} className="w-full py-5 bg-emerald-900 text-white rounded-2xl font-black text-xl shadow-lg hover:bg-emerald-800 transition-all">
                حفظ التسميع وتحديث الخطة
              </button>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold">
              اختر طالباً لبدء التسميع
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRecitation;
