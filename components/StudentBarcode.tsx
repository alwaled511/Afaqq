
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const StudentBarcode: React.FC = () => {
  const [studentId, setStudentId] = useState('STU-' + Math.floor(1000 + Math.random() * 9000));
  const [studentName, setStudentName] = useState('طالب آفاق');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const savedStudents = localStorage.getItem('afaq_students');
    if (savedStudents) {
      const students = JSON.parse(savedStudents);
      const current = students[0];
      if (current) {
        setStudentName(current.name);
        if (current.id) setStudentId(current.id);
      }
    }
  }, []);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          setIsScanning(false);
          if (scanner) scanner.clear();
        },
        (error) => {
          // console.warn(error);
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    };
  }, [isScanning]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 text-right">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* بطاقة الطالب والباركود */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-6 print:shadow-none print:border-none print:p-0">
          <div className="w-full flex justify-between items-center mb-4 print:hidden">
            <h3 className="text-2xl font-black text-slate-800">بطاقة الهوية الرقمية</h3>
            <button 
              onClick={handlePrint}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>🖨️</span> طباعة الباركود
            </button>
          </div>

          <div className="p-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center space-y-6 w-full max-w-sm mx-auto print:bg-white print:border-solid print:border-slate-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-2">👤</div>
            <div>
              <h4 className="text-xl font-black text-slate-800">{studentName}</h4>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">طالب بمنصة آفاق</p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 print:shadow-none">
              <QRCodeSVG value={studentId} size={180} level="H" includeMargin={true} />
            </div>
            
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Student ID</p>
              <p className="text-lg font-mono font-bold text-emerald-700">{studentId}</p>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm max-w-xs mx-auto print:hidden">
            استخدم هذا الباركود لتسجيل الحضور في الحلقات الحضورية أو لمشاركة ملفك مع المعلمين.
          </p>
        </div>

        {/* ماسح الباركود */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col space-y-6 print:hidden">
          <h3 className="text-2xl font-black text-slate-800">ماسح الباركود</h3>
          
          {!isScanning ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
              <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center text-5xl animate-pulse">📷</div>
              <div className="text-center space-y-2">
                <h4 className="text-lg font-bold text-slate-700">افتح الكاميرا للمسح</h4>
                <p className="text-sm text-slate-400 max-w-xs">يمكنك مسح باركود الحلقات أو باركود المعلمين للانضمام السريع.</p>
              </div>
              <button 
                onClick={() => setIsScanning(true)}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-3"
              >
                <span>🔍</span> تشغيل الكاميرا
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div id="reader" className="overflow-hidden rounded-3xl border-4 border-emerald-100"></div>
              <button 
                onClick={() => setIsScanning(false)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
              >
                إلغاء المسح
              </button>
            </div>
          )}

          {scanResult && (
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl animate-scaleIn">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xl">✅</span>
                <h4 className="font-black text-emerald-900">تم المسح بنجاح</h4>
              </div>
              <p className="text-sm text-emerald-700 font-mono break-all bg-white/50 p-3 rounded-xl mt-2">
                {scanResult}
              </p>
              <button 
                onClick={() => setScanResult(null)}
                className="mt-4 text-xs font-bold text-emerald-600 hover:underline"
              >
                مسح نتيجة أخرى
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex flex-col md:flex-row items-center gap-8 print:hidden">
        <div className="text-4xl">💡</div>
        <div className="flex-1 text-center md:text-right">
          <h4 className="text-lg font-black text-amber-900 mb-1">نصيحة تقنية</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            يمكنك طباعة الباركود الخاص بك ولصقه على مصحفك الخاص أو حقيبتك، ليتمكن المعلم من تحضيرك بسرعة بمجرد توجيه الكاميرا نحوه.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentBarcode;
