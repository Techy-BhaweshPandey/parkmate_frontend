import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import { createRoot } from 'react-dom/client';
import './ViewBooking.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewBooking = () => {
  const { message2 } = useParams();
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToDeleteType, setItemToDeleteType] = useState('current'); // current or past

  const currentBookingsRef = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/View/${message2}`);
        const data = await response.json();

        const savedPastBookings = JSON.parse(localStorage.getItem('pastBookings')) || [];

        const pastBookingKeys = new Set(
          savedPastBookings.map(item => `${item.SlotNo}_${item.bookingTime}_${item.username}`)
        );

        const filteredCurrent = data.filter(
          item => !pastBookingKeys.has(`${item.SlotNo}_${item.bookingTime}_${item.username}`)
        );

        setPastBookings(savedPastBookings);
        setCurrentBookings(filteredCurrent);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [message2]);

  useEffect(() => {
    currentBookingsRef.current = currentBookings;
  }, [currentBookings]);

  const moveToPast = useCallback((item) => {
    setPastBookings((prev) => {
      const updated = [...prev, item];
      localStorage.setItem('pastBookings', JSON.stringify(updated));
      return updated;
    });

    setCurrentBookings((prev) =>
      prev.filter(
        booking =>
          `${booking.SlotNo}_${booking.bookingTime}_${booking.username}` !==
          `${item.SlotNo}_${item.bookingTime}_${item.username}`
      )
    );
  }, []);

  const generateTicket = (item) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Booking Ticket', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`Username: ${item.username}`, 20, 40);
    doc.text(`Email: ${item.email}`, 20, 50);
    doc.text(`Booking Time: ${item.bookingTime}`, 20, 60);
    doc.text(`Slot No: ${item.SlotNo}`, 20, 70);
    doc.text(`ParkingArea: ${item.ParkingArea}`, 20, 80);
    doc.text(`ParkingName: ${item.ParkingName}`, 20, 90);
    doc.text('Ticket Price: Rs20', 20, 100);
    doc.text('Valid for: 1 Hour Only', 20, 110);
    doc.text('Extra Time = Extra Charges for per hour 20 only', 20, 120);

    const qrContainer = document.createElement('div');
    qrContainer.style.display = 'none';
    document.body.appendChild(qrContainer);

    const root = createRoot(qrContainer);
    root.render(<QRCodeCanvas value={item.SlotNo} size={150} />);

    setTimeout(() => {
      const canvas = qrContainer.querySelector('canvas');
      if (canvas) {
        const qrImageData = canvas.toDataURL('image/png');
        doc.addImage(qrImageData, 'PNG', 130, 40, 50, 50);
        doc.save(`${item.username}_ticket.pdf`);
      }
      document.body.removeChild(qrContainer);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const isExpired = (bookingTime) => {
        const bookingTimestamp = new Date(bookingTime).getTime();
        return now - bookingTimestamp > 86400000;
      };

      currentBookingsRef.current.forEach((item) => {
        if (isExpired(item.bookingTime)) {
          moveToPast(item);
        }
      });
    }, 86400000);

    return () => clearInterval(interval);
  }, [moveToPast]);

  useEffect(() => {
    const now = Date.now();
    const isExpired = (bookingTime) => {
      const bookingTimestamp = new Date(bookingTime).getTime();
      return now - bookingTimestamp > 86400000;
    };

    const expiredBookings = currentBookings.filter(item => isExpired(item.bookingTime));
    if (expiredBookings.length > 0) {
      expiredBookings.forEach((item) => moveToPast(item));
    }
  }, [currentBookings, moveToPast]);

  const handleDeleteClick = (id, type) => {
    setItemToDelete(id);
    setItemToDeleteType(type);
    setShowDeletePopup(true);
  };

  const handleDeleteBooking = async () => {
    try {
      await axios.delete(`http://localhost:5000/delete1/${itemToDelete}`);
      if (itemToDeleteType === 'current') {
        setCurrentBookings(prev => prev.filter(item => item._id !== itemToDelete));
      } else {
        const updatedPast = pastBookings.filter(item => item._id !== itemToDelete);
        localStorage.setItem('pastBookings', JSON.stringify(updatedPast));
        setPastBookings(updatedPast);
      }

      // Show success toast notification
      toast.success('Data deleted successfully!', {
       
        autoClose: 1800,
      });
    } catch (err) {
      console.error(err);
      // Show error toast notification in case of failure
      toast.error('Failed to delete data.', {
       
        autoClose: 1500,
      });
    }
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  return (
    <div className="view-container">
      <h2 className="heading">Booking Details</h2>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current Booking
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Booking
        </button>
      </div>

      {activeTab === 'current' && (
        <div className="data-container">
          <h3>Current Bookings</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Booking Time</th>
                <th>Email</th>
                <th>Slot No</th>
                <th>Generate Ticket</th>
                <th>🗑️</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.bookingTime}</td>
                    <td>{item.email}</td>
                    <td>{item.SlotNo}</td>
                    <td>
                      <button className="generate-ticket-btn" onClick={() => generateTicket(item)}>Generate Ticket</button>
                    </td>
                    <td>
                      <span style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(item._id, 'current')}>🗑️</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No current bookings available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'past' && (
        <div className="data-container">
          <h3>Past Bookings</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Booking Time</th>
                <th>Email</th>
                <th>Slot No</th>
                <th>Generate Ticket</th>
                <th>🗑️</th>
              </tr>
            </thead>
            <tbody>
              {pastBookings.length > 0 ? (
                pastBookings.map((item) => (
                  <tr key={item._id}>
                    <td>{item.username}</td>
                    <td>{item.bookingTime}</td>
                    <td>{item.email}</td>
                    <td>{item.SlotNo}</td>
                    <td>
                      <button className="generate-ticket-btn" onClick={() => generateTicket(item)}>Generate Ticket</button>
                    </td>
                    <td>
                      <span style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(item._id, 'past')}>🗑️</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No past bookings available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showDeletePopup && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Do you want to cancel the ticket?</p>
            <button className="yes" onClick={handleDeleteBooking}>Yes</button>
            <button className="no" onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ViewBooking;
