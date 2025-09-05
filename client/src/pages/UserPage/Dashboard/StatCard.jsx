import React from "react";

const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-900/20 text-blue-300 border-blue-700/30",
    green: "bg-green-900/20 text-green-300 border-green-700/30",
    purple: "bg-purple-900/20 text-purple-300 border-purple-700/30",
    orange: "bg-orange-900/20 text-orange-300 border-orange-700/30",
    red: "bg-red-900/20 text-red-300 border-red-700/30",
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow hover:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
