import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export const api = {
  async getUsers() {
    const response = await axios.get(`${API_BASE_URL}/users`)
    return response.data
  },

  async deleteUser(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`)
    return response.data
  },

  async createUser(userData: {
    name?: string;
    surname?: string;
    email: string;
    age: number;
    favorite_color?: string;
    contact_preference: string[];
  }) {
    const response = await axios.post(`${API_BASE_URL}/users`, userData)
    return response.data
  },

  async updateUser(id: string, userData: {
    name?: string;
    surname?: string;
    email: string;
    age: number;
    favorite_color?: string;
    contact_preference: string[];
  }) {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData)
    return response.data
  }
} 