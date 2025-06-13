import React, { useState, useEffect } from "react";
import './admin.css';
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaUser, FaUsers, FaRegEnvelope, FaRegComment, FaParking } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { AiOutlineLogout } from 'react-icons/ai';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image1 } = location.state || {};
  const [items, setItems] = useState([]);
  const [length, setLength] = useState(0);
  const [length1, setLength1] = useState(0);
  const [length2, setLength2] = useState(0);
  const [length4, setLength4] = useState(0);
  const [activeUserData, setActiveUserData] = useState([0]);
  const [totalParkingData, setTotalParkingData] = useState([0]);
  const [totalBookingData, setTotalBookingData] = useState([0]);
  const [totalFeedback, setTotalFeedback] = useState([0]);

  const [showFAQ, setShowFAQ] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  useEffect(() => {
    if (image1 === undefined) navigate('/Unaccess');
  }, [image1, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://parkmate-back-3.onrender.com/api3/items');
      const data = await res.json();
      setLength(data.length);
      setActiveUserData(prev => [...prev, data.length]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      const res = await fetch('https://parkmate-back-3.onrender.com/api4/items');
      const data = await res.json();
      setLength1(data.length);
      setTotalParkingData(prev => [...prev, data.length]);
    };
    fetchData2();
  }, []);

  useEffect(() => {
    const fetchData3 = async () => {
      const res = await fetch('https://parkmate-back-3.onrender.com/ViewBooking');
      const data = await res.json();
      setLength2(data.length);
      setTotalBookingData(prev => [...prev, data.length]);
    };
    fetchData3();
  }, []);

  useEffect(() => {
    const fetchData4 = async () => {
      const res = await fetch('https://parkmate-back-3.onrender.com/ViewFeedback');
      const data = await res.json();
      setLength4(data.length);
      setItems(data);
      setTotalFeedback(prev => [...prev, data.length]);
    };
    fetchData4();
  }, []);

  const data = {
    labels: Array.from({ length: activeUserData.length }, (_, i) => `Point ${i + 1}`),
    datasets: [
      { label: 'Active Users', data: activeUserData, borderColor: '#007bff', backgroundColor: 'rgba(0, 123, 255, 0.2)', fill: true, tension: 0.4 },
      { label: 'Total Parking', data: totalParkingData, borderColor: '#28a745', backgroundColor: 'rgba(40, 167, 69, 0.2)', fill: true, tension: 0.4 },
      { label: 'Total Booking', data: totalBookingData, borderColor: 'pink', backgroundColor: 'rgba(187, 42, 206, 0.2)', fill: true, tension: 0.4 },
      { label: 'Total Feedback', data: totalFeedback, borderColor: 'cyan', backgroundColor: 'rgba(13, 237, 166, 0.2)', fill: true, tension: 0.4 }
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' }, tooltip: { enabled: true } },
    scales: {
      x: { beginAtZero: true, grid: { color: '#f0f0f0' } },
      y: { beginAtZero: true, grid: { color: '#f0f0f0' } }
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="profile1-img">
            <img src={image1} alt="profile" />
          </div>
        </div>
        <ul className="sidebar-links">
          <li><FaUsers className="sidebar-icon" /><Link to='/AdminView'>View Details</Link></li>
          <li><FaUser className="sidebar-icon" /><Link to='/AdminView2'>Parking Details</Link></li>
          <li><button onClick={handleLogout} className="logout788-btn46"><AiOutlineLogout style={{ marginRight: '8px' }} /> Logout</button></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="dashboard">
          <h1>Welcome to the Admin Panel</h1>
          <p>Control center for managing customer data, admin operations, and viewing platform insights.</p>

          <div className="section">
            <h2><FaUsers /> User Statistics</h2>
            <div className="statistics">
              <div className="stat-card"><FaUser className="stat-icon" /><h4>Active Users</h4><p>{length}</p></div>
              <div className="stat-card"><FaParking className="stat-icon" /><h4>Total Parking</h4><p>{length1}</p></div>
              <div className="stat-card"><TbBrandBooking className="stat-icon" /><h4>Total Booking</h4><p>{length2}</p></div>
              <div className="stat-card"><FaRegEnvelope className="stat-icon" /><h4>Total Feedbacks</h4><p>{length4}</p></div>
            </div>
            <div className="graph"><Line data={data} options={options} /></div>
          </div>

          <div className="section">
            <button className="toggle-btn" onClick={() => setShowFAQ(!showFAQ)}>FAQ'S</button>
            {showFAQ && (
              <>
                <h2><FaRegComment /> FAQ'S</h2>
                <div className="activity">
                  <div className="activity-item"><h4>John Doe updated profile</h4><p>2 minutes ago</p></div>
                  <div className="activity-item"><h4>New user registered: Jane Smith</h4><p>1 hour ago</p></div>
                  <div className="activity-item"><h4>Sarah Johnson made a purchase</h4><p>5 hours ago</p></div>
                </div>
              </>
            )}
          </div>

          <div className="section">
            <button className="toggle-btn" onClick={() => setShowFeedback(!showFeedback)}> Feedback Overview</button>
            {showFeedback && (
              <>
                <h2><FaRegEnvelope /> Feedback Overview</h2>
                <div className="messages">
                  {items.map((item, index) => (
                    <div className="message-item" key={index}>
                      <p><strong>{item.name}</strong></p>
                      <p>{item.feedback}</p>
                      <span className="message-time">{item.Time}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="section">
            <button className="toggle-btn" onClick={() => setShowUpdates(!showUpdates)}> Platform Updates</button>
            {showUpdates && (
              <>
                <h2>Platform Updates</h2>
                <div className="updates">
                  <div className="update-item"><h4>Version 1.2.3 Released</h4><p>Bug fixes and performance improvements.</p></div>
                  <div className="update-item"><h4>New Feature: Dark Mode</h4><p>Dark mode now available!</p></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ToastContainer autoClose={1500} position="top-right" />
    </div>
  );
};

export default Admin;

// import React, { useState, useEffect } from "react";
// import './admin.css';  // Import the CSS file
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { FaUser, FaUsers, FaRegEnvelope, FaRegComment, FaParking } from "react-icons/fa"; // React icons
// import { AiOutlineLogout } from 'react-icons/ai';

// const Admin = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { image1 } = location.state || {};
//   const [length, setLength] = useState(0); // Active Users
//   const [length1, setLength1] = useState(0); // Total Parking

//   const handleLogout = () => {
//     alert("Logged out successfully");
//     navigate('/');
//   };

//   useEffect(() => {
//     if (image1 === undefined) {
//       navigate('/Unaccess');
//     }
//   }, [image1, navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('https://parkmate-back-3.onrender.com/api3/items');
//         const data = await response.json();
//         setLength(data.length); // Update active users length
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchData2 = async () => {
//       try {
//         const response = await fetch('https://parkmate-back-3.onrender.com/api4/items');
//         const data1 = await response.json();
//         setLength1(data1.length); // Update total parking length
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData2();
//   }, []);

//   // Calculate the width percentage based on data fetched from API
//   const maxLength = 1000; // Maximum active users (example value)
//   const maxLength1 = 500; // Maximum parking spots (example value)

//   const activeUserPercentage = (length / maxLength) * 100;
//   const totalParkingPercentage = (length1 / maxLength1) * 100;

//   return (
//     <div className="admin-container">
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <div className="profile1-img">
//             <img src={image1} alt="profile" />
//           </div>
//         </div>
//         <ul className="sidebar-links">
//           <li><FaUsers className="sidebar-icon" />  <Link to='/AdminView' className="a"> View Details</Link></li>
//           <li><FaUser className="sidebar-icon" />  <Link to='/AdminView2' className="a">Parking Details</Link></li>
//         </ul>
//         <button onClick={handleLogout} className="logout-btn">
//           <AiOutlineLogout style={{ marginRight: '8px', fontSize: '24px' }} />Logout
//         </button>
//       </div>
//       <div className="content-area">
//         <div className="dashboard">
//           <center><h1>Welcome to the Admin Panel</h1></center>
//           <p>Welcome to the Admin Dashboard! This is your control center for managing customer data, overseeing admin operations, and viewing important platform information. Use the sidebar to easily navigate between customer details, admin settings, and other crucial functionalities. As an admin, you have full access to manage the data that drives your platform. Please select an option from the sidebar to get started and ensure smooth operations.</p>

          
//           <div className="section">
//             <h2><FaUsers /> User Statistics</h2>
//             <div className="statistics">
//               <div className="stat-card">
//                 <FaUser className="stat-icon" />
//                 <h4>Active Users</h4>
//                 <p>{length}</p>
//               </div>
//               <div className="stat-card">
//                 <FaParking className="stat-icon" />
//                 <h4>Total Parking</h4>
//                 <p>{length1}</p>
//               </div>
//               <div className="stat-card">
//                 <FaRegEnvelope className="stat-icon" />
//                 <h4>Total Feedbacks</h4>
//                 <p>10</p>
//               </div>
//             </div>

//             <div className="graph">
//               <div className="bar">
//                 <div className="bar-label">Active Users</div>
//                 <div className="bar-fill" style={{ width: `${activeUserPercentage}%` }}></div>
//                 <span className="percentage">{activeUserPercentage.toFixed(0)}%</span>
//               </div>
//               <div className="bar">
//                 <div className="bar-label">Total Parking</div>
//                 <div className="bar-fill" style={{ width: `${totalParkingPercentage}%` }}></div>
//                 <span className="percentage">{totalParkingPercentage.toFixed(0)}%</span>
//               </div>
//             </div>
//           </div>

         
//           <div className="section">
//             <h2><FaRegComment /> FAQ'S</h2>
//             <div className="activity">
//               <div className="activity-item">
//                 <h4>User John Doe updated profile</h4>
//                 <p>2 minutes ago</p>
//               </div>
//               <div className="activity-item">
//                 <h4>New user registered: Jane Smith</h4>
//                 <p>1 hour ago</p>
//               </div>
//               <div className="activity-item">
//                 <h4>User Sarah Johnson made a purchase</h4>
//                 <p>5 hours ago</p>
//               </div>
//             </div>
//           </div>

//           <div className="section">
//             <h2><FaRegEnvelope /> Feedbacks Overview</h2>
//             <div className="messages">
//               <div className="message-item">
//                 <p><strong>Jane Smith:</strong> "Hi, I'm having an issue with my account login."</p>
//                 <span className="message-time">3 mins ago</span>
//               </div>
//               <div className="message-item">
//                 <p><strong>John Doe:</strong> "Can I get a status update on my order?"</p>
//                 <span className="message-time">15 mins ago</span>
//               </div>
//               <div className="message-item">
//                 <p><strong>Sarah Johnson:</strong> "Any updates on the recent changes?"</p>
//                 <span className="message-time">1 hour ago</span>
//               </div>
//             </div>
//           </div>

//           <div className="section">
//             <h2>Platform Updates</h2>
//             <div className="updates">
//               <div className="update-item">
//                 <h4>Version 1.2.3 Released</h4>
//                 <p>Bug fixes and performance improvements.</p>
//               </div>
//               <div className="update-item">
//                 <h4>New Feature: Dark Mode</h4>
//                 <p>Dark mode now available for all users!</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Admin;
