import React from "react";

const ScoreChip = ({ score, label, size = "default" }) => {
  const getColorClass = (score) => {
    if (score >= 90) return "bg-green-800";
    if (score >= 70) return "bg-blue-700";
    if (score >= 50) return "bg-orange-600";
    return "bg-red-700";
  };

  const sizeClass = size === "small" ? "px-2 py-1 text-xs" : "px-3 py-1";

  return (
    <span
      className={`${getColorClass(score)} ${sizeClass} text-white font-bold rounded-full inline-flex items-center justify-center`}
    >
      {label}
    </span>
  );
};

export default ScoreChip;
