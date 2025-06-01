import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./../../components/main/Sidebar";
import { motion } from "framer-motion";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Header for Mobile */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-50">
        <IconButton onClick={toggleSidebar} aria-label="Toggle Sidebar">
          {isSidebarOpen ? (
            <CloseIcon sx={{ fontSize: 28 }} />
          ) : (
            <MenuIcon sx={{ fontSize: 28 }} />
          )}
        </IconButton>
        <h1 className="text-xl font-bold text-gray-900">SocioFeed</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Sidebar Wrapper */}
      <div className="md:w-64">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-4 md:p-6"
      >
        <Outlet />
      </motion.main>

      {/* Placeholder for What's Happening Sidebar */}
      <aside className="hidden md:block w-80 bg-white shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          What's Happening
        </h2>
        <p className="text-gray-500 text-sm">
          Placeholder for trending events, hashtags, and news.
        </p>
      </aside>
    </div>
  );
};

export default AppLayout;