'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Container,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    fetchTasksByProject,
    resetProjectTasks,
} from '@/lib/redux/slice/projectSlice';
import taskService from '@/client-lib/service/task-service';
import CreateTaskModal from '@/components/global/createTaskModal';
import { useAlert } from '@/lib/redux/slice/alertSlice';
import { Edit as EditIcon, CalendarToday as CalendarTodayIcon } from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';

const ProjectDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id;
    const { showAlertMessage } = useAlert();
    const [editingTask, setEditingTask] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);

    const dispatch = useAppDispatch();
    const { tasks, loading, error } = useAppSelector((state:any) => state.projectTasks);

    const [modalOpen, setModalOpen] = useState(false);
    const tasksArray = Array.isArray(tasks) ? tasks : (tasks as any)?.tasks || [];

    useEffect(() => {
        if (!projectId) {
            router.replace('/');
            return;
        }

        const fetchData = async () => {
            try {
                const resultAction = await dispatch(fetchTasksByProject(projectId as string));
                if (fetchTasksByProject.rejected.match(resultAction)) {
                    router.replace('/');
                }
            } catch (err) {
                router.replace('/');
            }
        };

        fetchData();

        return () => {
            dispatch(resetProjectTasks());
        };
    }, [projectId, dispatch, router]);

    const fetchTasks = async () => {
        try {
            await dispatch(fetchTasksByProject(projectId as string)).unwrap();
        } catch (err: any) {
            showAlertMessage(err.message || 'Failed to fetch tasks', 'error');
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await taskService.updateTask(taskId, { status: newStatus });
            await fetchTasks();
        } catch (err: any) {
            showAlertMessage('Failed to update task status', 'error');
        }
    };

    const handleEditTask = (task: any) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleDeleteClick = (task: any) => {
        setTaskToDelete(task);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return;

        setDeleting(true);
        try {
            await taskService.deleteTask(taskToDelete.id);
            showAlertMessage('Task deleted successfully', 'success');
            await fetchTasks();
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        } catch (err: any) {
            showAlertMessage(err.message || 'Failed to delete task', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
    };

    const handleTaskSubmit = async (
        taskData: { title: string; description?: string; dueDate?: string; status?: string },
        taskId?: string
    ) => {
        if (taskId) {
            await taskService.updateTask(taskId, taskData);
        } else {
            await taskService.addTask({
                projectId: projectId as string,
                ...taskData,
            });
        }
        
        await fetchTasks();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Todo':
                return '#f57c00';
            case 'InProgress':
                return '#1976d2';
            case 'Completed':
                return '#2e7d32';
            default:
                return '#757575';
        }
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center min-h-[60vh] flex-col">
                <CircularProgress />
                <Typography className="ml-2 mt-2">Loading tasks...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="p-8">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box className="min-h-screen bg-gray-50 py-8">
            <Container maxWidth="lg">
                <Box className="mb-8">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.push('/')}
                        className="mb-4 normal-case"
                    >
                        Back to Dashboard
                    </Button>
                    
                    <Box className="flex justify-between items-center">
                        <Box>
                            <Typography variant="h4" className="font-semibold">
                                {(tasks as any)?.project?.name} Tasks
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setEditingTask(null);
                                setModalOpen(true);
                            }}
                            className="normal-case px-6"
                        >
                            Create Task
                        </Button>
                    </Box>
                </Box>

                {tasksArray.length === 0 ? (
                    <Paper className="p-12 text-center rounded-xl">
                        <AssignmentIcon className="text-gray-400 mb-4" style={{ fontSize: 64 }} />
                        <Typography variant="h6" className="text-gray-600">
                            No tasks found
                        </Typography>
                        <Typography variant="body2" className="mt-2 text-gray-500">
                            Create your first task to get started
                        </Typography>
                    </Paper>
                ) : (
                    <Box className="max-h-[600px] overflow-y-auto pr-2">
                        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasksArray.map((task: any) => {
                                let dueDateStr = '';
                                if (task.dueDate) {
                                    const date = new Date(task.dueDate);
                                    dueDateStr = date.toLocaleDateString();
                                }

                                return (
                                    <Paper
                                        key={task.id}
                                        className="p-6 rounded-xl hover:shadow-lg transition-shadow"
                                    >
                                        <Box className="flex justify-between items-start mb-4">
                                            <Typography variant="h6" className="font-semibold flex-1 pr-2">
                                                {task.title}
                                            </Typography>
                                            <Box className="flex gap-1">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditTask(task)}
                                                    className="hover:bg-blue-50"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteClick(task)}
                                                    className="hover:bg-red-50"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        {task.description && (
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                className="mb-4 line-clamp-2"
                                            >
                                                {task.description}
                                            </Typography>
                                        )}

                                        {dueDateStr && (
                                            <Box className="flex items-center gap-2 mb-4">
                                                <CalendarTodayIcon className="text-gray-500" style={{ fontSize: 16 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Due: {dueDateStr}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box className="flex items-center gap-2 mb-4">
                                            <Typography variant="body2" color="text.secondary">
                                                Status:
                                            </Typography>
                                            <Chip
                                                label={task.status || 'Todo'}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getStatusColor(task.status || 'Todo'),
                                                    color: 'white',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </Box>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Change Status</InputLabel>
                                            <Select
                                                value={task.status || 'Todo'}
                                                label="Change Status"
                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            >
                                                <MenuItem value="Todo">Todo</MenuItem>
                                                <MenuItem value="InProgress">In Progress</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Paper>
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </Container>

            <CreateTaskModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={handleTaskSubmit}
                editingTask={editingTask}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="px-6 pb-4">
                    <Button 
                        onClick={handleDeleteCancel} 
                        disabled={deleting}
                        className="normal-case"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        variant="contained" 
                        color="error"
                        disabled={deleting}
                        className="normal-case"
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProjectDetailPage;