/* eslint-disable react/prop-types */
export default function ChatInputBox({ input, setInput, onSend, onEndCall }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4 shadow-lg">
      <div className="flex gap-3 items-center">
        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="w-11 h-11 bg-linear-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <i className="pi pi-phone text-sm rotate-135"></i>
        </button>

        {/* Input Field */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-200 rounded-full focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200 text-sm placeholder-slate-400 shadow-inner"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={!input.trim()}
          className="w-11 h-11 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
        >
          <i className="pi pi-send text-sm"></i>
        </button>
      </div>
    </div>
  );
}
