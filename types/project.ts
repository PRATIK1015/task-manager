import TaskData  from "./task";

export interface ProjectData {
  id: string;             
  name: string;           
  description?: string;   
  tasks?: TaskData[];     
}
