import React from 'react';
import {BrowserRouter as Router, Route,  Routes} from "react-router-dom";
import LandingPage from './Components1/LandingPark';
import Login from './Components1/Login';
import Register from './Components1/Register';
import Parker from './Components1/Parker';
import AddParking from './Components1/AddParking';
import ViewParking from './Components1/ViewParking';
import Update from './Components1/UpdatePark';
import Admin from './Components1/Admin';
import AdminView from './Components1/AdminView';
import AdminView2 from './Components1/AdminView2';
import Customer from './Components1/Customer';
import Unaccess from  './Components1/Unaccess';
import BookParking from './Components1/BookParking'
import Booking from './Components1/Booking'
import ViewBooking from './Components1/ViewBooking';
import Feedback from './Components1/Feedback';
import Offer from './Components1/Offer';
import ParkerOffer from './Components1/ParkerOffer';
import Cash from './Components1/Cash';
import SlotsBook from './Components1/SlotsBook';
import ProfilePage from './Components1/ProfilePage';
import ViewEntry from './Components1/ViewEntry';
import './App.css';
const App = () => {
  return (
    <Router>
     <Routes>
                <Route  path="/" element={<LandingPage/>} /> 
                <Route  path="/Login" element={<Login/>} /> 
                <Route  path="/Register" element={<Register/>} /> 
                <Route  path="/Parker" element={<Parker/>} /> 
                <Route  path="/AddParking" element={<AddParking/>} /> 
                <Route  path="/ViewParking/:message6" element={<ViewParking/>} /> 
                <Route path='/UpdatePark/:id' element={<Update/>} />
                <Route  path="/Admin" element={<Admin/>} /> 
                <Route  path="/AdminView" element={<AdminView/>} /> 
                <Route  path="/AdminView2" element={<AdminView2/>} /> 
                <Route  path="/Customer" element={<Customer/>} /> 
                <Route  path="/Unaccess" element={<Unaccess/>} /> 
                <Route  path="/BookParking" element={<BookParking/>} /> 
                <Route path="/Booking/:Slots/:Code/:ParkingArea/:ParkingName/:ParkingSpaceCode" element={<Booking />} />
                <Route path="/ViewBooking/:message2" element={<ViewBooking />} />
                <Route path="/Feedback" element={<Feedback />} />
                <Route path="/Offer" element={<Offer />} />
                <Route path="/ParkerOffer/:message6/:Parkingname" element={<ParkerOffer />} />
                <Route path="/Cash/:message6" element={<Cash />} />
                <Route path="/SlotsBook/:Slot/:ParkingSpaceCode" element={<SlotsBook />} />
                <Route path="/ProfilePage/:message6" element={<ProfilePage />} />
                <Route path="/ViewEntry/:ParkingSpaceCode" element={<ViewEntry />} />
                </Routes>
    </Router>
  );
};

export default App;

