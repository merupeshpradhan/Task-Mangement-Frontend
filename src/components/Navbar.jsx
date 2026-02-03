import { useEffect, useState } from "react";
import SearchBar from "../pages/Tasks/SearchBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaTasks } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import api from "../Api/api";

function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const localSaveUser = JSON.parse(localStorage.getItem("user"));

  const isActive = (path) =>
    location.pathname === path
      ? "bg-pink-200 font-semibold"
      : "hover:bg-pink-100";

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateUser();
    window.addEventListener("userUpdated", updateUser);

    return () => window.removeEventListener("userUpdated", updateUser);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      navigate("/signin", { replace: true });
      window.location.reload(); // 🔥 ensures clean UI reset
    } catch (error) {
      console.error("Logout failed:", error?.response?.data || error.message);
    }
  };

  return (
    <nav className="h-14 bg-white border-b flex items-center justify-between px-1 lg:px-6">
      <SearchBar />
      <div className="flex lg:hidden">
        <Link
          to={
            localSaveUser?.role === "admin"
              ? "/taskmanagement"
              : "/taskmanagement"
          }
          className={`mx-3 flex items-center text-[12px] gap-1 px-1.5 py-0.5 rounded-md ${isActive(
            localSaveUser?.role === "admin"
              ? "/taskmanagement"
              : "/taskmanagement",
          )}`}
        >
          <RxDashboard size={10} />
          Dashboard
        </Link>

        {user?.role === "admin" && (
          <Link
            to="/alltasks"
            className={`mx-3 flex items-center text-[12px] gap-1 px-1.5 py-0.5 rounded-md -ml-2 ${isActive(
              "/alltasks",
            )}`}
          >
            <FaTasks />
            Tasks
          </Link>
        )}

      </div>

      <div className="flex items-center gap-2">
        <img
          src="/user-image.png"
          alt="user"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium ">
          {user?.fullName || "User"}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center px-1 gap-2 text-[12px] text-red-500 hover:bg-red-100 rounded-md lg:hidden"
        >
          <CiLogout />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
