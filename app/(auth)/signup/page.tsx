'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, Person as PersonIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import authService from '../../../client-lib/service/auth-service';
import { useAlert } from '../../../lib/redux/slice/alertSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { showAlertMessage } = useAlert();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const profile = await authService.getProfile();
        if (profile) {
          router.replace('/'); 
        }
      } catch (err) {
        console.warn('Invalid token, stay on signup page');
      }
    };
    checkAuth();
  }, [router]);

  const validators: Record<string, (value: string) => string> = {
    name: (value: string) => (!value.trim() ? 'Name is required' : ''),
    email: (value: string) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email address';
      if (value.includes('..')) return 'Email cannot contain consecutive dots';
      if (value.startsWith('.') || value.endsWith('.')) return 'Email cannot start or end with a dot';
      if (value.includes('@.') || value.includes('.@')) return 'Invalid email format';
      return '';
    },
    password: (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: validators[field](value) }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = Object.keys(form).reduce((acc: any, key) => {
      acc[key] = validators[key](form[key as keyof typeof form]);
      return acc;
    }, {} as Record<string, string>);

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      showAlertMessage('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);

    try {
      await authService.signup({ name: form.name, email: form.email, password: form.password });
      showAlertMessage('Account created successfully! Please login.', 'success');
      router.push('/login');
    } catch (err: any) {
      const message = err?.message || 'Failed to create account';
      showAlertMessage(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Container maxWidth="sm">
        <Paper className="p-8 rounded-xl shadow-lg">
          <Typography variant="h4" className="font-bold text-center mb-3">
            Register
          </Typography>
          <Typography variant="body1" className="text-center mb-6 text-gray-600">
            Create a new account
          </Typography>
          <Box component="form" onSubmit={handleRegister} className="mt-8 flex flex-col gap-4">
            <TextField
              label="Name"
              value={form.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                )
              }}
              className="bg-white"
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                )
              }}
              className="bg-white"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              className="bg-white"
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={loading} 
              className="py-3 mt-2 normal-case text-base font-medium"
              fullWidth
            >
              {loading ? <CircularProgress size={24} className="text-white" /> : 'Register'}
            </Button>
            <Button 
              variant="text" 
              onClick={() => router.push('/login')} 
              className="mt-2 normal-case"
              fullWidth
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}