import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistance = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `أنت 'المشرف الافتراضي' في منصة آفاق، تعمل بمنهجية منصة خليل لتحفيظ القرآن الكريم.
يجب أن تلتزم بالقواعد التالية في كل ردودك:
1. تصنيف المنهج دائماً إلى: (حفظ جديد، مراجعة قريبة/صغرى، مراجعة بعيدة/كبرى).
2. عند وضع خطة، اجعلها لـ 6 أيام تبدأ من يوم الأحد، ويوم الجمعة مخصص للمراجعة الحرة أو الراحة.
3. اعرض أي خطة دراسية في جدول "Markdown" منظم وواضح.
4. إذا طلب المستخدم "تسجيل طالب"، يجب أن تطلب منه البيانات التالية: (الاسم، المحفوظ الحالي، الهدف اليومي، والمدة المطلوبة للختم).
5. لغة الخطاب: تربوية، محفزة، واضحة، ومليئة بالدعاء والتفاؤل.
6. بناء الخطط بناءً على هدف الطالب (ختم سريع، ختم متأنٍ، أو عدد صفحات محدد).`,
        temperature: 0.6,
      }
    });
    return response.text || "عذراً، حدث خطأ في معالجة الطلب. يرجى إعادة المحاولة.";
  } catch (error) {
    console.error("AI Error:", error);
    return "حدث خطأ في الاتصال بالمشرف الافتراضي، يرجى المحاولة لاحقاً.";
  }
};

export const getRecitationFeedback = async (audioBase64: string, verseText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: audioBase64, mimeType: 'audio/pcm;rate=16000' } },
          { text: `كخبير تجويد، حلل قراءة الطالب لهذه الآية: "${verseText}". ركز على مخارج الحروف والمدود الطبيعية.` }
        ]
      }
    });
    return response.text || "لم أتمكن من تحليل الصوت بدقة هذه المرة.";
  } catch (error) {
    console.error("Audio Analysis Error:", error);
    return "خطأ في معالجة تحليل الصوت.";
  }
};