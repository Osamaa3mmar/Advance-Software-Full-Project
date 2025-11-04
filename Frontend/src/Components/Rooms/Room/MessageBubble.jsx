/* eslint-disable react/prop-types */
export default function MessageBubble({ currentUser, message }) {
  const isMe = currentUser?.id === message.senderId;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4 px-4`}>
      <div
        className={`flex ${
          isMe ? "flex-row-reverse" : "flex-row"
        } items-end gap-2 max-w-[75%]`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
            isMe ? "bg-blue-500" : "bg-gray-500"
          }`}
        >
          {message.senderDisplayName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
          {/* Sender Name (only for others) */}
          {!isMe && (
            <span className="text-xs text-gray-500 mb-1 px-3">
              {message.senderDisplayName}
            </span>
          )}

          {/* Message Bubble */}
          <div
            className={`
            px-4 py-2 rounded-2xl max-w-full shadow-sm
            ${
              isMe
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
            }
          `}
          >
            <p className="text-sm leading-relaxed wrap-break-word">
              {message.content}
            </p>
          </div>

          {/* Timestamp */}
          <span
            className={`text-xs text-gray-400 mt-1 px-3 ${
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
