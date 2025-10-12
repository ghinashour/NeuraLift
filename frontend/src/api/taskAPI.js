import API from "./axios";

// Get all tasks
export const getTasks = async () => {
  const res = await API.get("/tasks");
  return res.data; // Backend returns tasks directly, not wrapped in a tasks property
};

// Add a new task
export const addTask = async (newTask) => {
  const res = await API.post("/tasks", newTask);
  return res.data;
};

// Update a task
export const updateTask = async (id, updates) => {
  const res = await API.put(`/tasks/${id}`, updates);
  return res.data;
};

// Delete a task
export const deleteTask = async (id) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};
