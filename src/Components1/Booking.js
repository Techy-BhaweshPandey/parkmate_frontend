import React, { useState, useEffect, useCallback } from 'react';
import './Booking.css';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import { CgArrowLongRight } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import io from 'socket.io-client';
import Swal from 'sweetalert2';

const socket = io('http://localhost:5000');

const Booking = () => {
  const location = useLocation();
  const transfer = location.state || {}; // Ensure transfer has data
  const { Slots, Code } = useParams();  // Fetch Slots and ParkingCode from URL params
  const { ParkingArea, ParkingName, ParkingSpaceCode } = useParams();
  const [step, setStep] = useState(1);  // Step 1: Booking Form, Step 2: Review Booking
  const [formData, setFormData] = useState({
    username: transfer.name || '',  // Set from transfer.name or empty if undefined
    bookingTime: '',  // Initial bookingTime is empty
     VehicleNumber: '',               
    email: transfer.email || '', 
    CustomerCode: transfer.code || '',
    SlotNo: null,  // To store the selected slot number
  });

  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); 
  const [bookedSlots, setBookedSlots] = useState([]);  
  const [showSlotAlreadyBookedPopup, setShowSlotAlreadyBookedPopup] = useState(false); 
  const [showSlotClickedPopup, setShowSlotClickedPopup] = useState(false); 

  // Fetch booked slots from the server based on the ParkingCode
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api5/items?ParkingCode=${Code}`);
        const bookedSlotNumbers = response.data.map(item => item.SlotNo);
        setBookedSlots(bookedSlotNumbers);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
      }
    };

    fetchBookedSlots();
  }, [Code]);

  // Handle slot click
  const handleCarClick = useCallback(async (index) => {
    if (!formData.bookingTime) {
      setErrorMessage("Please select a booking time first.");
      return; // Prevent selecting slot if booking time is not selected
    }

    // Check if the slot is already booked by comparing with the fetched booked slots
    if (bookedSlots.includes(index + 1)) { // Add 1 because slots are 1-based
      setShowSlotAlreadyBookedPopup(true); // Show the "already booked" popup
      return;
    }

    // Mark the slot as selected and booked
    setFormData({ ...formData, SlotNo: index + 1 });  // Store the slot number (1-based)

    // Show the "Slot clicked" popup
    setShowSlotClickedPopup(true);
  }, [formData, bookedSlots]);

  // Generate dynamic slot buttons
  useEffect(() => {
    const imageCount = parseInt(Slots, 10);  // Ensure that Slots is parsed as a number
    const generatedImages = [];

    for (let i = 0; i < imageCount; i++) {
      const isBooked = bookedSlots.includes(i + 1);  // Check if this slot is booked based on SlotNo

      generatedImages.push(
        <button
          key={i}
          className={`dynamic-icon-button ${isBooked ? 'disabled booked' : ''}`}  // Add 'booked' class for booked slots
          onClick={() => handleCarClick(i)} // Handle slot selection
          style={{ backgroundColor: isBooked ? 'red' : 'transparent' }}  // Change background color based on booking status
        >
          <FaCar className="dynamic-icon" />
        </button>
      );
    }
    setImages(generatedImages);
  }, [Slots, bookedSlots, handleCarClick]);  // Re-run when Slots or bookedSlots change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveAndProceed = () => {
    // Check if all details are filled before proceeding to the review step
    if (!formData.username || !formData.bookingTime || !formData.email||!formData.VehicleNumber || formData.SlotNo === null) {
      setErrorMessage('Please fill in all details before proceeding.');
      return;
    }

    // Proceed to review step
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookingData = { 
        username: formData.username, 
        bookingTime: formData.bookingTime, 
         VehicleNumber: formData.VehicleNumber,
        email: formData.email, 
        CustomerCode: formData.CustomerCode, 
        SlotNo: formData.SlotNo,
        ParkingCode: Code,
        ParkingArea: ParkingArea,
        ParkingName: ParkingName,
        ParkingSpaceCode: ParkingSpaceCode,
      };

      console.log('Sending booking data:', bookingData);  

      const response = await axios.post('http://localhost:5000/api/book', bookingData);
      
      // Log response for debugging
      console.log('Booking Response:', response.data);

      if (response.data.message === 'Booking successful!') {
        // Update the booked slots locally
        setBookedSlots((prevSlots) => [...prevSlots, formData.SlotNo]);  
        setShowSuccessPopup(true);  // Show success popup after booking
        socket.emit('newOffer', {
          message: `New offer added: "${response.data.ParkingSpaceCode}, ${response.data.ParkingCode}"`
        });
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error booking slot:', error);

      // Check if the error is due to the slot being already booked
      if (error.response && error.response.data.message === 'This slot is already booked by another user.') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'This slot is already booked!',
        });
      } else {
        alert('Booking failed. Please try again.');
      }
    }
  };

  const closeErrorPopup = () => {
    setErrorMessage('');
  };

  const closeSlotAlreadyBookedPopup = () => {
    setShowSlotAlreadyBookedPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setStep(1);
    formData.bookingTime = '';
  };

  const closeSlotClickedPopup = () => {
    setShowSlotClickedPopup(false);
  };

  const ModifyBooking = () => {
    setStep(1);
    formData.bookingTime = '';
  };

  return (
    <div className='slotbook'>
      <div className="booking-container">
        {step === 1 && (
          <div className="booking-form">
            <h2>
            <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendButton, backgroundColor: 'red', border: '2px solidrgb(226, 25, 58)' }}></div>
            <span style={{...styles.legendLabel,fontSize:'12px'}}>Already Booked</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendButton, backgroundColor: 'blue' }}></div>
            <span style={{...styles.legendLabel,fontSize:'12px'}}>Available</span>
          </div>
        </div>
        </h2>
            <h2>Book Your Parking
               
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username} 
                  onChange={handleChange}
                  readOnly
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bookingTime">Booking Time:</label>
                <input
                  type="time"
                  id="bookingTime"
                  name="bookingTime"
                  value={formData.bookingTime}
                  onChange={handleChange}
                  required
                />
              </div>
               <div className="form-group">
                <label htmlFor="CarNumber">Vehicle Number:</label>
                <input
                  type="text"
                  id="VehicleNumber"
                  name="VehicleNumber"
                  value={formData.VehicleNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  readOnly
                  placeholder="Enter your email"
                  required
                />
              </div>

              {errorMessage && (
                <div className="error-popup">
                  <p>{errorMessage}</p>
                  <button onClick={closeErrorPopup}>OK</button>
                </div>
              )}

              <div className="icon-container">
                {images}
              </div>

              <button className="save-proceed-btn" onClick={handleSaveAndProceed}>
                Save and Proceed <CgArrowLongRight />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="review-booking">
            <h2>Review Your Booking <button onClick={ModifyBooking}><FaEdit /></button></h2>
            <p><strong>Username:</strong> {formData.username}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Booking Time:</strong> {formData.bookingTime}</p>
            <p><strong>Slot Number:</strong> {formData.SlotNo}</p>
<p><strong>Vehicle Number:</strong> {formData.VehicleNumber}</p>
            <button onClick={handleSubmit}>Submit Booking</button>
          </div>
        )}

        {showSuccessPopup && (
          <div className="success-popup">
            <p>Your booking was successful! with Slot No {formData.SlotNo}</p>
            <button onClick={closeSuccessPopup}>OK</button>
          </div>
        )}

        {showSlotAlreadyBookedPopup && (
          <div className="error-popup">
            <p>This slot is already booked!</p>
            <button onClick={closeSlotAlreadyBookedPopup}>OK</button>
          </div>
        )}

        {showSlotClickedPopup && (
          <div className="success1-popup">
            <p>Slot clicked!</p>
            <button onClick={closeSlotClickedPopup} className="btclick">OK</button>
          </div>
        )}

      </div>
    </div>
  );
};
const styles = {
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendButton: {
    width: '20px',
    height: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },
}
export default Booking;
