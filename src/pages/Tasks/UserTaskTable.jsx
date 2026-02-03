import { useEffect, useState } from "react";
import api from "../../Api/api";

function UserTaskTable({ onTaskUpdated }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ status: "pending" });

  const getTaskCode = (id) => `#TSK${id.slice(-3).toUpperCase()}`;

  const fetchTasks = async () => {
    const res = await api.get("/tasks/my-tasks");
    setTasks(res.data.data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdate = async () => {
    await api.put(`/tasks/${selectedTask._id}`, editData);
    setIsEditing(false);
    setSelectedTask(null);
    fetchTasks();
    onTaskUpdated(); //  refresh dashboard
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="hidden lg:inline lg:p-3 text-left">Task ID</th>
              <th className="lg:p-3 text-left">Title</th>
              <th className="lg:p-3 text-center">Assigned By</th>
              <th className="lg:p-3 text-center">Status</th>
              <th className="lg:p-3 text-center">Created On</th>
              <th className="lg:p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-b">
                <td className="hidden lg:inline lg:p-3 font-semibold">
                  {getTaskCode(task._id)}
                </td>
                <td className="p-3">{task.title}</td>
                <td className="p-3 text-center">
                  {task.createdBy?.fullName || "-"}
                </td>
                <td className="p-3 text-center capitalize">
                  <span
                    className={`lg:px-3 px-1 lg:py-1 rounded-md lg:rounded-full text-xs font-semibold ${
                      task.status === "pending"
                        ? "bg-orange-100 text-orange-600"
                        : task.status === "in-progress"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {new Date(task.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="p-3 text-center">
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded"
                    onClick={() => {
                      setSelectedTask(task);
                      setEditData({ status: task.status });
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {selectedTask && isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[360px] rounded-xl p-4 relative">
            <button
              onClick={() => {
                setSelectedTask(null);
                setIsEditing(false);
              }}
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <h3 className="mb-3">
              <span className="font-semibold">Title:</span> {selectedTask.title}
            </h3>

            <label className="font-semibold block mb-2">Update Status</label>
            <select
              className="w-full border p-2 rounded mb-3"
              value={editData.status}
              onChange={(e) => setEditData({ status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={handleUpdate}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserTaskTable;
