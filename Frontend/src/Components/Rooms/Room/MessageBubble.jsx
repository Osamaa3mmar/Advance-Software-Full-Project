/* eslint-disable react/prop-types */
export default function MessageBubble({ currentUser, message }) {
  const isMe = currentUser?.id === message.senderId;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
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
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
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
              {message.content}
            </p>
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
        </div>
      </div>
    </div>
  );
}
