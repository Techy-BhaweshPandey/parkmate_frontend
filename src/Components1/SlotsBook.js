import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import axios from 'axios';

const SlotsBook = () => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [clickedSlots, setClickedSlots] = useState([]);
  const { Slot, ParkingSpaceCode } = useParams();
  const numberOfSlots = parseInt(Slot, 10) || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://parkmate-back-3.onrender.com/Slot/${ParkingSpaceCode}`);
        const data = await response.json();
        const booked = data.map(item => item.SlotNo);
        setBookedSlots(booked);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [ParkingSpaceCode]);

  const handleButtonClick = async (slotNumber) => {
    if (clickedSlots.includes(slotNumber)) return;
    if (!bookedSlots.includes(slotNumber)) return;

    try {
      const response = await axios.delete(`https://parkmate-back-3.onrender.com/Slot/${ParkingSpaceCode}/delete/${slotNumber}`);
      if (response.status === 200) {
        setBookedSlots(prev => prev.filter(slot => slot !== slotNumber));
        setClickedSlots(prev => [...prev, slotNumber]);
      } else {
        alert('Failed to unbook the slot');
      }
    } catch (error) {
      console.error('Error unbooking slot:', error);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.heading}>
        Parking Slots for <span style={styles.code}>{ParkingSpaceCode}</span>
        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendButton, backgroundColor: '#fff', border: '2px solid #4CAF50' }}></div>
            <span style={styles.legendLabel}>Available</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendButton, backgroundColor: '#bbb' }}></div>
            <span style={styles.legendLabel}>Booked</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendButton, backgroundColor: '#4CAF50' }}></div>
            <span style={styles.legendLabel}>Unbooked</span>
          </div>
        </div>
      </h1>

      <div style={styles.slotsContainer}>
        {Array.from({ length: numberOfSlots }).map((_, index) => {
          const slotNumber = index + 1;
          const isBooked = bookedSlots.includes(slotNumber);
          const isClicked = clickedSlots.includes(slotNumber);

          return (
            <button
              key={index}
              style={{
                ...styles.slotButton,
                ...(isBooked ? styles.bookedSlot : {}),
                ...(isClicked ? styles.unbookedSlot : {}),
              }}
              onClick={() => handleButtonClick(slotNumber)}
            >
              <FaCar style={styles.icon} />
              <span style={styles.slotLabel}>Slot {slotNumber}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    padding: '40px 20px',
    background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
    fontFamily: 'Segoe UI, sans-serif',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '20px',
  },
  code: {
    color: '#4CAF50',
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '15px',
    flexWrap: 'wrap',
  },
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
  legendLabel: {
    fontSize: '12px',
    color: '#555',
  },
  slotsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  slotButton: {
    backgroundColor: '#ffffff',
    color: '#333',
    border: '2px solid #4CAF50',
    padding: '20px',
    borderRadius: '20px',
    width: '120px',
    height: '120px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookedSlot: {
    backgroundColor: '#bbb',
    borderColor: '#999',
    color: '#fff',
    cursor: 'not-allowed',
  },
  unbookedSlot: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderColor: '#4CAF50',
  },
  icon: {
    fontSize: '28px',
    marginBottom: '10px',
  },
  slotLabel: {
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default SlotsBook;
