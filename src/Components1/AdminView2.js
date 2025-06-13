import React, { useEffect, useState } from 'react';
import './AdminView.css';
import axios from "axios";
const AdminView2 = () => {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState(''); 
const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api4/items');
      const data = await response.json();
      setItems(data); // Store all items
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleDeleteClick = (id) => {
    // Show the delete confirmation popup
    setShowDeletePopup(true);
    setItemToDelete(id);
  };

  const handleDelete = (id) => {
    axios.delete('http://localhost:5000/delete/' + id)
      .then(res => {
        setItems(items.filter(item => item._id !== id)); // Remove item from the list
        setShowDeletePopup(false); // Close the popup
      })
      .catch(err => console.log(err));
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false); // Close the popup without deleting
    setItemToDelete(null); // Reset the item to delete
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  return (
    <div className="admin-view-container">
      {/* Centered Buttons */}
      <div className="button-container">
        <button onClick={() => setViewMode('ParkingInfo')} className="view-button">View Parking Information</button>
        <button onClick={() => setViewMode('View Parking')} className="view-button">View Parking</button>
      </div>

      {/* Conditional Rendering of Fetched Data */}
      {viewMode === 'ParkingInfo' &&  (
        <div className="data-container">
          <h2>PARKING INFORMATION</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Parking Name</th>
                <th>Parking Area</th>
                <th>Slots</th>
                <th>Parking Address</th>
                <th>Parking Code</th>
                <th>Modify Information</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.ParkingName}</td>
                  <td>{item.ParkingArea}</td>
                  <td>{item.Slots}</td>
                  <td>{item.ParkingAddress}</td>
                  <td>{item.ParkingCode}</td>
                  <td> <button className="delete-button" onClick={() => handleDeleteClick(item._id)}>Delete</button></td>
                </tr>
                
              ))}
              {showDeletePopup && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Do you want to delete this item?</p>
            <button onClick={() => handleDelete(itemToDelete)}>Yes</button>
            <button onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'View Parking' &&  (
         <div className="page1-container">
        <div className="container10">
        {currentItems.map((item) => {
          return (
            <div className="item10" key={item._id}>
              {/* Image on the left */}
              <div className="item-image">
                <img src={item.file} alt="Parking" />
              </div>

              {/* Details on the right */}
              <div className="item-details">
                <h1 className="design">Parking Information</h1>
               
                <p><strong>Parking Name</strong> {item.ParkingName}</p>
                <p><strong>Parking Area:</strong> {item.ParkingArea}</p>
                <p><strong>Parking Slots:</strong> {item.Slots}</p>
                <p><strong>Parking Address:</strong> {item.ParkingAddress}</p>
              </div>
            </div>
          );
        })}
      </div>

            <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={currentPage === number + 1 ? 'active' : ''}
          >
            {number + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
</div>
      )}
    </div>
  );
};

export default AdminView2;
