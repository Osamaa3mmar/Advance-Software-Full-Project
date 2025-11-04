/* eslint-disable react/prop-types */
export default function ChatInputBox({ input, setInput, onSend, onEndCall }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <div className="bg-white border-t shadow-lg p-4">
      <div className="flex gap-3 items-end">
        <button
          onClick={onEndCall}
          className="w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all flex items-center justify-center"
        >
          <i className="pi pi-phone text-sm rotate-135"></i>
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-sm"
          />
        </div>

        <button
          onClick={onSend}
          disabled={!input.trim()}
          className="w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          <i className="pi pi-send text-sm"></i>
        </button>
      </div>
    </div>
  );
}
