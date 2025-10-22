import http from "../http";
import { TaskData } from "./task-service";

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  tasks?: TaskData[];
}

const BASE_PATH = "/api/projects";

export const getProjects = async (): Promise<ProjectData[]> => {

  const response = await http.get(BASE_PATH);

  return response;
};

export const createProject = async (data: { name: string; description?: string }): Promise<ProjectData> => {

  const response = await http.post(BASE_PATH, {
    body: data,
  });

  return response.result;
};

export const getTaskProjectId = async (projectId: string) => {

  const response = await http.get(`/api/projects/${projectId}`, {
  });

  return response;
};

const projectService = {
  getProjects,
  createProject,
  getTaskProjectId
};

export default projectService;
