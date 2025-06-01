import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/slices/authSlice";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Explore as ExploreIcon,
  Bookmark as BookmarkIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const NavItem = ({ to, icon: Icon, label, onClick, isActive }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
      isActive ? "bg-gray-700 font-bold" : "hover:bg-gray-600"
    } text-white`}
  >
    <Icon sx={{ fontSize: 20 }} />
    <span>{label}</span>
  </Link>
);

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    if (onClose) onClose();
  };

  const navItems = [
    { to: "/home", icon: HomeIcon, label: "Feed" },
    { to: "/profile", icon: PersonIcon, label: "Profile" },
    { to: "/explore", icon: ExploreIcon, label: "Explore" },
    { to: "/saved-posts", icon: BookmarkIcon, label: "Saved Posts" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`fixed md:static top-0 left-0 h-full w-4/5 md:w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-4 z-50 md:z-0 transform md:transform-none transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-8 pt-6">
          <Link to="/">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              SocioFeed
            </h1>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Logout (only if authenticated) */}
        {isAuthenticated && (
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-gray-600 w-full transition-all duration-200"
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;
