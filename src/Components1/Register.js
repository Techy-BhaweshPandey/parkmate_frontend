import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineAppRegistration } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Swal from 'sweetalert2';
const Register = () => {
  const [email, setEmail] = useState("");
  const [items, setItems] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [uniqcode, setUniqCode] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    userRole: "",
    uniqcode: "",
  });
  const [codeExists, setCodeExists] = useState(false);
 
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "Customer") {
      setUniqCode("CU");
    } else if (userRole === "Parker") {
      setUniqCode("PA");
    } else {
      setUniqCode("");
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api3/items');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userRole]);

  const validateForm = () => {
    let valid = true;
    let errors = {
      email: "",
      password: "",
      username: "",
      userRole: "",
      uniqcode: "",
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail.com|yahoo.com)$/;
    if (!email) {
      errors.email = "Email is required!";
      valid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email (gmail.com or yahoo.com)";
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
    if (!password) {
      errors.password = "Password is required!";
      valid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      valid = false;
    } else if (!passwordRegex.test(password)) {
      errors.password = "Password must contain uppercase, lowercase, and special character";
      valid = false;
    }

    if (!username) {
      errors.username = "Username is required!";
      valid = false;
    } else if (username.length < 4) {
      errors.username = "Username must be at least 4 characters long";
      valid = false;
    }

    if (!userRole) {
      errors.userRole = "Please select a user role";
      valid = false;
    }

    if (!uniqcode) {
      errors.uniqcode = "Uniq is required!";
      valid = false;
    } else if (uniqcode.length < 4) {
      errors.uniqcode = "Uniqcode must be at least 4 characters long";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const checkUniqCodeExists = (code) => {
    return items.some(item => item.uniqcode === code);
  };

  const checkEmailExists = (email) => {
    return items.some(item => item.email === email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (checkUniqCodeExists(uniqcode)) {
        setCodeExists(true);
        return;
      } else {
        setCodeExists(false);
      }

      if (checkEmailExists(email)) {
        toast.error("Email already exists!");
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("username", username);
      formData.append("userRole", userRole);
      formData.append("uniqcode", uniqcode);
      if (file) {
        formData.append("file", file);
      }

      try {
        const response = await fetch("http://localhost:5000/api/data", {
          method: "POST",
          body: formData,
        });
        const data = await response.text();
        if (response.ok) {
          console.log(data);
          Swal.fire({
                            icon: 'success',
                            title: 'Congratulations',
                            text: 'Registration Done Successfully',
                          }).then((result) => {
                            if (result.isConfirmed) {
                              // Redirect to the desired page using navigate
                              navigate('/Login', { state: { code: uniqcode } }); // Replace with your target route
                            }
                          });
         
        } else {
          throw new Error(data);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the form.");
      }
    }
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUniqcodeChange = (e) => {
    const typedValue = e.target.value;
    if (userRole === "Customer" && !typedValue.startsWith("CU")) {
      setUniqCode("CU" + typedValue.slice(2));
    } else if (userRole === "Parker" && !typedValue.startsWith("PA")) {
      setUniqCode("PA" + typedValue.slice(2));
    } else {
      setUniqCode(typedValue);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>SIGN UP <MdOutlineAppRegistration size={30} /></h2>
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

          <div className="input-field">
            <label>User Role<span className="asterik">*</span></label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Customer">Customer</option>
              <option value="Parker">Parking Person</option>
            </select>
            {errors.userRole && <p className="error-text">{errors.userRole}</p>}
          </div>

          <div className="input-field">
            <label>Make a Code<span className="asterik">*</span></label>
            <input
              type="text"
              value={uniqcode}
              onChange={handleUniqcodeChange}
              placeholder="Enter your code"
            />
            {errors.uniqcode && <p className="error-text">{errors.uniqcode}</p>}
            {codeExists && <p className="error-text">This uniqcode already exists. Please enter a different code.</p>}
          </div>

          <div className="input-field">
            <label>Upload File</label>
            <input type="file" onChange={handleFileUpload} />
          </div>

          <button type="submit" className="submit1-btn">
            Submit
          </button>
        </form>
      </div>
      
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
};

export default Register;
