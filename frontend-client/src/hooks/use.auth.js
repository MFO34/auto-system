import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuthHandler = (formInput, selectedStylist, paymentMethod, serviceList, totalAmount) => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [listOfService, setListOfService] = useState([]);
    const navigate = useNavigate();

    const { name, email, phone, date, licensePlate, brand, model, year, fuelType, mileage, color, notes } = formInput;

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const booking = async (event) => {
        event.preventDefault();

        let emptyFields = [];
        let appointmentServices = [];

        if (!name) {
            emptyFields.push("Name");
        } else if (name.length < 5) {
            emptyFields.push("Name should be at least 5 letters");
        }

        if (!email) {
            emptyFields.push("Email");
        } else if (!validateEmail(email)) {
            emptyFields.push("Invalid email format");
        }

        if (!phone) {
            emptyFields.push("Phone");
        } else if (phone.length !== 10) {
            emptyFields.push("Phone number should be 10 digits");
        }

        if (!licensePlate) {
            emptyFields.push("License Plate");
        }

        if (!paymentMethod) emptyFields.push("Payment Method");
        if (!selectedStylist) emptyFields.push("Mechanic/Technician");
        if (!date) emptyFields.push("Date/Time");
        if (serviceList.length === 0) emptyFields.push("Please select at least one service");

        // Build appointment services array
        if (serviceList.length > 0) {
            serviceList.forEach((service) => {
                appointmentServices.push({
                    serviceId: service.serviceId,
                    quantity: 1
                });
            });
        }

        if (emptyFields.length > 0) {
            setError(`${emptyFields.join(", ")} can't be empty`);
            return;
        } else {
            setError("");
        }

        const dateTime = new Date(date);

        // Format: "2025-11-25"
        const formattedDate = dateTime.toISOString().split('T')[0];

        // Format: "14:30"
        const formattedTime = dateTime.toTimeString().slice(0, 5);

        const bookingDetails = {
            customerName: name,
            customerEmail: email,
            phoneNumber: phone,
            vehicleDetails: {
                licensePlate: licensePlate,
                brand: brand || null,
                model: model || null,
                year: year ? parseInt(year, 10) : null,
                fuelType: fuelType || null,
                mileage: mileage ? parseInt(mileage, 10) : null,
                color: color || null
            },
            services: appointmentServices,
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            preferredEmployeeId: selectedStylist || null,
            paymentMethod: paymentMethod,
            notes: notes || null
        };

        console.log("Booking details:", bookingDetails);

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8080/appointment/book",
                bookingDetails,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 201 || response.status === 200) {
                setError("");
                console.log("Booking successful", response.data);
                setSuccess("Appointment booked successfully!");
                navigate("/success");
            } else {
                setError("Failed to book appointment");
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Booking error:", error);
            setError(error?.response?.data?.message || error?.response?.data || "Failed to book appointment");
        }
    };

    return {
        booking,
        loading,
        error,
        setError,
        setSuccess,
        success
    };
};

export default useAuthHandler;
