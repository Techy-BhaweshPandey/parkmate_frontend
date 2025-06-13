import React, { useEffect, useState } from 'react';
import './AdminView.css';

const AdminView = () => {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState(''); // To toggle between customer and parker details

  useEffect(() => {
    fetchData(); // Fetch data once, and filter based on viewMode
  }, []);

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('https://parkmate-back-3.onrender.com/api3/items');
      const data = await response.json();
      setItems(data); // Store all items
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Filter items based on userRole
  const filteredItems = viewMode === 'Customer' 
    ? items.filter(item => item.userRole === 'Customer') 
    : viewMode === 'Parker'
    ? items.filter(item => item.userRole === 'Parker')
    : [];

  return (
    <div className="admin-view-container">
      {/* Centered Buttons */}
      <div className="button-container">
        <button onClick={() => setViewMode('Customer')} className="view-button">View Customer Detail</button>
        <button onClick={() => setViewMode('Parker')} className="view-button">View Parker Detail</button>
      </div>

      {/* Conditional Rendering of Fetched Data */}
      {viewMode === 'Customer' && filteredItems.length > 0 && (
        <div className="data-container">
          <h2>CUSTOMER DETAILS</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>User Role</th>
                <th>Unique Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.userRole}</td>
                  <td>{item.uniqcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'Parker' && filteredItems.length > 0 && (
        <div className="data-container">
          <h2>PARKER DETAILS</h2>
          <table className="data-table">
            <thead>
              <tr>
              <th>Name</th>
                <th>Email</th>
                <th>User Role</th>
                <th>Unique Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id}>
                <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.userRole}</td>
                  <td>{item.uniqcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* If no items match the viewMode */}
      {(viewMode === 'Customer' || viewMode === 'Parker') && filteredItems.length === 0 && (
        <p>No data available for the selected view mode.</p>
      )}
    </div>
  );
};

export default AdminView;
