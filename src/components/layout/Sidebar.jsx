import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCompass,
  FaBookmark,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

export default function Sidebar({ open, onToggle }) {
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (onToggle) onToggle();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { to: "/", icon: FaHome, label: "Feed" },
    {
      to: user ? `/profile/${user.id}` : "/profile",
      icon: FaUser,
      label: "Profile",
      isInternal: true,
    },
    { to: "/explore", icon: FaCompass, label: "Explore" },
    { to: "/saved", icon: FaBookmark, label: "Saved" },
    { to: "/create-post", icon: FaPlus, label: "Create Post" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-800 to-gray-900 p-4 pr-6 z-50 w-[30%] md:w-[25%] md:max-w-[256px] lg:w-64 lg:max-w-none ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 transition-transform duration-300`}
      >
        {/* Header with Logo */}
        <div className="mb-8 pt-6">
          <NavLink to="/">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              SocioFeed
            </h1>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const className = `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.to ||
              (item.isInternal && location.pathname.startsWith("/profile"))
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`;

            return item.isInternal ? (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                className={`${className} w-full`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={className}
                onClick={onToggle}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-gray-600 w-full transition-all duration-200"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
