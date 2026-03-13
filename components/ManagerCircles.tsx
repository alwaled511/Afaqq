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
    <div className="space-y-6 text-right animate-fadeIn" dir="rtl">
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-emerald-50">
        <h2 className="text-2xl font-black text-emerald-900">إدارة الحلقات</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg flex items-center gap-2"
        >
          <span className="text-xl">+</span> إنشاء حلقة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {circles.map((circle) => (
          <div key={circle.id} className="bg-white p-6 rounded-[32px] border border-emerald-50 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🕌</div>
              <div>
                <h3 className="font-black text-emerald-900 text-lg">{circle.name}</h3>
                <p className="text-[10px] text-gray-500 font-bold">{circle.type}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
              المعلم المكلف: {circle.teacherName || 'لم يحدد بعد'}
            </div>
          </div>
        ))}
        {circles.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400 font-bold">لا توجد حلقات مسجلة في هذا المسجد حالياً.</div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-emerald-900 mb-6 border-b pb-4">إنشاء حلقة جديدة</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 mr-2">اسم الحلقة</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 mt-1"
                  placeholder="مثال: حلقة ابن تيمية"
                  value={newCircle.name} onChange={e => setNewCircle({...newCircle, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 mr-2">مسار الحلقة</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none mt-1"
                  value={newCircle.type} onChange={e => setNewCircle({...newCircle, type: e.target.value})}
                >
                  <option>تلقين وحفظ</option>
                  <option>مراجعة وتثبيت</option>
                  <option>إقراء وإجازة</option>
                </select>
              </div>
              <button onClick={handleAddCircle} className="w-full py-5 bg-emerald-900 text-white rounded-[24px] font-black mt-6">اعتماد الحلقة</button>
              <button onClick={() => setShowAddModal(false)} className="w-full py-2 text-gray-400 font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerCircles;
