import React, { useState, useEffect } from 'react';

interface ManagerCirclesProps {
  selectedMosque: string;
}

const ManagerCircles: React.FC<ManagerCirclesProps> = ({ selectedMosque }) => {
  const [circles, setCircles] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCircle, setNewCircle] = useState({ name: '', type: 'تلقين وحفظ', teacherName: '' });

  useEffect(() => {
    const allCircles = JSON.parse(localStorage.getItem('afaq_circles') || '[]');
    setCircles(allCircles.filter((c: any) => c.mosqueId === selectedMosque));
  }, [selectedMosque]);

  const handleAddCircle = () => {
    if (newCircle.name) {
      const allCircles = JSON.parse(localStorage.getItem('afaq_circles') || '[]');
      const circleData = { ...newCircle, id: Date.now(), mosqueId: selectedMosque };
      const updated = [...allCircles, circleData];
      
      localStorage.setItem('afaq_circles', JSON.stringify(updated));
      setCircles(updated.filter((c: any) => c.mosqueId === selectedMosque));
      setShowAddModal(false);
      setNewCircle({ name: '', type: 'تلقين وحفظ', teacherName: '' });
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6 text-right animate-fadeIn" dir="rtl">
      {/* رأس الصفحة الممتد */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-emerald-50 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">إدارة الحلقات القرآنية</h2>
          <p className="text-xs text-gray-400 font-bold mt-1">يمكنك إضافة وإدارة الحلقات التابعة للمسجد الحالي</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-800 transition-all shadow-xl"
        >
          + إنشاء حلقة جديدة
        </button>
      </div>

      {/* شبكة الحلقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circles.map((circle) => (
          <div key={circle.id} className="bg-white p-6 rounded-[32px] border border-emerald-50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🕌</div>
              <div>
                <h3 className="font-black text-emerald-900 text-lg">{circle.name}</h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] px-3 py-1 rounded-full font-black">{circle.type}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 font-black mb-1">المعلم المسؤول:</p>
              <p className="text-sm font-bold text-emerald-800">{circle.teacherName || 'لم يتم التعيين'}</p>
            </div>
          </div>
        ))}
        {circles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-black">لا توجد حلقات مسجلة لهذا المسجد، ابدأ بإنشاء واحدة!</p>
          </div>
        )}
      </div>

      {/* نافذة إضافة حلقة (Modal) - مصلحة تماماً */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-8 shadow-2xl animate-scaleIn">
            <h3 className="text-2xl font-black text-emerald-900 mb-6 pb-4 border-b border-gray-100">إضافة حلقة للمسجد</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 mr-1">اسم الحلقة</label>
                <input 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  placeholder="مثال: حلقة الإخلاص"
                  value={newCircle.name} onChange={e => setNewCircle({...newCircle, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 mr-1">مسار الحفظ</label>
                <select 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold"
                  value={newCircle.type} onChange={e => setNewCircle({...newCircle, type: e.target.value})}
                >
                  <option>تلقين وحفظ</option>
                  <option>مراجعة وتثبيت</option>
                  <option>إقراء وإجازة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 mr-1">اسم المعلم (اختياري)</label>
                <input 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold"
                  placeholder="اسم المعلم المسؤول"
                  value={newCircle.teacherName} onChange={e => setNewCircle({...newCircle, teacherName: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleAddCircle} className="flex-1 py-4 bg-emerald-900 text-white rounded-2xl font-black shadow-lg">تأكيد الإنشاء</button>
                <button onClick={() => setShowAddModal(false)} className="px-6 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerCircles;
