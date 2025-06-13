import React, { useState } from "react";
import "./Feedback.css";
import { FaThumbsUp, FaStar } from 'react-icons/fa';
import { useLocation } from "react-router-dom";

const Feedback = () => {
  const location = useLocation();
  const transfer = location.state || {};
  const currentTime = new Date().toISOString().split('T')[0] + " " + new Date().toTimeString().split(' ')[0];
  const [formData, setFormData] = useState({
    name: transfer.name || '',
    email: transfer.email || '', 
    feedback: "",
    Time: currentTime,  // Initially set to empty; we will populate it with system time on submit
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");  // To store error message

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Check if the feedback is not empty
    if (!formData.feedback.trim()) {
      setError("Feedback is required");
      return;  // Stop the form submission if feedback is empty
    }

    // Set the system time on form submit
     // Get current system time in ISO format
console.log(currentTime);
    // Update formData with the current system time
    setFormData((prevData) => ({
      ...prevData,
    }));
    setSubmitted(true);
    setError("");  // Clear any existing error message

    // Send data to the backend (after setting the Time)
    fetch('https://parkmate-back-3.onrender.com/api/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),  // Send the formData with the system time
    })
    .then((response) => {
      if (response.ok) {
        console.log('Feedback submitted successfully');
      } else {
        console.error('Failed to submit feedback');
      }
    })
    .catch((error) => {
      console.error('Error submitting feedback:', error);
    });
  };

  return (
    <div className="feedback">
      <div className="feedback-container">
        <div className="feedback-box">
          <h2 className="feedback-title">
            We Value Your Feedback and Trust you have on Us <FaStar />
          </h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="feedback-form">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                readOnly
                onChange={handleChange}
                placeholder="Enter your name"
              />

              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                onChange={handleChange}
                placeholder="Enter your email"
              />

              <label htmlFor="feedback">Your Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Your feedback here..."
              ></textarea>
              {/* Display error message if feedback is empty */}
              {error && <div className="error5-message">{error}</div>}

              <button type="submit" className="submit-btn">
                Submit Feedback
              </button>
            </form>
          ) : (
            <div className="thank-you-message">
              <h3><FaThumbsUp /> Thank you for your feedback!</h3>
              <p>We appreciate your input and will review it shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
