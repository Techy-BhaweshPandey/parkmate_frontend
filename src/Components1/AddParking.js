import React, { useState } from "react";
import "./Login.css"; // Replace with your actual CSS filename
import { useLocation } from "react-router-dom";
import { MdOutlineAppRegistration } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddParking = () => {
  const [ParkingName, setParkingName] = useState("");
  const [ParkingArea, setParkingArea] = useState("");
  const [Slots, setSlots] = useState(0);
  const [ParkingAddress, setParkingAddress] = useState("");
  const [ParkingSpaceCode, setParkingSpace] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({
    ParkingName: "",
    ParkingArea: "",
    Slots: "",
    ParkingAddress: "",
    ParkingSpaceCode: "",
    file: "",
  });

  const validateForm = () => {
    let valid = true;
    let errors = {
      ParkingName: "",
      ParkingArea: "",
      Slots: "",
      ParkingAddress: "",
      ParkingSpaceCode: "",
      file: "",
    };
    const numberPattern = /\d/;
    if (!ParkingName) {
      errors.ParkingName = "Parking name is required!";
      valid = false;
    } else if (ParkingName.length < 4) {
      errors.ParkingName = "Parking name must be at least 4 characters long";
      valid = false;
    }

    if (!ParkingArea) {
      errors.ParkingArea = "Parking area is required!";
      valid = false;
    } else if (ParkingArea.length < 4) {
      errors.ParkingArea = "Parking area must be at least 4 characters long";
      valid = false;
    } else if (numberPattern.test(ParkingArea)) {
      errors.ParkingArea = "Parking area must not contain numbers";
      valid = false;
    }

    if (!ParkingAddress) {
      errors.ParkingAddress = "Parking address is required!";
      valid = false;
    } else if (ParkingAddress.length < 10) {
      errors.ParkingAddress = "Parking address must be at least 10 characters long";
      valid = false;
    } else if (numberPattern.test(ParkingAddress)) {
      errors.ParkingAddress = "Parking address must not contain numbers";
      valid = false;
    }

    if (!ParkingSpaceCode) {
      errors.ParkingSpaceCode = "Parking Space Code is required!";
      valid = false;
    } else if (ParkingSpaceCode.length < 4) {
      errors.ParkingSpaceCode = "Parking Space Code must be at least 4 characters";
      valid = false;
    }

    if (Slots === 0) {
      errors.Slots = "Slots are required!";
      valid = false;
    } else if (Slots < 10) {
      errors.Slots = "Slots must be at least 10";
      valid = false;
    }

    if (!file) {
      errors.file = "Image upload is required!";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const location = useLocation();
  const data = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const existingResponse = await fetch("http://localhost:5000/api4/items");
      const existingItems = await existingResponse.json();

      const codeExists = existingItems.some(
        (item) => item.ParkingSpaceCode === ParkingSpaceCode
      );

      if (codeExists) {
        toast.error("❗ ParkingSpaceCode already exists. Choose another one.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      const formData = new FormData();
      formData.append("ParkingName", ParkingName);
      formData.append("ParkingArea", ParkingArea);
      formData.append("ParkingAddress", ParkingAddress);
      formData.append("Slots", Slots);
      formData.append("ParkingCode", data);
      formData.append("ParkingSpaceCode", ParkingSpaceCode);
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("http://localhost:5000/api/data1", {
        method: "POST",
        body: formData,
      });

      const resData = await response.text();

      if (response.ok) {
        toast.success(" Parking registered successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        console.log(resData);
      } else {
        throw new Error(resData);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("🚨 An error occurred while submitting the form.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="parking-register-container">
      <div className="parking-register-form">
        <h2>
          PARKING REGISTRATION <MdOutlineAppRegistration size={30} />
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="parking-register-input-field">
            <label>
              Parking Name<span className="asterik">*</span>
            </label>
            <input
              type="text"
              value={ParkingName}
              onChange={(e) => setParkingName(e.target.value)}
              placeholder="Enter your Parking Name"
            />
            {errors.ParkingName && <p className="error-text">{errors.ParkingName}</p>}
          </div>

          <div className="parking-register-input-field">
            <label>
              Parking Area<span className="asterik">*</span>
            </label>
            <input
              type="text"
              value={ParkingArea}
              onChange={(e) => setParkingArea(e.target.value)}
              placeholder="Enter your Parking Area"
            />
            {errors.ParkingArea && <p className="error-text">{errors.ParkingArea}</p>}
          </div>

          <div className="parking-register-input-field">
            <label>
              Slots<span className="asterik">*</span>
            </label>
            <input
              type="number"
              value={Slots}
              onChange={(e) => setSlots(e.target.value)}
              placeholder="Enter available slots (e.g., 10, 20)"
            />
            {errors.Slots && <p className="error-text">{errors.Slots}</p>}
          </div>

          <div className="parking-register-input-field">
            <label>
              Parking Space Code<span className="asterik">*</span>
            </label>
            <input
              type="text"
              value={ParkingSpaceCode}
              onChange={(e) => setParkingSpace(e.target.value)}
              placeholder="Enter your Parking Space Code"
            />
            {errors.ParkingSpaceCode && <p className="error-text">{errors.ParkingSpaceCode}</p>}
          </div>

          <div className="parking-register-input-field">
            <label>
              Parking Address<span className="asterik">*</span>
            </label>
            <textarea
              value={ParkingAddress}
              onChange={(e) => setParkingAddress(e.target.value)}
              placeholder="Enter your Parking Address"
            />
            {errors.ParkingAddress && <p className="error-text">{errors.ParkingAddress}</p>}
          </div>

          <div className="parking-register-input-field">
            <label>Upload File<span className="asterik">*</span></label>
            <input type="file" onChange={handleFileUpload} />
            {errors.file && <p className="error-text">{errors.file}</p>}
          </div>

          <button type="submit" className="parking-register-submit-btn">
            Register Parking
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddParking;
