
import api from './axiosConfig';

export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  purpose: string;
  attendees: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
}

export interface UpdateReservationData {
  date?: string;
  startTime?: string;
  endTime?: string;
  purpose?: string;
  attendees?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export const reservationApi = {
  getUserReservations: async (): Promise<Reservation[]> => {
    const response = await api.get('/api/reservations');
    return response.data;
  },

  getAllReservations: async (): Promise<Reservation[]> => {
    const response = await api.get('/api/admin/reservations');
    return response.data;
  },

  getReservationById: async (id: string): Promise<Reservation> => {
    const response = await api.get(`/api/reservations/${id}`);
    return response.data;
  },

  createReservation: async (reservationData: CreateReservationData): Promise<Reservation> => {
    const response = await api.post('/api/reservations', reservationData);
    return response.data;
  },

  updateReservation: async (id: string, reservationData: UpdateReservationData): Promise<Reservation> => {
    const response = await api.put(`/api/reservations/${id}`, reservationData);
    return response.data;
  },

  deleteReservation: async (id: string): Promise<void> => {
    await api.delete(`/api/reservations/${id}`);
  }
};
