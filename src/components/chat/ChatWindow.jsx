// components/chat/ChatWindow.jsx (pseudo-code)
const ChatWindow = ({ onBack }) => (
  <div>
    <div className="flex items-center gap-3 p-3 bg-gray-800 text-white">
      <button onClick={onBack} className="hover:bg-gray-700 p-2 rounded-lg">
      </button>
      <h3 className="text-lg font-medium">Chat Name</h3>
    </div>
  </div>
);

export default ChatWindow;
