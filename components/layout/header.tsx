'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Button,
  Modal,
  Divider,
  Toolbar
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useAlert } from '@/lib/redux/slice/alertSlice';

interface Props {
  open: boolean;
  onDrawerOpen: () => void;
}

export default function PageHeader({ open, onDrawerOpen }: Props) {
  const router = useRouter();
  const { showAlertMessage } = useAlert();

  const [user, setUser] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = jwtDecode(token);
        setUser(userData);
      } catch {
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfileModalOpen(false);
    showAlertMessage('Logged out successfully', 'success');
    router.push('/login');
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  const handleCloseModal = () => {
    setProfileModalOpen(false);
  };

  return (
    <>
      <Box
        className="z-[1200] bg-white text-gray-900 shadow-sm border-b border-gray-200 transition-all duration-300"
        sx={{
          ...(open && {
            marginLeft: '200px',
            width: 'calc(100% - 200px)'
          }),
        }}
      >
        <Toolbar className="flex justify-between px-4 sm:px-6">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" className="font-semibold text-base sm:text-lg">
              Task Manager
            </Typography>
          </Link>

          <Box className="flex items-center gap-2 sm:gap-4">
            <IconButton onClick={handleProfileClick}>
              <Avatar className="bg-blue-50 text-black font-semibold w-9 h-9 sm:w-10 sm:h-10">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </Box>

      <Modal
        open={profileModalOpen}
        onClose={handleCloseModal}
        className="flex items-center justify-center p-4"
      >
        <Box className="w-full  max-w-sm sm:max-w-md md:max-w-lg outline-none mx-auto">
          <Card className="rounded-xl shadow-xl border-none bg-white relative">

            <Box className="text-center pt-24 px-6 pb-6 -mt-12 sm:-mt-14 md:-mt-16">
              <Avatar
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-4xl sm:text-5xl md:text-6xl font-bold border-4 border-white shadow-lg bg-gray-400 text-white mx-auto mb-4"
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Typography
                variant="h5"
                className="font-bold mb-2 text-xl sm:text-2xl md:text-3xl text-gray-900"
              >
                {user?.name || 'User'}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm sm:text-base">
                Welcome back!
              </Typography>
            </Box>

            <CardContent className="px-4 sm:px-6 pb-6 pt-0">
              {/* Email Info */}
              <Box className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg mb-3">
                <Box className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mt-1">
                  <EmailIcon className="text-blue-600" style={{ fontSize: 24 }} />
                </Box>
                <Box className="flex-1 min-w-0">
                  <Typography variant="body2" className="text-gray-500 font-medium mb-1 text-sm sm:text-base">
                    Email Address
                  </Typography>
                  <Typography variant="body1" className="font-medium text-gray-900 break-words text-base sm:text-lg">
                    {user?.email || 'user@example.com'}
                  </Typography>
                </Box>
              </Box>

              {/* Full Name Info */}
              <Box className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg mb-5">
                <Box className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mt-1">
                  <PersonIcon className="text-blue-600" style={{ fontSize: 24 }} />
                </Box>
                <Box className="flex-1 min-w-0">
                  <Typography variant="body2" className="text-gray-500 font-medium mb-1 text-sm sm:text-base">
                    Full Name
                  </Typography>
                  <Typography variant="body1" className="font-medium text-gray-900 break-words text-base sm:text-lg">
                    {user?.name || 'User'}
                  </Typography>
                </Box>
              </Box>

              <Divider className="my-5" />

              {/* Logout Button */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                className="rounded-lg py-3 px-6 font-semibold normal-case text-base sm:text-lg md:text-xl bg-blue-500 hover:bg-blue-600 shadow-md"
              >
                LOGOUT
              </Button>
            </CardContent>
          </Card>
        </Box>

      </Modal>
    </>
  );
}