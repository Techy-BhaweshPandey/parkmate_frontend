import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Offer.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Offer = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    axios.get('https://parkmate-back-3.onrender.com/api/offers')
      .then((response) => setOffers(response.data))
      .catch((error) => console.error('Error fetching offers:', error));
  }, []);

  const handleShare = (offerId, offerText) => {
    const currentUrl = window.location.href;  // Get the current page URL
    navigator.clipboard.writeText(currentUrl)
      .then(() => toast.success('Offer copied successfully'))
      .catch(() => alert('❌ Failed to copy.'));
  }

  return (
    <div className="offer-container">
      <h1 className="header">🎉 All Offers for You! 🎁</h1>
      <div className="offer-grid">
        {offers.length === 0 ? (
          <p className="no-offers">No offers available yet. 🤷‍♂️</p>
        ) : (
          offers.map((offer) => (
            <div key={offer._id} className="offer-card">
              <h3 className="offer-text">{offer.offerText}</h3>
              <h4>Parking Code: {offer.parkingCode}</h4>
              <h5>Parking Name: {offer.Parkingname}</h5>
              <h5>Offer Expiry: {offer.expiryDate
  ? new Date(offer.expiryDate).toISOString().split('T')[0]
  : 'N/A'}
</h5>
              <button onClick={() => handleShare(offer._id, offer.offerText)} className="share-btn">📋 Share</button>
            </div>
          ))
        )}
      </div>
       <ToastContainer 
                    position="top-right" 
                    autoClose={1100} 
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
};

export default Offer;
