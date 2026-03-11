import React, { useState } from 'react';
import { api } from '../services/api';

const AddUserForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    pincode: '',
    service: '',
    tat: '',
    phoneNumber: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.pincode || !formData.service || !formData.tat || !formData.phoneNumber || !formData.email) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      onSubmit(formData);
      setFormData({
        pincode: '',
        service: '',
        tat: '',
        phoneNumber: '',
        email: ''
      });
    } catch (error) {
      setError(error.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Add New Service</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label htmlFor="pincode">PIN Code</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="service">Service</label>
            <input
              type="text"
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tat">TAT (Turn Around Time)</label>
            <input
              type="number"
              id="tat"
              name="tat"
              value={formData.tat}
              onChange={handleChange}
              placeholder="e.g., 1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ marginRight: '10px' }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
