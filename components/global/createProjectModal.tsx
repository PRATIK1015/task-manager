'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import projectService from '@/client-lib/service/project-service';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function CreateProjectModal({ open, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await projectService.createProject({ name, description });
      setName('');
      setDescription('');
      onProjectCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setDescription('');
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-semibold">Create New Project</DialogTitle>
      <DialogContent>
        <Stack spacing={2} className="mt-2">
          <TextField
            label="Project Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoFocus
            required
            error={!name.trim() && name !== ''}
            helperText={!name.trim() && name !== '' ? 'Project name is required' : ''}
          />
          <TextField
            label="Description (Optional)"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            multiline
            rows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button
          onClick={handleClose}
          disabled={loading}
          className="normal-case"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={loading || !name.trim()}
          className="normal-case px-6"
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}