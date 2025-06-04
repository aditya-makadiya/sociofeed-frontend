// components/layout/ChatSidebar.jsx
import React, { useState } from "react";
import ChatList from "../chat/ChatList";
import ChatWindow from "../chat/ChatWindow";
import useAuth from "../../hooks/useAuth";

export default function ChatSidebar({ open, onToggle }) {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Handle chat selection from ChatList
  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  // Handle back to chat list
  const handleBackToList = () => {
    setSelectedChatId(null);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Chat Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-gradient-to-b from-gray-800 to-gray-900 p-4 pl-6 z-50 w-[30%] md:w-[25%] md:max-w-[320px] lg:w-80 lg:max-w-none ${
          open ? "translate-x-0" : "translate-x-full"
        } md:static md:translate-x-0 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="mb-6 pt-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Messages</h2>
          <button
            className="md:hidden text-white hover:bg-gray-700 p-2 rounded-lg"
            onClick={onToggle}
            aria-label="Close chat sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content: ChatList or ChatWindow */}
        <div className="flex-1 overflow-y-auto">
          {selectedChatId ? (
            <ChatWindow
              chatId={selectedChatId}
              userId={user?.id}
              onBack={handleBackToList}
            />
          ) : (
            <ChatList onSelectChat={handleSelectChat} userId={user?.id} />
          )}
        </div>
      </aside>
    </>
  );
}
