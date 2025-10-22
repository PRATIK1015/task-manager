'use client';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Stack,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';
import { useAlert } from '@/lib/redux/slice/alertSlice';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (taskData: { title: string; dueDate?: string; status?: string }, taskId?: string) => Promise<void>;
    editingTask?: any;
}

const CreateTaskModal = ({ open, onClose, onSubmit, editingTask }: Props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<string>('');
    const [status, setStatus] = useState('Todo');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const { showAlertMessage } = useAlert();

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title || '');
            setDescription(editingTask.description || '');
            setStatus(editingTask.status || 'Todo');

            if (editingTask.dueDate) {
                const date = new Date(editingTask.dueDate);
                setDueDate(date.toISOString().split('T')[0]);
            } else if (editingTask.dueDate) {
                setDueDate(editingTask.dueDate);
            } else {
                setDueDate('');
            }
        } else {
            resetForm();
        }
    }, [editingTask, open]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('Todo');
        setError('');
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            setError('Task title is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSubmit(
                {
                    title: title.trim(),
                    dueDate: dueDate || undefined,
                    status,
                },
                editingTask?.id
            );

            showAlertMessage(
                editingTask ? 'Task updated successfully' : 'Task created successfully',
                'success'
            );
            resetForm();
            onClose();
        } catch (err) {
            showAlertMessage(
                editingTask ? 'Failed to update task' : 'Failed to create task',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onClose();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCreate();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle className="font-semibold">
                {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} className="mt-2">
                    {error && (
                        <Alert severity="error" onClose={() => setError('')} className="rounded-lg">
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Task Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        autoFocus
                        required
                        error={!title.trim() && error !== ''}
                        helperText={!title.trim() && error !== '' ? 'Title is required' : ''}
                    />

                    <TextField
                        label="Due Date (optional)"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        disabled={loading}
                        inputProps={{
                            min: new Date().toISOString().split('T')[0], // Disables all past dates
                        }}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={loading}
                        >
                            <MenuItem value="Todo">Todo</MenuItem>
                            <MenuItem value="InProgress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions className="px-6 pb-4">
                <Button
                    onClick={handleClose}
                    color="secondary"
                    disabled={loading}
                    className="normal-case"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={loading || !title.trim()}
                    className="normal-case px-6"
                >
                    {loading
                        ? (editingTask ? 'Updating...' : 'Creating...')
                        : (editingTask ? 'Update' : 'Create')
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTaskModal;