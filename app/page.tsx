'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Paper, Button, Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadProfile, resetProfile } from '@/lib/redux/slice/profileSlice';
import dashboardService, { DashboardData } from '@/client-lib/service/dashboard-service';
import CreateProjectModal from '@/components/global/createProjectModal';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAlert } from '@/lib/redux/slice/alertSlice';

const DashboardPage = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { showAlertMessage } = useAlert();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: profile, loading: profileLoading } = useAppSelector(state => state.profile);

  useEffect(() => {
    verifyTokenAndLoadProfile();
  }, [router, dispatch]);

  const verifyTokenAndLoadProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      await dispatch(loadProfile()).unwrap();
      await fetchDashboardData();
    } catch (err) {
      localStorage.removeItem('token');
      dispatch(resetProfile());
      router.replace('/login');
      return;
    } finally {
      setAuthChecked(true);
      setLoadingDashboard(false);
    }
  };

  const refreshDashboard = async () => {
    await fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err: any) {
      showAlertMessage(err?.message || "fail to load dashboard data.")
    }
  };

  if (!authChecked || profileLoading || loadingDashboard) {
    return (
      <Box className="flex justify-center items-center min-h-[60vh] flex-col">
        <CircularProgress size={30} className="mb-4" />
        <Typography>Loading Dashboard...</Typography>
      </Box>
    );
  }

  const totalCompletedTasks = dashboardData?.projects.reduce(
    (sum, project) => sum + (project.completed || 0),
    0
  );

  return (
    <Box className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <Container maxWidth="lg" className="px-4 sm:px-6">
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <Typography variant="h4" className="font-semibold text-2xl sm:text-3xl md:text-4xl">
            Welcome, {profile?.name || profile?.email}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            className="normal-case px-4 sm:px-6 w-full sm:w-auto"
          >
            Create Project
          </Button>
        </Box>

        {dashboardData && (
          <Box className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Paper className="p-4 sm:p-6 flex-1 flex items-center gap-3 sm:gap-4 rounded-xl hover:shadow-lg transition-shadow">
              <Box className="bg-blue-50 rounded-full p-3 sm:p-4 flex shrink-0">
                <PeopleIcon className="text-blue-600" style={{ fontSize: 28 }} sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
              </Box>
              <Box className="min-w-0">
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">Total Users</Typography>
                <Typography variant="h4" className="font-semibold text-2xl sm:text-3xl md:text-4xl">{dashboardData.users}</Typography>
              </Box>
            </Paper>

            <Paper className="p-4 sm:p-6 flex-1 flex items-center gap-3 sm:gap-4 rounded-xl hover:shadow-lg transition-shadow">
              <Box className="bg-green-50 rounded-full p-3 sm:p-4 flex shrink-0">
                <CheckCircleIcon className="text-green-700" style={{ fontSize: 28 }} sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
              </Box>
              <Box className="min-w-0">
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">Completed Tasks</Typography>
                <Typography variant="h4" className="font-semibold text-2xl sm:text-3xl md:text-4xl">{totalCompletedTasks}</Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <Box className="mb-4 sm:mb-6">
          <Typography variant="h5" className="font-semibold text-xl sm:text-2xl">
            Your Projects
          </Typography>
        </Box>

        <Box className="max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {dashboardData?.projects.map(project => (
              <Paper
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="p-4 sm:p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
              >
                <Box className="flex items-center mb-3 sm:mb-4">
                  <FolderIcon className="text-blue-600 mr-2" style={{ fontSize: 24 }} sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  <Typography variant="h6" className="font-semibold truncate text-base sm:text-lg">
                    {project.name}
                  </Typography>
                </Box>

                <Box className="flex flex-col gap-1.5 sm:gap-2">
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">Total Tasks:</Typography>
                    <Typography variant="body2" className="font-semibold text-xs sm:text-sm">{project.totalTask}</Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">Todo:</Typography>
                    <Typography variant="body2" className="font-semibold text-orange-600 text-xs sm:text-sm">{project.todo}</Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">In Progress:</Typography>
                    <Typography variant="body2" className="font-semibold text-blue-600 text-xs sm:text-sm">{project.inProcess}</Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">Completed:</Typography>
                    <Typography variant="body2" className="font-semibold text-green-700 text-xs sm:text-sm">{project.completed}</Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onProjectCreated={refreshDashboard}
      />
    </Box>
  );
};

export default DashboardPage;