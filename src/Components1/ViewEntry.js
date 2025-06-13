import React, { useState, useEffect } from "react";
import "./ViewEntry.css";
import { useParams } from "react-router-dom";

// Font Awesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";

const ViewEntry = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { ParkingSpaceCode } = useParams();

  // Fetch data and filter deleted items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/apidata/items/${ParkingSpaceCode}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const deletedVehicleNumbers =
          JSON.parse(localStorage.getItem("deletedVehicles")) || [];

        const filteredData = data.filter(
          (entry) => !deletedVehicleNumbers.includes(entry.VehicleNumber)
        );

        setEntries(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (ParkingSpaceCode) fetchData();
  }, [ParkingSpaceCode]);

  const handleCheckIn = (index) => {
    const currentTime = new Date().toLocaleString();
    const updatedEntries = [...entries];
    updatedEntries[index].checkInTime = currentTime;
    setEntries(updatedEntries);
  };

  const handleCheckOut = (index) => {
    const currentTime = new Date().toLocaleString();
    const updatedEntries = [...entries];
    updatedEntries[index].checkOutTime = currentTime;
    setEntries(updatedEntries);
  };

 const calculatePrice = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) return 0;

  const checkInDate = new Date(checkInTime);
  const checkOutDate = new Date(checkOutTime);

  if (isNaN(checkInDate) || isNaN(checkOutDate)) return 20;

  const diffInMillis = checkOutDate - checkInDate;
  const diffInHours = diffInMillis / (1000 * 60 * 60);

  if (diffInHours < 1 && diffInHours > 0) return 20;
  if (diffInHours <= 0) return 20;

  return parseFloat(diffInHours * 20).toFixed(2);
};


  const handleDeleteRow = (index) => {
    const vehicleNumber = entries[index].VehicleNumber;
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);

    const deletedVehicles =
      JSON.parse(localStorage.getItem("deletedVehicles")) || [];

    if (!deletedVehicles.includes(vehicleNumber)) {
      deletedVehicles.push(vehicleNumber);
      localStorage.setItem("deletedVehicles", JSON.stringify(deletedVehicles));
    }
  };

  const handleRestoreAll = () => {
    localStorage.removeItem("deletedVehicles");
    window.location.reload(); // Re-fetches the original data
  };

  const filteredEntries = entries.filter((entry) =>
    (entry.VehicleNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <header className="header">
        <h2>Parking Management</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Vehicle Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <button className="btn restore-btn" onClick={handleRestoreAll}>
            <FontAwesomeIcon icon={faUndo} /> Restore All
          </button>
        </div>
      </header>

      <table className="parking-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Slot No</th>
            <th>Vehicle Number</th>
            <th>Booking In Time</th>
            <th>Time</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", color: "red" }}>
                No vehicle present at now
              </td>
            </tr>
          ) : (
            filteredEntries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.username}</td>
                <td>{entry.email}</td>
                <td>{entry.SlotNo}</td>
                <td>{entry.VehicleNumber}</td>
                <td>{entry.bookingTime}</td>

                <td className="button-group">
                  <button
                    className="btn check-in"
                    onClick={() => handleCheckIn(index)}
                  >
                    Check In
                  </button>
                  {entry.checkInTime && <p>{entry.checkInTime}</p>}
                </td>

                <td className="button1-group">
                  <button
                    className="btn check-out"
                    onClick={() => handleCheckOut(index)}
                  >
                    Check Out
                  </button>
                  {entry.checkOutTime && <p>{entry.checkOutTime}</p>}
                </td>

                <td className="price-column">
                  <button
                    className="btn price-btn"
                    onClick={() => {
                      const updatedEntries = [...entries];
                      updatedEntries[index].price = calculatePrice(
                        entry.checkInTime,
                        entry.checkOutTime
                      );
                      setEntries(updatedEntries);
                    }}
                  >
                    Calculate Price
                  </button>
                  {entry.price && (
                    <span className="price-display">₹{entry.price}</span>
                  )}
                </td>

                <td className="delete-column">
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDeleteRow(index)}
                    title="Delete Entry"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEntry;
