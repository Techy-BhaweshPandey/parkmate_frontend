import React, { useState, useEffect } from 'react';
import { FaParking } from 'react-icons/fa';
import { AiOutlineLogout } from 'react-icons/ai';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ParkerNavbar.css';
import axios from 'axios';
import { MdOutlineAccountCircle } from "react-icons/md";
function App({ message, message6, messageimg }) {
  const navigate = useNavigate();
  const [length2, setLength] = useState(0);
  const [length4, setLength4] = useState(0);
  const [length6, setLength6] = useState(0);
const[Parkingname,setname]=useState('')
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate('/'); // Redirect after the toast is shown
      }, 1500); // Delay of 1.5 seconds (adjust as needed)
    }
  };
  
  useEffect(() => {
    if (message6) {
      axios
        .get(`https://parkmate-back-3.onrender.com/api/offers/${message6}`)
        .then((response) => setLength6(response.data.length))
        .catch((error) => console.error('Error fetching offers:', error));
    }
  }, [message6]);
  useEffect(() => {
    if (message === undefined) {
      navigate('/Unaccess');
    }
  }, [message, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://parkmate-back-3.onrender.com/api2/items/${message6}`);
        const data = await response.json();
        setLength(data.length);
        let s = 0;
        for (let i = 0; i < data.length; i++) {
          s += data[i].Slots;
        }
        setname(data[0].ParkingName);
       
        setLength4(s);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [message6]);

  return (
    <div className="App">
      <nav className="navbar1">
        <ul>
          <li>PARK MATE <FaParking /></li>
          <li><Link to="/AddParking" state={message6}>Add Parking</Link></li>
          <li><Link to={`/ViewParking/${message6}`}>View Your Parking</Link></li>
          <li><Link to={`/ParkerOffer/${message6}/${Parkingname}`}>Add Offers</Link></li>
          <li><Link to={`/Cash/${message6}`}>CashCalculator</Link></li>
          <li className="navbar-item profile-container">
           <Link to={`/ProfilePage/${message6}`}title="Click to view profile">Welcome {message}</Link> 
           
          {messageimg ? (
            <img
              src={messageimg}
              alt="Profile"
              className="profile-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                const icon = document.createElement("span");
                icon.className = "fallback-icon";
                e.target.parentNode.appendChild(icon);
              }}
            />
          ) : (
            <MdOutlineAccountCircle className="profile-img" />
          )}
         
          </li>
          <button onClick={handleLogout} className="logout-btn">
            <AiOutlineLogout style={{ marginRight: '8px', fontSize: '24px' }} /> Logout
          </button>
        </ul>
      </nav>

      <div className="welcome-section">
        <h2>Welcome to PARK MATE</h2>
        <p>Your trusted parking partner to provide customers to your parking.</p>
      </div>

      <div className="content-container">
        <div className="card">
          <h3>Parking </h3>
          <p>{length2} parkings available</p>
        </div>
        <div className="card">
          <h3>Total Slots</h3>
          <p>{length4} Slots present</p>
        </div>
        <div className="card">
          <h3>Total Offers</h3>
          <p>{length6} offer present</p>
        </div>
      </div>

      {/* Add the ToastContainer here */}
      <ToastContainer 
        position="top-right" 
        autoClose={1500} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
}

export default App;
