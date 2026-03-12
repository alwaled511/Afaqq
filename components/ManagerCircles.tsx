import React, { useState, useEffect } from 'react';

interface ManagerCirclesProps {
  selectedMosque: string;
}

const ManagerCircles: React.FC<ManagerCirclesProps> = ({ selectedMosque }) => {
  const [circles, setCircles] = useState<any[]>([]);

  useEffect(() => {
    const allCircles = JSON.parse(localStorage.getItem('afaq_circles') || '[]');
    const filtered = allCircles.filter((c: any) => c.mosqueId === selectedMosque);
    setCircles(filtered);
  }, [selectedMosque]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-black text-emerald-900">إدارة الحلقات</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {circles.length > 0 ? circles.map((circle) => (
          <div key={circle.id} className="bg-white p-8 rounded-[32px] border border-emerald-50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-900 text-white rounded-2xl flex items-center justify-center text-2xl">🕌</div>
              <div>
                <h3 className="font-bold text-lg text-emerald-900">{circle.name}</h3>
                <p className="text-sm text-gray-400">معلم الحلقة: {circle.teacherName}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-emerald-100 text-gray-400 font-bold">
            لا توجد حلقات مضافة لهذا المسجد
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerCircles;
