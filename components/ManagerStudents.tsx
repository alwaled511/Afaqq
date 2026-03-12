import React, { useState, useEffect } from 'react';

interface ManagerStudentsProps {
  selectedMosque: string;
}

const ManagerStudents: React.FC<ManagerStudentsProps> = ({ selectedMosque }) => {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem('afaq_students') || '[]');
    // فلترة الطلاب بناءً على معرف المسجد
    const filtered = allStudents.filter((s: any) => s.mosqueId === selectedMosque);
    setStudents(filtered);
  }, [selectedMosque]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-emerald-900">شؤون الطلاب</h2>
          <p className="text-sm text-gray-500">قائمة الطلاب المسجلين في هذا المسجد</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-emerald-50 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-emerald-50/50">
            <tr>
              <th className="p-6 text-sm font-black text-emerald-900">الطالب</th>
              <th className="p-6 text-sm font-black text-emerald-900">الحلقة</th>
              <th className="p-6 text-sm font-black text-emerald-900">المستوى</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map((student) => (
              <tr key={student.id} className="border-t border-emerald-50">
                <td className="p-6 font-bold text-gray-700">{student.name}</td>
                <td className="p-6 text-sm text-gray-500">{student.circleName}</td>
                <td className="p-6"><span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">{student.level}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="p-20 text-center text-gray-400 font-bold">لا يوجد طلاب في هذا المسجد حالياً</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerStudents;
