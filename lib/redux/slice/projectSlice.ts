import { getTaskProjectId } from "@/client-lib/service/project-service";
import TaskData from "@/types/task";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ProjectTaskState {
    tasks: TaskData[];
    loading: boolean;
    error: string | null;
    projectId: string | null;
}

const initialState: ProjectTaskState = {
    tasks: [],
    loading: false,
    error: null,
    projectId: null,
};

export const fetchTasksByProject = createAsyncThunk<
    TaskData[],
    string,
    { rejectValue: string }
>("projectTasks/fetchTasksByProject", async (projectId, { rejectWithValue }) => {
    try {
        const data = await getTaskProjectId(projectId);
        return data;
    } catch (err: any) {
        return rejectWithValue(err?.message || "Failed to fetch tasks for project");
    }
});

const projectTaskSlice = createSlice({
    name: "projectTasks",
    initialState,
    reducers: {
        resetProjectTasks: (state) => {
            state.tasks = [];
            state.loading = false;
            state.error = null;
            state.projectId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasksByProject.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.projectId = action.meta.arg; 
            })
            .addCase(fetchTasksByProject.fulfilled, (state, action: PayloadAction<TaskData[]>) => {
                state.tasks = action.payload;
                state.loading = false;
            })
            .addCase(fetchTasksByProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch tasks for project";
            });
    },
});

export const { resetProjectTasks } = projectTaskSlice.actions;
export default projectTaskSlice.reducer;
