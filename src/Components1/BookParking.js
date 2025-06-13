import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './BookParking.css';
import { Link,useLocation } from 'react-router-dom';
const BookParking = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('searchTerm') || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const location=useLocation();
  const transfer = location.state || {}; // The transfer object
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const spotsPerPage = 2; // Set how many items you want per page

  // Calculate index range for current page
  const indexOfLastSpot = currentPage * spotsPerPage;
  const indexOfFirstSpot = indexOfLastSpot - spotsPerPage;
  const currentSpots = filteredSpots.slice(indexOfFirstSpot, indexOfLastSpot);

  // Simulate fetching data from a database or API
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await fetch('https://parkmate-back-3.onrender.com/api4/items'); // Replace with real API endpoint
        const data = await response.json();
        setParkingSpots(data);
        setLoading(false);

        if (searchTerm) {
          const filtered = data.filter(spot =>
            spot.ParkingArea.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredSpots(filtered);
        } else {
          setFilteredSpots(data);
        }
      } catch (err) {
        setError('Failed to load parking data.');
        setLoading(false);
      }
    };

    fetchParkingData();
  }, [searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    localStorage.setItem('searchTerm', value);

    // Filter based on search term
    const filtered = parkingSpots.filter(spot =>
      spot.ParkingArea.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSpots(filtered);

    setShowDropdown(value.length > 0 && filtered.length > 0);
  };

  const handleDropdownSelect = (spot) => {
    setSearchTerm(spot.ParkingArea);
    setShowDropdown(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="loading">Loading parking spots...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredSpots.length / spotsPerPage);

  return (
    <div className="parking-container">
      <header className="header">
        <h1 className='content8'>Parking Spaces</h1>
       <p className='parking'>Select a parking spot below</p>
      </header>

      {/* Search Bar with Icon */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by  Area..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <FaSearch className="search6-icon" />
        {showDropdown && searchTerm && (
          <div className="search-dropdown">
            {filteredSpots.map((spot) => (
              <div key={spot._id} className="dropdown-item" onClick={() => handleDropdownSelect(spot)}>
                {spot.ParkingArea}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display the filtered parking spots */}
      <div className="parking-grid">
        {currentSpots.length === 0 && searchTerm !== '' && (
          <div className="no-results">No parking spots found for "{searchTerm}"</div>
        )}
        {currentSpots.map(spot => (
          <div key={spot._id} className="parking-spot">
           <img src={`https://parkmate-back-3.onrender.com${spot.file}`} alt={`Img of ${spot.ParkingName}`} />

            <div className="spot-info">
              <h2>{spot.ParkingName}</h2>
              <h3>Parking Area: {spot.ParkingArea}</h3>
              <h3>Parking Slots: {spot.Slots}</h3>
              <h3>Parking Address: {spot.ParkingAddress}</h3>
            </div>
            
            <Link to={`/Booking/${spot.Slots}/${spot.ParkingCode}/${spot.ParkingArea}/${spot.ParkingName}/${spot.ParkingSpaceCode}`} state={transfer}>

  <button className="book-btn">Book Parking</button>
</Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookParking;
