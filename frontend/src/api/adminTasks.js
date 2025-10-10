import API from "./axios"; // your configured axios instance

// Fetch tasks with optional filters
export const fetchTasks = async (params = {}) => {
  const response = await API.get("/admin/tasks", { params });
  return response.data;
};

// Update a task
export const updateTask = async (id, data) => {
  const response = await API.put(`/admin/tasks/${id}`, data);
  return response.data;
};

// Delete a task
export const deleteTask = async (id) => {
  const response = await API.delete(`/admin/tasks/${id}`);
  return response.data;
};

// Analytics
export const fetchTaskAnalytics = async () => {
  const response = await API.get("/admin/tasks/analytics/stats");
  return response.data;
};
