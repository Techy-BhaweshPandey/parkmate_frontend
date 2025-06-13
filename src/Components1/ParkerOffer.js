import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ParkerOffer = () => {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [expiringTodayOffers, setExpiringTodayOffers] = useState([]);
  const [showExpiringBox, setShowExpiringBox] = useState(true);
  const { message6, Parkingname } = useParams();

  useEffect(() => {
    if (message6) {
      axios
        .get(`http://localhost:5000/api/offers/${message6}`)
        .then((response) => {
          setOffers(response.data);

          const today = new Date().toISOString().split('T')[0];
          const todayExpiring = response.data.filter((offer) => {
            const offerDate = offer.expiryDate
              ? new Date(offer.expiryDate).toISOString().split('T')[0]
              : null;
            return offerDate === today;
          });

          setExpiringTodayOffers(todayExpiring);
          setShowExpiringBox(todayExpiring.length > 0);
        })
        .catch((error) => console.error('Error fetching offers:', error));
    }
  }, [message6]);

  const handleAddOffer = () => {
    if (!newOffer.trim() || !expiryDate) {
      toast.error('Enter the offer and expiry date', {
        position: 'top-right',
        autoClose: 2200,
      });
      return;
    }

    axios
      .post('http://localhost:5000/api/offers', {
        offerText: newOffer,
        parkingCode: message6,
        Parkingname: Parkingname,
        expiryDate: expiryDate,
      })
      .then((response) => {
        setOffers([response.data, ...offers]);
        setNewOffer('');
        setExpiryDate('');
        toast.success('Offer added successfully!', {
          autoClose: 1500,
        });
      })
      .catch((error) => {
        toast.error('Error adding offer');
        console.error('Error adding offer:', error);
      });
  };

  const handleDeleteOffer = (id) => {
    setOfferToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (offerToDelete) {
      axios
        .delete(`http://localhost:5000/api/offers/${offerToDelete}`)
        .then(() => {
          const updatedOffers = offers.filter((offer) => offer._id !== offerToDelete);
          setOffers(updatedOffers);

          // Remove from expiringTodayOffers as well
          const updatedExpiring = expiringTodayOffers.filter((offer) => offer._id !== offerToDelete);
          setExpiringTodayOffers(updatedExpiring);
          if (updatedExpiring.length === 0) setShowExpiringBox(false);

          setIsModalOpen(false);
          toast.success('Offer deleted');
        })
        .catch((error) => {
          toast.error('Error deleting offer');
          console.error('Error deleting offer:', error);
        });
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setOfferToDelete(null);
  };

  const hideExpiringBox = () => {
    setShowExpiringBox(false);
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h2 style={styles.heading}>🚗 Parker Offers</h2>

      {showExpiringBox && expiringTodayOffers.length > 0 && (
        <div style={styles.expiringBox}>
          <div style={styles.expiringHeader}>
            <h3 style={styles.expiringHeading}>⚠️ Offer(s) Expiring Today</h3>
            <button onClick={hideExpiringBox} style={styles.closeButton}>✖</button>
          </div>
          {expiringTodayOffers.map((offer) => (
            <div key={offer._id} style={styles.expiringItem}>
              <p><strong>Offer:</strong> {offer.offerText}</p>
              <p><strong>Expiry:</strong> {new Date(offer.expiryDate).toLocaleDateString()}</p>
              <p style={styles.expiringNote}>🗑️ Delete it from your panel if no longer valid.</p>
            </div>
          ))}
        </div>
      )}

      <div style={styles.formCard}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Offer Description</label>
          <input
            type="text"
            placeholder="e.g. 50% off on weekend bookings"
            value={newOffer}
            onChange={(e) => setNewOffer(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Offer Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={handleAddOffer} style={styles.button}>
            ➕ Add Offer
          </button>
        </div>
      </div>

      <div style={styles.offerTable}>
        {offers.length === 0 ? (
          <p style={styles.noOffersText}>No offers available yet. 🤷‍♂️</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>📄 Offer</th>
                <th style={styles.tableHeader}>📅 Expiry</th>
                <th style={styles.tableHeader}>🛠️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{offer.offerText}</td>
                  <td style={styles.tableCell}>
                    {offer.expiryDate
                      ? new Date(offer.expiryDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td style={styles.tableCell}>
                    <MdDelete
                      style={styles.deleteIcon}
                      title="Delete offer"
                      onClick={() => handleDeleteOffer(offer._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ fontSize: '20px', color: '#333' }}>
              Are you sure you want to delete this offer?
            </h3>
            <div style={styles.modalActions}>
              <button onClick={confirmDelete} style={styles.modalButton}>
                Yes, Delete
              </button>
              <button onClick={cancelDelete} style={styles.modalButtonCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1000px',
    margin: 'auto',
    fontFamily: 'Inter, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#2b2f4a',
    marginBottom: '40px',
  },
  formCard: {
    background: 'linear-gradient(to right, #e0ecff, #f6f9ff)',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '40px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '16px',
    color: '#333',
  },
  input: {
    padding: '12px 14px',
    width: '100%',
    border: '1.5px solid #c9d6ff',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff',
    transition: 'all 0.3s',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  button: {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  offerTable: {
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '14px 20px',
    backgroundColor: '#f4f7fc',
    color: '#2c3e50',
    fontSize: '16px',
    fontWeight: '600',
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
  },
  tableCell: {
    padding: '14px 20px',
    fontSize: '15px',
    color: '#444',
  },
  deleteIcon: {
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '22px',
  },
  noOffersText: {
    textAlign: 'center',
    color: '#999',
    fontSize: '18px',
    fontStyle: 'italic',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  modalActions: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  modalButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  modalButtonCancel: {
    backgroundColor: '#7f8c8d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  expiringBox: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
    position: 'relative',
  },
  expiringHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  expiringHeading: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#856404',
  },
  expiringItem: {
    marginBottom: '10px',
    padding: '10px 15px',
    borderRadius: '6px',
    backgroundColor: '#fff8dc',
    color: '#856404',
    borderLeft: '4px solid #ffc107',
  },
  expiringNote: {
    marginTop: '6px',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#856404',
  },
};

export default ParkerOffer;
