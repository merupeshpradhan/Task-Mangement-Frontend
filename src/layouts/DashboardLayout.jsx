import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full lg:ml-[20vw] min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-3 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
