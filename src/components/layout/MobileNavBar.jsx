// components/layout/MobileNavBar.jsx
import {
  FaHome,
  FaUser,
  FaCompass,
  FaBookmark,
  FaComments,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function MobileNavBar({ onChatToggle }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center h-16 shadow-lg md:hidden">
      <button onClick={() => navigate("/")}>
        <FaHome />
      </button>
      <button onClick={() => navigate("/explore")}>
        <FaCompass />
      </button>
      <button onClick={() => navigate("/saved")}>
        <FaBookmark />
      </button>
      <button onClick={() => navigate(`/profile/${user.id}`)}>
        <FaUser />
      </button>
      <button onClick={onChatToggle}>
        <FaComments />
      </button>
    </nav>
  );
}
