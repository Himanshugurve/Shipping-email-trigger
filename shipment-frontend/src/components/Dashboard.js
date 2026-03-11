import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import UserTable from './UserTable';
import AddUserForm from './AddUserForm';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.services.getAll();
      const servicesWithId = response.map(service => ({
        ...service,
        id: service._id,
        selected: false
      }));
      setUsers(servicesWithId);
    } catch (error) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddUser = async (newService) => {
    try {
      const response = await api.services.create({
        pincode: newService.pincode,
        service: newService.service,
        tat: newService.tat,
        phoneNumber: newService.phoneNumber,
        email: newService.email
      });
      
      const serviceWithId = {
        ...response.data,
        id: response.data._id,
        selected: false
      };
      
      setUsers([...users, serviceWithId]);
      setShowAddUser(false);
      
      // Success message
      alert('Service created successfully!');
    } catch (error) {
      setError('Failed to create service');
      console.error('Error creating service:', error);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      fetchServices();
      return;
    }
    
    // Always use API search for pincode (numeric input)
    if (/^\d+$/.test(value)) {
      try {
        setLoading(true);
        const response = await api.services.searchByPincode(value);
        const servicesWithId = response.map(service => ({
          ...service,
          id: service._id || Math.random().toString(),
          selected: false,
          tat: service.tat || 'N/A',
          phoneNumber: service.phoneNumber || 'N/A',
          email: service.email || 'N/A'
        }));
        setUsers(servicesWithId);
      } catch (error) {
        setError('Failed to search services');
        console.error('Error searching services:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // For non-numeric search, filter locally from all services
      try {
        setLoading(true);
        const allServices = await api.services.getAll();
        const filteredServices = allServices.filter(service =>
          (service.pincode && String(service.pincode).includes(value)) ||
          (service.service && service.service.toLowerCase().includes(value.toLowerCase())) ||
          (service.phoneNumber && String(service.phoneNumber).includes(value)) ||
          (service.email && service.email.toLowerCase().includes(value.toLowerCase()))
        );
        
        const servicesWithId = filteredServices.map(service => ({
          ...service,
          id: service._id || Math.random().toString(),
          selected: false
        }));
        setUsers(servicesWithId);
      } catch (error) {
        setError('Failed to search services');
        console.error('Error searching services:', error);
      } finally {
        setLoading(false);
      }
    }
  };


  const handleToggleSelect = (id) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, selected: !user.selected } : user
    ));
  };

  const handleUpdatePhoneNumber = (id, phoneNumber, tat) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, phoneNumber, tat: tat || user.tat } : user
    ));
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Shipment Management Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search Pin Code..."
            className="search-box"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn btn-primary" onClick={() => setShowAddUser(true)}>
            Add User
          </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </div>

      {showAddUser && (
        <AddUserForm
          onSubmit={handleAddUser}
          onCancel={() => setShowAddUser(false)}
        />
      )}

      <div className="user-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
        ) : (
          <UserTable
            users={users}
            onToggleSelect={handleToggleSelect}
            onUpdatePhoneNumber={handleUpdatePhoneNumber}
          />
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Welcome, {user?.username}!</p>
        <p>Search with minimum 3 characters (e.g., 515)</p>
      </div>
    </div>
  );
};

export default Dashboard;
