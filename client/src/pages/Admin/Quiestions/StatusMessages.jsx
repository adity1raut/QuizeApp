import React from "react";
import { X } from "lucide-react";

const StatusMessages = ({ error, success, setError, setSuccess }) => {
  return (
    <>
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
};

export default StatusMessages;