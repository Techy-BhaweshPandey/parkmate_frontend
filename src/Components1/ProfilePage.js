import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faMapMarkerAlt, faEdit,  faLock, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #d1c4e9, #bbdefb);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const Avatar = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const Name = styled.h1`
  font-size: 2.8rem;
  font-weight: bold;
  color: #0056b3;
  margin-bottom: 1rem;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  margin: 0.6rem 0;
  color: #333;
  text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.6);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const VerifiedInfo = styled(InfoItem)`
  color: green;
  font-weight: bold;
  font-size: 1.25rem;

  svg {
    font-size: 1.3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;

    svg {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;

    svg {
      font-size: 1rem;
    }
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #007BFF;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.8rem;
  }
`;

const Button = styled.button`
  background: ${(props) => (props.delete ? '#ff4d4f' : '#007BFF')};
  color: white;
  border: none;
  padding: 0.8rem 1.6rem;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.delete ? '#b30000' : '#0056b3')};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.7rem 1.4rem;
  }
`;

const UserCard = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 16px;
  width: 350px;
  max-width: 90%;
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  .popup-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #0056b3;
  margin: -0.4rem 0 0.4rem;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 0.8rem;
  font-size: 1rem;
`;

const ProfileView = () => {
  const { message6 } = useParams();
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const usernameInputRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`https://parkmate-back-3.onrender.com/apiprof/items/${message6}`);
        setItems(response.data);
        if (response.data.length > 0) {
          setEditableData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [message6]);

  const handleEditClick = () => {
    setShowPopup(true);
  };

  const handlePopupResponse = (response) => {
    if (response === 'yes') {
      setIsEditing(true);
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
    setShowPopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value
    });
  };

  const handleModifyDetails = async () => {
    try {
      await axios.put(`https://parkmate-back-3.onrender.com/apiprof/items/${message6}`, editableData);
      toast.success("Profile updated successfully!");
      setItems([editableData]);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error('Error saving changes:', error);
    }
  };

  const handlePasswordClick = () => {
    toast.error("Cannot edit password.");
  };

  return (
    <Container>
      {/* Background shapes */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        backgroundColor: '#007BFF',
        borderRadius: '50%',
        opacity: 0.1,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '350px',
        height: '350px',
        backgroundColor: '#bbdefb',
        borderRadius: '50%',
        opacity: 0.15,
      }} />

      {items.length > 0 ? (
        items.map((item, index) => (
          <UserCard key={index}>
            <Avatar src={item.file} alt="User Avatar" />
            {isEditing ? (
              <>
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  name="username"
                  value={editableData.username || ''}
                  onChange={handleInputChange}
                  ref={usernameInputRef}
                />

                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={editableData.email || ''}
                  onChange={handleInputChange}
                />

                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={editableData.password || ''}
                  readOnly
                  onClick={handlePasswordClick}
                />

                <Label htmlFor="uniqcode">Parking Code</Label>
                <Input
                  type="text"
                  name="uniqcode"
                  value={editableData.uniqcode || ''}
                  onChange={handleInputChange}
                  readOnly
                />
              </>
            ) : (
              <>
                <Name>{item.username}</Name>
                <InfoItem><Icon icon={faEnvelope} /> {item.email}</InfoItem>
                <InfoItem><Icon icon={faLock} /> {item.password}</InfoItem>
                <InfoItem><Icon icon={faMapMarkerAlt} /> {item.uniqcode}</InfoItem>
                <VerifiedInfo>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Verified Account
                </VerifiedInfo>
              </>
            )}
          </UserCard>
        ))
      ) : (
        <InfoItem>
          <Icon icon={faMapMarkerAlt} /> No data found.
        </InfoItem>
      )}

      <ButtonGroup>
        {!isEditing ? (
          <Button onClick={handleEditClick}>
            <FontAwesomeIcon icon={faEdit} /> Edit Profile
          </Button>
        ) : (
          <Button onClick={handleModifyDetails}>Modify Details</Button>
        )}
      </ButtonGroup>

      {showPopup && (
        <Popup>
          <div className="popup-content">
            <p>Do you want to edit your profile?</p>
            <Button onClick={() => handlePopupResponse('yes')}>Yes</Button>
            <Button onClick={() => handlePopupResponse('no')}>No</Button>
          </div>
        </Popup>
      )}

      <ToastContainer autoClose={1500} />
    </Container>
  );
};

export default ProfileView;
