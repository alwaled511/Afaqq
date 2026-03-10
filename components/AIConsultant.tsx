
import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistance } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'أهلاً بك يا بني في رحلة النور. أنا مشرفك الافتراضي في منصة آفاق، أعمل بمنهجية منصة خليل المباركة.\n\nيمكنني مساعدتك في وضع خطة محكمة (حفظ جديد، مراجعة قريبة، مراجعة بعيدة) أو تفسير الآيات.\n\nإذا كنت ترغب في البدء، أخبرني: "أريد تسجيل طالب" لنبدأ الرحلة معاً.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    const responseText = await getAIAssistance(input);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[56px] shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
      <div className="p-8 bg-emerald-800 text-white flex items-center gap-5 shadow-xl">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-emerald-500/20">🕌</div>
        <div>
          <h2 className="text-2xl font-black quran-font">المشرف الافتراضي</h2>
          <p className="text-emerald-200 text-[10px] font-bold opacity-80 uppercase tracking-widest mt-0.5">منهجية منصة خليل • آفاق</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
            <div className={`max-w-[90%] p-6 rounded-[32px] text-lg leading-relaxed shadow-sm prose prose-slate ${
              msg.role === 'user' 
              ? 'bg-emerald-600 text-white rounded-br-none' 
              : 'bg-white text-slate-800 rounded-bl-none border border-slate-100 shadow-md whitespace-pre-wrap'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-white p-5 rounded-[24px] rounded-bl-none border border-slate-100 shadow-sm flex gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-slate-100 shadow-xl">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-3xl border border-slate-100 focus-within:border-emerald-500 focus-within:bg-white transition-all duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب: أريد تسجيل طالب أو اطلب خطة دراسية..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-base font-bold text-slate-800"
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-emerald-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl hover:bg-emerald-700 transition-all shadow-lg active:scale-90">✈️</button>
        </div>
        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4">نظام آفاق التعليمي المطور</p>
      </div>
    </div>
  );
};

export default AIConsultant;
