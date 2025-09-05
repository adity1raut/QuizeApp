import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const StatusMessages = ({ error, success, setError, setSuccess }) => {
  return (
    <>
      {error && (
        <div className="flex items-center bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
          <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-400 hover:text-red-300 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6">
          <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
          <span className="flex-1">{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-2 text-green-400 hover:text-green-300 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default StatusMessages;
