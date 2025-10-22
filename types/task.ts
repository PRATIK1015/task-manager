export default interface TaskData {
    id: string;
    title: string;
    status: "Todo" | "InProgress" | "Completed";
    projectId: string;
    dueDate?: string;
  }