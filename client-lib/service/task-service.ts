import http from "../http";

export interface TaskData {
  id: string;
  title: string;
  status: "Todo" | "InProgress" | "Completed";
  projectId: string;
  dueDate?: string;
}

const BASE_PATH = "/api/tasks";

export const addTask = async (data: { projectId: string; title: string, dueDate?: any }): Promise<TaskData> => {

  const response = await http.post(BASE_PATH, { body: data });

  return response.result;
};


export const updateTask = async (taskId: string, data: Partial<{ title: string; status: string; dueDate?: string }>): Promise<TaskData> => {

  const response = await http.put(`${BASE_PATH}/${taskId}`, {
    body: data,
  });

  return response.result;
};

export const deleteTask = async (taskId: string): Promise<void> => {

  await http.delete(`${BASE_PATH}/${taskId}`);
};

export const getTasksByProject = async (projectId: string): Promise<TaskData[]> => {

  const response = await http.get(`/api/tasks?projectId=${projectId}`);

  return response;
};

const taskService = {
  addTask,
  updateTask,
  deleteTask,
  getTasksByProject
};

export default taskService;
