import http from "../http";

export interface DashboardProjectData {
  id: string;
  totalTask: number;
  todo: number;
  inProcess: number;
  completed: number;
  name: string
}

export interface DashboardData {
  users: number;
  projects: DashboardProjectData[];
}

const BASE_PATH = "/api/dashboard";

export const getDashboardData = async (): Promise<DashboardData> => {

  const response = await http.get(BASE_PATH);

  return response;
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;
