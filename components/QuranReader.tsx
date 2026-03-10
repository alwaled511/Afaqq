
import React, { useState } from 'react';
import { SURAHS } from '../constants';

const QuranReader: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState(SURAHS[0]);
  const [fontSize, setFontSize] = useState(32);
  
  const fatihahVerses = [
    { number: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
    { number: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
    { number: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ" },
    { number: 4, text: "مَالِكِ يَوْمِ الدِّينِ" },
    { number: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
    { number: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
    { number: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" }
  ];

  return (
    <div className="flex h-full gap-8 animate-fadeIn">
      {/* قائمة السور */}
      <div className="w-72 bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 bg-emerald-50 border-b">
          <input 
            type="text" 
            placeholder="بحث عن سورة..." 
            className="w-full px-5 py-3 rounded-xl border-none focus:ring-4 focus:ring-emerald-500/10 bg-white text-sm font-bold shadow-sm text-right"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {SURAHS.map((surah) => (
            <button
              key={surah.id}
              onClick={() => setSelectedSurah(surah)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                selectedSurah.id === surah.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black ${selectedSurah.id === surah.id ? 'bg-emerald-500' : 'bg-slate-100 text-slate-500'}`}>
                  {surah.id}
                </span>
                <span className="text-base font-black quran-font">{surah.name}</span>
              </div>
              <span className={`text-[10px] font-bold opacity-60 ${selectedSurah.id === surah.id ? 'text-white' : ''}`}>{surah.versesCount} آية</span>
            </button>
          ))}
        </div>
      </div>

      {/* منطقة القراءة */}
      <div className="flex-1 bg-white rounded-[56px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-8 border-b flex items-center justify-between bg-slate-50/30">
          <div className="text-right">
            <h2 className="text-3xl font-black text-emerald-900 mb-1 quran-font">سورة {selectedSurah.name}</h2>
            <p className="text-sm text-slate-500 font-medium">{selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {selectedSurah.versesCount} آية</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-white rounded-xl text-slate-600 text-sm font-black transition-all border border-slate-200 shadow-sm flex items-center gap-2">
              <span>🎧</span> استماع
            </button>
            <button className="px-5 py-3 bg-white rounded-xl text-slate-600 text-sm font-black transition-all border border-slate-200 shadow-sm flex items-center gap-2">
              <span>📝</span> تفسير
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 bg-[#FDFDFD]">
          <div className="max-w-3xl mx-auto space-y-10 text-center">
            {selectedSurah.id !== 9 && selectedSurah.id !== 1 && (
              <div className="text-4xl mb-12 quran-font text-slate-800 font-bold opacity-80 leading-relaxed">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            )}
            
            <div 
              className="flex flex-wrap justify-center gap-y-12 gap-x-6 quran-font text-slate-900 leading-[1.8]"
              style={{ fontSize: `${fontSize}px` }}
            >
              {fatihahVerses.map((verse) => (
                <div key={verse.number} className="inline group cursor-pointer hover:text-emerald-700 transition-colors duration-300">
                  <span className="tracking-wide">{verse.text}</span>
                  <span className="inline-flex items-center justify-center w-12 h-12 mx-4 rounded-full border-2 border-amber-300 text-lg text-amber-600 select-none font-bold align-middle group-hover:scale-110 transition-all">
                    {verse.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* شريط التحكم السفلي */}
        <div className="p-8 bg-slate-50 border-t flex flex-wrap justify-center items-center gap-8">
           <div className="flex flex-col items-center gap-2 bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-200 min-w-[320px]">
              <div className="flex justify-between w-full mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تعديل حجم الخط</span>
                <span className="text-sm font-black text-emerald-700">{fontSize}px</span>
              </div>
              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={() => setFontSize(Math.max(20, fontSize - 2))} 
                  className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 font-black transition-all active:scale-90"
                >
                  ➖
                </button>
                <input 
                  type="range" 
                  min="20" 
                  max="80" 
                  step="1"
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <button 
                  onClick={() => setFontSize(Math.min(80, fontSize + 2))} 
                  className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 font-black transition-all active:scale-90"
                >
                  ➕
                </button>
              </div>
           </div>
           
           <button className="bg-emerald-600 text-white px-10 py-5 rounded-[24px] text-sm font-black hover:bg-emerald-700 shadow-xl shadow-emerald-100 active:scale-95 transition-all flex items-center gap-3">
             <span className="text-lg">🎙️</span> بدء وضع المراجعة الذكية
           </button>
        </div>
      </div>
    </div>
  );
};

export default QuranReader;
