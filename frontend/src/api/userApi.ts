import api from './axiosConfig';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface UpdateUserData {
  email?: string;
  fullName?: string;
  role?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  }
};
