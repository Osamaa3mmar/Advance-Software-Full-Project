import axios from "axios";
import { useState } from "react";

/* eslint-disable react/prop-types */
export default function MessageBubble({ currentUser, message }) {
  const isMe = currentUser?.id === message.senderId;
  const [translate, setTranslate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const translation = async () => {
    if (translate) {
      setTranslate(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post("http://localhost:5555/api/translation", { message });
      setTranslate(data.translation);
    } catch (error) {
      console.log(error);
      setError("Translation failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3 group`}
    >
      <div
        className={`flex ${
          isMe ? "flex-row-reverse" : "flex-row"
        } items-end gap-2 max-w-[80%]`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md ${
            isMe
              ? "bg-linear-to-br from-blue-500 to-blue-600"
              : "bg-linear-to-br from-slate-400 to-slate-500"
          }`}
        >
          {message.senderDisplayName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Message Content */}
        <div
          className={`flex flex-col ${
            isMe ? "items-end" : "items-start"
          } flex-1`}
        >
          {/* Sender Name (only for others) */}
          {!isMe && (
            <span className="text-xs text-slate-500 mb-1 ml-3 font-medium">
              {message.senderDisplayName}
            </span>
          )}

          {/* Message Bubble */}
          <div
            className={`
            relative px-4 py-3 rounded-2xl max-w-full shadow-sm backdrop-blur-sm
            ${
              isMe
                ? "bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                : "bg-white/80 border border-slate-200/60 text-slate-800 rounded-bl-md"
            }
          `}
          >
            <p className="text-sm leading-relaxed wrap-break-word">
              {translate ? translate : message.content}
            </p>

            {/* Translate Button - Shows on hover */}
            <button
              onClick={translation}
              disabled={loading}
              className={`
                mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                transition-all duration-200 transform hover:scale-105 active:scale-95
                ${
                  isMe
                    ? "bg-white/20 hover:bg-white/30 text-white/90 hover:text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800"
                }
                ${
                  loading
                    ? "opacity-50 cursor-wait"
                    : "opacity-0 group-hover:opacity-100"
                }
                disabled:cursor-not-allowed
              `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-3 w-3"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Translating...</span>
                </>
              ) : translate ? (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Show Original</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <span>Translate</span>
                </>
              )}
            </button>
          </div>

          {/* Timestamp */}
          <span
            className={`text-xs text-slate-400 mt-1 mx-3 ${
              isMe ? "text-right" : "text-left"
            }`}
          >
            {new Date(message.timeStamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* Translation Error Message */}
          {error && (
            <span className="text-xs text-red-500 mt-1 mx-3">
              Translation failed. Please try again.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
