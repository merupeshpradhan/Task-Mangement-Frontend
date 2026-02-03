import { useEffect, useState } from "react";
import api from "../../Api/api";
import { FaTasks } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import UserTaskTable from "./UserTaskTable";

/* ===============================
   DASHBOARD COMPONENT
================================ */
function TaskManagement() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "pending",
  });

  const [users, setUsers] = useState([]);

  /* ===============================
     FETCH STATS
  ================================ */
  const fetchStats = async () => {
    try {
      const url = isAdmin ? "/tasks" : "/tasks/my-tasks";
      const res = await api.get(url);
      const tasks = res.data.data || [];

      setStats({
        total: tasks.length,
        pending: tasks.filter(t => t.status === "pending").length,
        completed: tasks.filter(t => t.status === "completed").length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isAdmin]);

  /* ===============================
     FETCH USERS (ADMIN)
  ================================ */
  useEffect(() => {
    if (!isAdmin) return;
    api.get("/users").then(res => {
      setUsers(res.data.data || []);
    });
  }, [isAdmin]);

  /* ===============================
     CREATE TASK
  ================================ */
  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedTo) {
      return alert("Title & Assigned user required");
    }

    try {
      await api.post("/tasks", newTask);
      setShowCreatePanel(false);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        status: "pending",
      });
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="lg:p-6">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Tasks" value={stats.total} color="bg-blue-500" />
        <StatCard title="Pending" value={stats.pending} color="bg-orange-500" />
        <StatCard title="Completed" value={stats.completed} color="bg-green-500" />
      </div>

      {/* ADMIN ACTIONS */}
      {isAdmin && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Link
            to="/alltasks"
            className="bg-white p-5 rounded-xl shadow flex gap-4 items-center"
          >
            <FaTasks size={22} />
            <div>
              <h4 className="font-semibold">All Tasks</h4>
              <p className="text-sm text-gray-500">Manage tasks</p>
            </div>
          </Link>

          <button
            onClick={() => setShowCreatePanel(true)}
            className="bg-white p-5 rounded-xl shadow flex gap-4 items-center"
          >
            <IoAddCircleOutline size={22} />
            <div>
              <h4 className="font-semibold">Create Task</h4>
              <p className="text-sm text-gray-500">Assign new task</p>
            </div>
          </button>
        </div>
      )}

      {/* USER TABLE */}
      {!isAdmin && (
        <UserTaskTable onTaskUpdated={fetchStats} />
      )}

      {/* CREATE MODAL */}
      {showCreatePanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[360px] rounded-xl p-5 relative">
            <button
              onClick={() => setShowCreatePanel(false)}
              className="absolute top-3 right-3 text-lg"
            >
              ✕
            </button>

            <h3 className="font-semibold mb-4">Create Task</h3>

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Title"
              value={newTask.title}
              onChange={e =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />

            <textarea
              className="w-full border p-2 mb-2 rounded"
              placeholder="Description"
              rows="3"
              value={newTask.description}
              onChange={e =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />

            <select
              className="w-full border p-2 mb-3 rounded"
              value={newTask.assignedTo}
              onChange={e =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
              }
            >
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.fullName}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateTask}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManagement;

/* ===============================
   STAT CARD
================================ */
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
      <div className={`h-2 mt-3 rounded ${color}`} />
    </div>
  );
}
