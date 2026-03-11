const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Generic request method with authorization header
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    login: async (email, password) => {
      return api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
  },

  // Services endpoints
  services: {
    create: async (serviceData) => {
      return api.request('/services/create', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });
    },
    getAll: async () => {
      return api.request('/services', {
        method: 'GET',
      });
    },
    searchByPincode: async (pincode) => {
      return api.request(`/services/search/${pincode}`, {
        method: 'GET',
      });
    },
    update: async (id, updateData) => {
      return api.request(`/services/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
  },
};
