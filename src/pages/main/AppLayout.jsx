import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Chat from "../../components/main/Chat";
import MobileNavigation from "../../components/main/MobileNavigation";
import ProfilePage from "../user/ProfilePage";
import { motion } from "framer-motion";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

const AppLayout = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(
    window.innerWidth >= 768,
  );
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024,
  );
  console.log(isTablet);

  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);

      if (!mobile) {
        setIsLeftSidebarOpen(true);
      } else {
        setIsLeftSidebarOpen(false);
      }

      if (mobile || tablet) {
        setIsRightSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const toggleLeftSidebarCollapse = () => {
    setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
  };

  const renderMainContent = () => {
    if (isProfilePage) {
      return <ProfilePage />;
    }
    return <Outlet />;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-50">
        <IconButton onClick={toggleLeftSidebar} aria-label="Toggle Sidebar">
          {isLeftSidebarOpen ? (
            <CloseIcon sx={{ fontSize: 28 }} />
          ) : (
            <MenuIcon sx={{ fontSize: 28 }} />
          )}
        </IconButton>
        <h1 className="text-xl font-bold text-gray-900">SocioFeed</h1>
        <IconButton onClick={toggleRightSidebar} aria-label="Toggle Chat">
          <ChatIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </header>

      {/* Left Sidebar */}
      <div
        className={`${isLeftSidebarCollapsed ? "md:w-20" : "md:w-64"} transition-all duration-300`}
      >
        <Sidebar
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={toggleLeftSidebarCollapse}
        />
      </div>

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex-1 flex justify-center p-4 md:p-6 transition-all duration-300 ${
          isMobile ? "pb-20" : ""
        }`}
      >
        <div
          className="w-full"
          style={{
            maxWidth: isMobile
              ? "100%"
              : isLeftSidebarOpen && isRightSidebarOpen
                ? "calc(100% - 384px)" // 256 (left) + 320 (right)
                : isLeftSidebarOpen
                  ? isLeftSidebarCollapsed
                    ? "calc(100% - 80px)" // 80 (collapsed left)
                    : "calc(100% - 256px)" // 256 (expanded left)
                  : isRightSidebarOpen
                    ? "calc(100% - 320px)" // 320 (right)
                    : "100%",
          }}
        >
          {renderMainContent()}
        </div>
      </motion.main>

      {/* Right Sidebar (Chat) - Desktop */}
      {!isMobile && (
        <div
          className={`${isRightSidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden`}
        >
          <Chat
            isOpen={isRightSidebarOpen}
            onClose={() => setIsRightSidebarOpen(false)}
          />
        </div>
      )}

      {/* Right Sidebar (Chat) - Mobile */}
      {isMobile && isRightSidebarOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed inset-0 z-50 bg-gray-100"
        >
          <Chat
            isOpen={isRightSidebarOpen}
            onClose={() => setIsRightSidebarOpen(false)}
          />
        </motion.div>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation
          onToggleLeftSidebar={toggleLeftSidebar}
          onToggleRightSidebar={toggleRightSidebar}
        />
      )}

      {/* Floating Chat Button */}
      {!isMobile && !isRightSidebarOpen && (
        <button
          onClick={toggleRightSidebar}
          className="fixed right-0 top-4 w-12 h-12 bg-green-500 text-white rounded-l-lg shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center z-40"
          title="Open Chat"
        >
          <ChatIcon />
        </button>
      )}
    </div>
  );
};

export default AppLayout;
