import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './View.css';
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("https://parkmate-back-3.onrender.com");

const ViewParking = () => {
  const [items, setItems] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({});
  const { message6 } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const response = await fetch(`https://parkmate-back-3.onrender.com/api2/items/${message6}`);
        const data = await response.json();
        setItems(data);

        const bookingRes = await fetch("https://parkmate-back-3.onrender.com/api/bookings");
        const bookings = await bookingRes.json();

        const countMap = {};
        bookings.forEach((booking) => {
          const code = booking.ParkingSpaceCode;
          countMap[code] = (countMap[code] || 0) + 1;
        });
        setBookingCounts(countMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData2();

    socket.on("connect", () => {
      console.log("Customer24 connected to server");
    });

    const handleNewOffer2 = (data) => {
      console.log("📥 Received newBooking data:", data);
    
      // ✅ Show message only if ParkingCode from socket matches the current ParkingCode (message6)
      if (data && data.ParkingCode === message6) {
        if (data.ParkingSpaceCode) {
          toast(`One booking confirmed with ${data.ParkingSpaceCode}`);
          setBookingCounts((prev) => ({
            ...prev,
            [data.ParkingSpaceCode]: (prev[data.ParkingSpaceCode] || 0) + 1
          }));
        } else {
          toast("Booking confirmed (but no ParkingSpaceCode received)");
        }
      }
    };
    

    socket.on("newBooking", handleNewOffer2);

    return () => {
      socket.off("newBooking", handleNewOffer2);
    };
  }, [message6]);

  const handleDeleteClick = (id) => {
    setShowDeletePopup(true);
    setItemToDelete(id);
  };

  const handleDelete = (id) => {
    axios.delete('https://parkmate-back-3.onrender.com/delete/' + id)
      .then(res => {
        setItems(items.filter(item => item._id !== id));
        setShowDeletePopup(false);
      })
      .catch(err => console.log(err));
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="page-container">
      <div className="container10">
        {currentItems.map((item) => {
          return (
            <div className="item10" key={item._id}>
              <div className="item-image">
<img src={`https://parkmate-back-3.onrender.com${item.file}`} alt="Parking" />

              </div>

              <div className="item-details">
                <h1 className="design">Parking Information</h1>
                <p><strong>Parking Name</strong> {item.ParkingName}</p>
                <p><strong>Parking Area:</strong> {item.ParkingArea}</p>
                <p><strong>Parking Slots:</strong> {item.Slots}</p>
                <p><strong>Parking Address:</strong> {item.ParkingAddress}</p>
                <p><strong>Parking Space Code</strong> {item.ParkingSpaceCode}</p>

                <div className="actions">
                  <Link className="update-link" to={`/UpdatePark/${item._id}`}>Update</Link>
                  <button className="delete-button" onClick={() => handleDeleteClick(item._id)}>Delete</button>

                  <Link className="update-link" to={`/ViewEntry/${item.ParkingSpaceCode}`}>View Entry/Exit Data</Link>
                  {/* Badge added here */}
                  <div style={{ position: 'relative', display: 'flex' }}>
                    <Link className="update-link" to={`/SlotsBook/${item.Slots}/${item.ParkingSpaceCode}`}>
                      Slots Available
                    </Link>
                    <br></br>
                    
                    {/* Display the booking count badge */}
                    {bookingCounts[item.ParkingSpaceCode] && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-10px',
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}>
                        {bookingCounts[item.ParkingSpaceCode]}
                      </span>
                    )}
                  </div>
                </div>
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

      {showDeletePopup && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Do you want to delete this item?</p>
            <button className="yes" onClick={() => handleDelete(itemToDelete)}>Yes</button>
            <button className="no" onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} />
    </div>
  );
};

export default ViewParking;
