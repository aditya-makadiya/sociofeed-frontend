import React from "react";
import {
  Menu as MenuIcon,
  Chat as ChatIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const MobileNavigation = ({ onToggleLeftSidebar, onToggleRightSidebar }) => {
  return (
    <>
      {/* Floating Action Buttons */}
      <div className="md:hidden fixed bottom-6 left-4 z-40">
        <button
          onClick={onToggleLeftSidebar}
          className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <MenuIcon />
        </button>
      </div>

      <div className="md:hidden fixed bottom-6 right-4 z-40">
        <button
          onClick={onToggleRightSidebar}
          className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <ChatIcon />
        </button>
      </div>

      {/* Alternative: Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={onToggleLeftSidebar}
            className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-blue-500"
          >
            <MenuIcon fontSize="small" />
            <span className="text-xs">Menu</span>
          </button>

          <button className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-blue-500">
            <AddIcon fontSize="small" />
            <span className="text-xs">Post</span>
          </button>

          <button
            onClick={onToggleRightSidebar}
            className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-green-500"
          >
            <ChatIcon fontSize="small" />
            <span className="text-xs">Chat</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default MobileNavigation;
