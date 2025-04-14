
import api from './axiosConfig';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
  amenities: string[];
  images: string[];
  availability: Availability[];
}

export interface Availability {
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface RoomFilter {
  location?: string;
  capacity?: number;
  date?: string;
  amenities?: string[];
}

export const roomApi = {
  getAllRooms: async (filters?: RoomFilter): Promise<Room[]> => {
    const response = await api.get('/api/rooms', { params: filters });
    return response.data;
  },

  getRoomById: async (id: string): Promise<Room> => {
    const response = await api.get(`/api/rooms/${id}`);
    return response.data;
  },

  createRoom: async (roomData: Partial<Room>): Promise<Room> => {
    const response = await api.post('/api/rooms', roomData);
    return response.data;
  },

  updateRoom: async (id: string, roomData: Partial<Room>): Promise<Room> => {
    const response = await api.put(`/api/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/api/rooms/${id}`);
  }
};
