import React from "react";

const SubmitButton = ({ isLoading, text, onClick }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Posting...
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
