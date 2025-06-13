import React from 'react';
import Navbar2 from './ParkNavbar';
import { useLocation } from 'react-router-dom';
const Parker = () => {
 
  const location = useLocation();
  const { message1 } = location.state || {};
  const { message2 } = location.state || {};
  const { message3 } = location.state || {};
  
  return (
   
   <>
      <Navbar2  message={message1} message6={message2} messageimg={message3}/>  
     
    </>
  );
};

export default Parker;



