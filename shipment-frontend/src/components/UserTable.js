import React, { useState } from 'react';
import { api } from '../services/api';

const UserTable = ({ users, onToggleSelect, onUpdatePhoneNumber }) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const handleEdit = (id, field, value) => {
    setEditingId(id);
    setEditValues(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async (id) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    setError('');
    
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;
      
      const response = await api.services.update(id, {
        phoneNumber: editValues[id]?.phoneNumber || user.phoneNumber,
        tat: editValues[id]?.tat || user.tat
      });
      
      // Update local state with response
      onUpdatePhoneNumber(id, response.phoneNumber, response.tat);
      setEditingId(null);
    } catch (error) {
      setError('Failed to update phone number');
      console.error('Error updating phone number:', error);
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleCancel = (id) => {
    setEditingId(null);
    setEditValues(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleTatChange = async (id, value) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    setError('');
    
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;
      
      const response = await api.services.update(id, {
        phoneNumber: user.phoneNumber,
        tat: parseInt(value)
      });
      
      // Update local state with response
      onUpdatePhoneNumber(id, response.phoneNumber, response.tat);
    } catch (error) {
      setError('Failed to update TAT');
      console.error('Error updating TAT:', error);
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>PIN Code</th>
          <th>Service</th>
          <th>TAT</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {error && (
          <tr>
            <td colSpan="6" style={{ color: 'red', textAlign: 'center', padding: '10px' }}>
              {error}
            </td>
          </tr>
        )}
        {users.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
              No users found
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{String(user.pincode)}</td>
              <td>{user.service}</td>
              <td>
                <input
                  type="number"
                  value={user.tat}
                  onChange={(e) => handleTatChange(user.id, e.target.value)}
                  disabled={loading[user.id]}
                  style={{ 
                    width: '80px', 
                    padding: '5px', 
                    border: '1px solid #ddd', 
                    borderRadius: '3px',
                    opacity: loading[user.id] ? 0.6 : 1
                  }}
                />
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    defaultValue={user.phoneNumber}
                    onChange={(e) => handleEdit(user.id, 'phoneNumber', e.target.value)}
                    disabled={loading[user.id]}
                    style={{ 
                      width: '100%', 
                      padding: '5px', 
                      border: '1px solid #ddd', 
                      borderRadius: '3px',
                      opacity: loading[user.id] ? 0.6 : 1
                    }}
                  />
                ) : (
                  <span onClick={() => setEditingId(user.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {user.phoneNumber}
                    <span style={{ fontSize: '12px', color: '#007bff' }}>✏️</span>
                  </span>
                )}
              </td>
              <td>{user.email}</td>
              <td>
                {editingId === user.id ? (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => handleSave(user.id)}
                      disabled={loading[user.id]}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: loading[user.id] ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading[user.id] ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => handleCancel(user.id)}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={user.selected}
                    onChange={() => onToggleSelect(user.id)}
                  />
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
