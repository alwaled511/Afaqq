import React, { useState, useEffect } from 'react';

// قائمة سور القرآن الكريم كاملة مرتبة للتدرج في الحفظ
const QURAN_PATH = [
  "الناس", "الفلق", "الإخلاص", "المسد", "النصر", "الكافرون", "الكوثر", "الماعون", "قريش", "الفيل",
  "الهمزة", "العصر", "التكاثر", "القارعة", "العاديات", "الزلزلة", "البينة", "القدر", "العلق", "التين",
  "الشرح", "الضحى", "الليل", "الشمس", "البلد", "الفجر", "الغاشية", "الأعلى", "الطارق", "البروج",
  "الانشقاق", "المطففين", "الانفطار", "التكوير", "عبس", "النازعات", "النبأ",
  "المرسلات", "الإنسان", "القيامة", "المدثر", "المزمل", "الجن", "نوح", "المعارج", "الحاقة", "القلم", "الملك",
  "التحريم", "الطلاق", "التغابن", "المنافقون", "الجمعة", "الصف", "الممتحنة", "الحشر", "المجادلة",
  "الحديد", "الواقعة", "الرحمن", "القمر", "النجم", "الطور", "الذاريات", "ق", "الحجرات", "الفتح", "محمد", "الأحقاف",
  "الجاثية", "الدخان", "الزخرف", "الشورى", "فصلت", "غافر", "الزمر", "ص", "الصافات", "يس", "فاطر", "سبأ", "الأحزاب",
  "السجدة", "لقمان", "الروم", "العنكبوت", "القصص", "النمل", "الشعراء", "الفرقان", "النور", "المؤمنون", "الحج",
  "الأنبياء", "طه", "مريم", "الكهف", "الإسراء", "النحل", "الحجر", "إبراهيم", "الرعد", "يوسف", "هود", "يونس",
  "التوبة", "الأنفال", "الأعراف", "الأنعام", "المائدة", "النساء", "آل عمران", "البقرة", "الفاتحة"
];

const TeacherSessions: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [activeDate] = useState(new Date().toLocaleDateString('ar-SA'));

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    // تهيئة الطلاب الذين ليس لديهم سجل حفظ
    const initialized = allStudents.map((s: any) => ({
      ...s,
      currentSurah: s.currentSurah || QURAN_PATH[0],
      points: s.points || 0,
      history: s.history || []
    }));
    setStudents(initialized);
  }, []);

  const updateStudentProgress = (studentId: number, type: 'success' | 'review' | 'absent') => {
    const updated = students.map(student => {
      if (student.id === studentId) {
        let nextSurah = student.currentSurah;
        let addedPoints = 0;
        let actionLabel = '';

        if (type === 'success') {
          const currentIndex = QURAN_PATH.indexOf(student.currentSurah);
          nextSurah = currentIndex < QURAN_PATH.length - 1 ? QURAN_PATH[currentIndex + 1] : "ختم القرآن! 🏆";
          addedPoints = 10;
          actionLabel = 'أتقن ✅';
        } else if (type === 'review') {
          addedPoints = 2;
          actionLabel = 'راجع 🔄';
        } else {
          actionLabel = 'غائب ❌';
        }

        const newLog = { date: activeDate, action: actionLabel, surah: student.currentSurah };
        return { 
          ...student, 
          currentSurah: nextSurah, 
          points: student.points + addedPoints,
          lastAction: actionLabel,
          history: [newLog, ...(student.history || [])].slice(0, 5) // حفظ آخر 5 حركات
        };
      }
      return student;
    });

    setStudents(updated);
    localStorage.setItem('afaq_students', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
      {/* رأس الصفحة - الهوية البصرية */}
      <div className="bg-[#0C1E14] p-8 rounded-[40px] shadow-2xl text-white relative overflow-hidden border border-emerald-800/50">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">متابعة الحلقة اليومية</h2>
            <p className="text-emerald-400/80 font-bold text-sm">نظام التسميع الذكي المتسلسل</p>
          </div>
          <div className="bg-emerald-900/40 backdrop-blur-xl px-8 py-4 rounded-[24px] border border-emerald-700/30 text-center">
            <div className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] mb-1">جلسة اليوم</div>
            <div className="text-2xl font-black">{activeDate}</div>
          </div>
        </div>
      </div>

      {/* قائمة الطلاب المرتبة */}
      <div className="grid grid-cols-1 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-[32px] border border-emerald-50 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-emerald-200 transition-all">
            
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div className="w-20 h-20 bg-emerald-50 rounded-[24px] flex items-center justify-center text-3xl relative border-2 border-white shadow-sm">
                👦
                <div className="absolute -top-2 -right-2 bg-amber-500 text-[#0C1E14] text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                  {student.points}
                </div>
              </div>
              <div>
                <h3 className="font-black text-emerald-900 text-xl mb-1">{student.fullName}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-900 text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm">
                    المقرر: سورة {student.currentSurah}
                  </span>
                  {student.lastAction && (
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-full border border-slate-200">
                      الحالة: {student.lastAction}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* أزرار التحكم السريع (طريقة خليل المختصرة) */}
            <div className="flex items-center gap-3 w-full lg:w-auto bg-slate-50 p-2 rounded-[24px]">
              <button 
                onClick={() => updateStudentProgress(student.id, 'success')}
                className="flex-1 lg:flex-none px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-md active:scale-95"
              >
                أتقن الحفظ ✅
              </button>
              <button 
                onClick={() => updateStudentProgress(student.id, 'review')}
                className="flex-1 lg:flex-none px-8 py-4 bg-white text-amber-600 border border-amber-100 rounded-2xl font-black text-sm hover:bg-amber-50 transition-all active:scale-95"
              >
                مراجعة 🔄
              </button>
              <button 
                onClick={() => updateStudentProgress(student.id, 'absent')}
                className="px-6 py-4 bg-white text-red-400 border border-red-50 rounded-2xl font-black text-sm hover:bg-red-50 hover:text-red-600 transition-all"
              >
                غائب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSessions;
