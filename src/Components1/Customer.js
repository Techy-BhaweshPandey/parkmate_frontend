import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaParking } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Customer.css";
import axios from "axios";

const Customer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message1, message3, message4, message2 } = location.state || {};

  const [length, setLength] = useState(0);
  const [isOfferClicked, setIsOfferClicked] = useState(false);

  // AI chat feature logic
  const [showBot, setShowBot] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [showHelpPopup, setShowHelpPopup] = useState(false); // State for help popup

  const simpleAI = (input) => {
    const message = input.toLowerCase();

    if (message.includes("book")) return "Click on 'Book Parking' to get started.";
    if (message.includes("offer")) return "Check out the latest offers in the 'Offers' tab!";
    if (message.includes("feedback")) return "You can provide your feedback using the 'Provide Feedback' option.";
    if (message.includes("ticket") || message.includes("booking"))
      return "Go to 'Your Bookings' to manage tickets.";
    if (message.includes("logout")) return "Click the logout button on the top right to log out.";
    if (message.includes("hello") || message.includes("hi")) return "Hello! How can I assist you today?";
    if (message.includes("price")) return "Price is Rs20 for one hour but increases by Rs20 per hour.";
    if (message.includes("safe")) return "Yes, the parking is absolutely safe!";
    return "Sorry, I cannot answer that. Try asking about booking, offers, or feedback.";
  };

  const handleAskBot = () => {
    if (userInput.trim() !== "") {
      const response = simpleAI(userInput);
      setAiReply(response);
      setUserInput(""); // Clear input after asking
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleChatbotClick = (e) => {
    e.stopPropagation(); // Prevent click from closing the chatbot when inside it
  };

  const handleOpenBot = () => {
    setShowBot(true); // Open the chatbot
    setShowHelpPopup(false); // Close help popup if bot is opened
  };

  // Close the chatbot when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBot && !event.target.closest(".ai-widget") && !event.target.closest(".ai-chatbox")) {
        setShowBot(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showBot]);

  // Existing logic
  useEffect(() => {
    const clicked = localStorage.getItem("isOfferClicked");
    if (clicked === "true") {
      setIsOfferClicked(true);
    }
  }, []);

  useEffect(() => {
    axios
      .get("https://parkmate-back-3.onrender.com/api/offers")
      .then((response) => {
        setLength(response.data.length);
      })
      .catch((error) => console.error("Error fetching offers:", error));
  }, []);

  useEffect(() => {
    if (!message1) navigate("/Unaccess");
  }, [message1, navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("isOfferClicked");
      toast.success("Logged out successfully!");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  const handleOfferClick = () => {
    setIsOfferClicked(true);
    localStorage.setItem("isOfferClicked", "true");
  };

  return (
    <div className="Customer">
      {/* === Your Existing Nav + Content === */}
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <div className="navbar-logo">
              PARK MATE <FaParking />
            </div>
          </li>
          <li className="navbar-item">
            <Link
              to="/BookParking"
              state={{ name: message1, email: message4, code: message2 }}
              className="navbar-link"
            >
              Book Parking
            </Link>
          </li>
          <li className="navbar-item">
            <Link to={`/ViewBooking/${message2}`} className="navbar-link">
              Your Bookings/Tickets
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/Feedback"
              state={{ name: message1, email: message4, code: message2 }}
              className="navbar-link"
            >
              Provide Feedback
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/Offer" className="navbar-link" onClick={handleOfferClick} title={`Currently ${length} offers`}>
              Offers{" "}
              {!isOfferClicked && length > 0 && (
                <span className="notification-badge">{length}</span>
              )}
            </Link>
          </li>
          <li className="navbar-item profile-container">
           <Link to={`/ProfilePage/${message2}`} className="navbar-link" title="Click to view profile"> <span>Welcome, {message1}</span></Link>
            {message3 ? (
  <img
  src={`https://parkmate-back-3.onrender.com${message3}`}
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
            <AiOutlineLogout style={{ marginRight: "8px", fontSize: "18px" }} /> Logout
          </button>
        </ul>
      </nav>

      <div className="content">
        <h1>Welcome to Park Mate!</h1>
        <p>Explore parking spaces, manage your bookings, and get easy access to your profile.</p>

        {/* === Your existing feature sections === */}

        <section className="feature-section">
          <h2>Why Choose Park Mate?</h2>
          <ul>
            <li>Convenient parking spots available 24/7</li>
            <li>Easy and secure online booking system</li>
            <li>Instant booking confirmations</li>
            <li>Affordable pricing for all types of parking spots</li>
          </ul>
        </section>

        <section className="tips-section">
          <h2>Tips for Finding the Best Parking</h2>
          <p>Here are some tips to make your parking experience even better:</p>
          <ul>
            <li>Book your parking spot in advance to guarantee availability.</li>
            <li>Look for spots with the best proximity to your destination.</li>
            <li>Take advantage of discounts or offers available for frequent users.</li>
          </ul>
        </section>

        <section className="booking-summary">
          <h2>Your Booking Summary</h2>
          <p><strong>Name:</strong> {message1}</p>
          <p><strong>Email:</strong> {message4}</p>
          <p><strong>Code:</strong> {message2}</p>
          <p>
            Check out your{" "}
            <Link to={`/ViewBooking/${message2}`} className="view-booking-link">
              previous bookings
            </Link>{" "}
            to manage your upcoming parking slots.
          </p>
        </section>
      </div>

      {/* === AI Bot Widget (Floating on the right) === */}
      <div
        className="ai-widget"
        onClick={handleOpenBot}
        onMouseEnter={() => setShowHelpPopup(true)} // Show help on hover
        onMouseLeave={() => setShowHelpPopup(false)} // Hide help when mouse leaves
      >
        🤖
        {showBot && (
          <div className="ai-chatbox" onClick={handleChatbotClick}>
            <h4>Ask ParkMate AI</h4>
            <input
              type="text"
              placeholder="Ask me something..."
              value={userInput}
              onChange={handleInputChange}
            />
            <button onClick={handleAskBot}>Ask</button>
            <p className="ai-reply">{aiReply}</p>
          </div>
        )}

        {/* Help Popup (appears on hover) */}
        {showHelpPopup && (
          <div className="ai-help-popup">
            <h5>Try asking these:</h5>
            <ul>
              <li>How can I book a parking spot?</li>
              <li>What offers are available?</li>
              <li>How do I provide feedback?</li>
              <li>Where can I view my bookings?</li>
              <li>What is price of parking</li>
              <li>How do I logout?</li>
            </ul>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} />
    </div>
  );
};

export default Customer;
