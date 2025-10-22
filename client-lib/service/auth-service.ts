import http from "../http";
const BASE_PATH = process.env.NEXT_PUBLIC_BACKEND_END_POINT;

export interface ProfileData {
  id: string;
  name: string;
  email: string;
}

export const signin = async (data: { email: string; password: string }) => {

  const response = await http.post(`/api/auth/signin`, {
    body: data,
  });
  return response;
};


export const signup = async (data: { name: string; email: string; password: string }) => {

  const response = await http.post(`/api/auth/signup`, {
    body: data,
  });
  return response;
};

export const getProfile = async () => {
  const response = await http.get(`/api/auth/profile`);
  return response;
};

const authService = {
  signin,
  signup,
  getProfile
};

export default authService;
