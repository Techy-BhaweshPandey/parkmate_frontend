import React, { useState } from "react";
import "./Login.css";  // Ensure to import your CSS file
import {Link} from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SiSimplelogin } from "react-icons/si";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import Swal from 'sweetalert2';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(""); // Add state for User Role
 const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    userRole: "", // Add error state for userRole
  });
const navigate=useNavigate();
  const validateForm = () => {
    let valid = true;
    let errors = {
      email: "",
      password: "",
      username: "",
      userRole: "", // Add validation for userRole
    };

    // Email validation (gmail.com, yahoo.com)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail.com|yahoo.com)$/;
    if (!email) {
      errors.email = "Email is required!";
      valid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email (gmail.com or yahoo.com)";
      valid = false;
    }

    // Password validation (at least 6 characters)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
    if (!password) {
      errors.password = "Password is required!";
      valid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      valid = false;
    } else if (!passwordRegex.test(password)) {
      errors.password = "Password must contain atleast one uppercase, lowercase, and special character";
      valid = false;
    }
    // Username validation (at least 4 characters)
    if (!username) {
      errors.username = "Username is required!";
      valid = false;
    } else if (username.length < 4) {
      errors.username = "Username must be at least 4 characters long";
      valid = false;
    }

    // User Role validation (must be selected)
    if (!userRole) {
      errors.userRole = "Please select a user role";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log(email);
      console.log(password);
      console.log(username);
      console.log(userRole);
     
      
      // Handle form submission logic here
      axios.post('http://localhost:5000/login',{email,password,username,userRole})
      .then(result=>{console.log(result) 
        const {message}  = result.data;
        const {message1}=result.data;
        const {message2}=result.data;
   
        const image={image1:message2};
        // Create the data object with message
        const data2 = { message1: username, message2: message,message3:message2 ,message4:email};
        console.log(data2);
          if(message1==='Success'&&userRole==="Customer")
          {
            Swal.fire({
              icon: 'success',
              title: `Congratulations ${data2.message1}`,
              text: 'Login Successfully',
            }).then((result) => {
              if (result.isConfirmed) {
                // Redirect to the desired page using navigate
                navigate('/Customer',{state:data2}); // Replace with your target route
              }
            });
                      
                       
                        // Log success response from the backend
                 
         
          }
          else if(message1==='Success'&&userRole==="Parker")
            {
              Swal.fire({
                icon: 'success',
                title: `Congratulations ${data2.message1}`,
                text: 'Login Successfully',
              }).then((result) => {
                if (result.isConfirmed) {
                  // Redirect to the desired page using navigate
                  navigate('/Parker',{state:data2}); // Replace with your target route
                }
              });
          
            }
            else if(message1==='Success'&&userRole==="Admin")
              {
                Swal.fire({
                  icon: 'success',
                  title: 'Congratulations',
                  text: 'Admin Login Successfully',
                }).then((result) => {
                  if (result.isConfirmed) {
                    // Redirect to the desired page using navigate
                    navigate('/Admin',{ state: image }); // Replace with your target route
                  }
                });
             
              }
             
             else if(result.data==='Invalid password')
              toast.warn("Invalid Password");

              
            else if(result.data==='Invalid username')
              toast.warn("Invalid username")
            else if(result.data==='Wrong Role')
              toast.warn("Wrong user role chosen")

            else
            toast.error("Invalid entry,email does not exists");
      })
     .catch(err=>console.log(err));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login <SiSimplelogin size={30} /></h2> 
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label>Email<span className="asterik">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-field">
                     <label>Password<span className="asterik">*</span></label>
                     <div style={{ position: "relative" }}>
                       <input
                         type={showPassword ? "text" : "password"}
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="Enter your password"
                       />
                       <span
                         onClick={toggleShowPassword}
                         style={{
                           position: "absolute",
                           right: "10px",
                           top: "50%",
                           transform: "translateY(-50%)",
                           cursor: "pointer",
                           color: "#555",
                         }}
                       >
                         {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                       </span>
                     </div>
                     {errors.password && <p className="error-text">{errors.password}</p>}
                   </div>

          <div className="input-field">
            <label>Username<span className="asterik">*</span></label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
          <br></br>
          {/* New select input for user role */}
          <div className="input-field">
            <label>User Role<span className="asterik">*</span></label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Customer">Customer</option>
              <option value="Parker">Parking Person</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.userRole && <p className="error-text">{errors.userRole}</p>}
          </div>
<br></br>

          <button type="submit" className="submit1-btn">
          Login
          </button>
          <br>
          </br>
          <br></br>
          Don't have an account?<Link to='/Register'>Register</Link>
        </form>
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

export default Login;
