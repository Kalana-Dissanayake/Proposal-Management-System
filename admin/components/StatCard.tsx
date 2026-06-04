import React from 'react';

export default function StatCard({ title, value, color, icon }: { title: string; value: number | string; color: string; icon?: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between`}>
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">{title}</p>
        <h3 className={`text-3xl font-bold mt-2 text-${color}`}>{value}</h3>
      </div>
      {icon && <div className={`text-${color} opacity-80 text-4xl`}>{icon}</div>}
    </div>
  );
}
