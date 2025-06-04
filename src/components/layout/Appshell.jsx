// components/layout/AppShell.jsx
import Sidebar from "./Sidebar";
import ChatSidebar from "./ChatSidebar";
import MobileNavBar from "./MobileNavBar";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import React, { useState } from "react";

export default function AppShell() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const isMedium = useMediaQuery("(max-width:1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [chatOpen, setChatOpen] = useState(!isMobile);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      {!isMobile && (
        <Sidebar
          open={sidebarOpen}
          onToggle={() => {
            setSidebarOpen(!sidebarOpen);
            if (chatOpen && isMobile) setChatOpen(false); // Close chat sidebar if open on mobile
          }}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex flex-col overflow-y-auto transition-all duration-300 ${
          isMobile
            ? sidebarOpen || chatOpen
              ? "w-[40%] opacity-50 pointer-events-none"
              : "w-full px-4 opacity-100 pointer-events-auto"
            : isMedium
              ? "w-[50%] px-4"
              : "flex-1 px-6"
        }`}
      >
        <Outlet />
      </main>

      {/* Right Chat Sidebar */}
      {!isMobile && (
        <ChatSidebar
          open={chatOpen}
          onToggle={() => {
            setChatOpen(!chatOpen);
            if (sidebarOpen && isMobile) setSidebarOpen(false); // Close left sidebar if open on mobile
          }}
        />
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavBar
          onSidebarToggle={() => {
            setSidebarOpen(!sidebarOpen);
            if (chatOpen) setChatOpen(false); // Close chat sidebar if open
          }}
          onChatToggle={() => {
            setChatOpen(!chatOpen);
            if (sidebarOpen) setSidebarOpen(false); // Close left sidebar if open
          }}
        />
      )}
    </div>
  );
}
