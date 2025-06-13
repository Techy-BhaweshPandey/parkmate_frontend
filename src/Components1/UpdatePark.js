import React, { useState, useEffect } from "react";
import "./Update.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UpdatePark = () => {
    const { id } = useParams();

    const [ParkingName, setParkingName] = useState("");
    const [ParkingArea, setParkingArea] = useState("");
    const [Slots, setSlots] = useState(0);
    const [ParkingAddress, setParkingAddress] = useState("");
    const [file, setFile] = useState(null);
    const [showCheck, setShowCheck] = useState(false);

    const [errors, setErrors] = useState({
        ParkingName: "",
        ParkingArea: "",
        Slots: "",
        ParkingAddress: "",
    });

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/getUser/${id}`)
            .then(result => {
                setParkingName(result.data.ParkingName);
                setParkingArea(result.data.ParkingArea);
                setSlots(result.data.Slots);
                setParkingAddress(result.data.ParkingAddress);
                setFile(result.data.file);
            })
            .catch(err => console.log(err));
    }, [id]);

    const validateForm = () => {
        let valid = true;
        let errors = {
            ParkingName: "",
            ParkingArea: "",
            Slots: "",
            ParkingAddress: "",
        };

        if (!ParkingName || ParkingName.length < 4) {
            errors.ParkingName = "Parking name must be at least 4 characters long";
            valid = false;
        }
        if (!ParkingArea || ParkingArea.length < 4) {
            errors.ParkingArea = "Parking area must be at least 4 characters long";
            valid = false;
        }
        if (!ParkingAddress || ParkingAddress.length < 10) {
            errors.ParkingAddress = "Parking address must be at least 10 characters long";
            valid = false;
        }
        if (!Slots || Slots < 10) {
            errors.Slots = "Slots must be at least 10";
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = new FormData();
            formData.append("ParkingName", ParkingName);
            formData.append("ParkingArea", ParkingArea);
            formData.append("Slots", Slots);
            formData.append("ParkingAddress", ParkingAddress);

            if (file && typeof file === "object") {
                formData.append("file", file);
            }

            try {
                await axios.put(`http://localhost:5000/Update/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                 toast.success("Information Updated Successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          
        });
           
     setShowCheck(true);
                setTimeout(() => setShowCheck(false), 2000);
            } catch (error) {
                console.error("Error updating parking:", error);
            }
        }
    };

    return (
        <div className="login6-container">
            <div className="login88-form">
                <h2>PARKING UPDATION</h2>
                {showCheck && <div className="tick-animation">✔</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-field8">
                        <label>Parking Name<span className="asterik">*</span></label>
                        <input
                            type="text"
                            value={ParkingName}
                            onChange={(e) => setParkingName(e.target.value)}
                            placeholder="Enter your Parking Name"
                        />
                        {errors.ParkingName && <p className="error-text">{errors.ParkingName}</p>}
                    </div>

                    <div className="input-field8">
                        <label>Parking Area<span className="asterik">*</span></label>
                        <input
                            type="text"
                            value={ParkingArea}
                            onChange={(e) => setParkingArea(e.target.value)}
                            placeholder="Enter your Parking area"
                        />
                        {errors.ParkingArea && <p className="error-text">{errors.ParkingArea}</p>}
                    </div>

                    <div className="input-field8">
                        <label>Slots<span className="asterik">*</span></label>
                        <input
                            type="number"
                            value={Slots}
                            onChange={(e) => setSlots(e.target.value)}
                            placeholder="Enter your Slots available"
                        />
                        {errors.Slots && <p className="error-text">{errors.Slots}</p>}
                    </div>

                    <div className="input-field8">
                        <label>Parking Address<span className="asterik">*</span></label>
                        <textarea
                            value={ParkingAddress}
                            onChange={(e) => setParkingAddress(e.target.value)}
                            placeholder="Enter your Parking Address"
                        />
                        {errors.ParkingAddress && <p className="error-text">{errors.ParkingAddress}</p>}
                    </div>

                    <div className="input-field8">
                        <label>Upload File</label>
                        <input type="file" onChange={handleFileUpload} />
                        {file && typeof file === "object" && (
                            <img src={URL.createObjectURL(file)} alt="Preview" className="image-preview" />
                        )}
                        {file && typeof file === "string" && (
                            <img src={`http://localhost:5000/uploads/${file}`} alt="Preview" className="image-preview" />
                        )}
                    </div>

                    <button type="submit" className="submit-btn">Update Parking Information</button>
                </form>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default UpdatePark;
