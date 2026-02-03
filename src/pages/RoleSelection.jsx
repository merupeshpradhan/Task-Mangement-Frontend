import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  const handleAdmin = () => {
    if (user.role !== "admin") {
      alert("You are not allowed to access Admin panel");
      return;
    }
    // navigate("/admin/dashboard");
    navigate("/taskmanagement");
  };

  const handleUser = () => {
    if (user.role !== "user") {
      alert("Admins are not allowed to continue as User");
      return;
    }
    navigate("/taskmanagement");
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT IMAGE */}
      <div className="w-1/2 bg-indigo-100 flex items-center justify-center">
        <img src="/Login.jpg" alt="role" className="w-full h-[99.9vh]" />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Choose Your Role
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Select how you want to use the dashboard
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* ADMIN CARD */}
            <div className="border rounded-xl p-5 shadow">
              <h3 className="font-semibold text-lg mb-2">Admin</h3>
              <ul className="text-sm text-gray-600 mb-4 list-disc ml-4">
                <li>Create tasks</li>
                <li>Assign tasks</li>
                <li>Manage users</li>
              </ul>

              <button
                onClick={handleAdmin}
                disabled={user.role !== "admin"}
                className={`w-full py-2 rounded
                  ${
                    user.role === "admin"
                      ? "bg-indigo-600 text-white cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Continue as Admin
              </button>
            </div>

            {/* USER CARD */}
            <div className="border rounded-xl p-5 shadow">
              <h3 className="font-semibold text-lg mb-2">User</h3>
              <ul className="text-sm text-gray-600 mb-4 list-disc ml-4">
                <li>View assigned tasks</li>
                <li>Update task status</li>
              </ul>

              <button
                onClick={handleUser}
                disabled={user.role !== "user"}
                className={`w-full py-2 rounded mt-5
                ${
                    user.role === "user"
                    ? "bg-indigo-600 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue as User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
