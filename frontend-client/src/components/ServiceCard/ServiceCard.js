import React from 'react';
import './ServiceCard.css';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ imageSrc }) => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <div className="service-card">
                <img src={imageSrc} alt="Service" />
            </div>
            <div className="service-details">
                <div className="service-section">
                    <h1>Professional Car Wash Services</h1>
                    <button onClick={() => navigate("/service")}>Book Now</button>
                </div>
                <div className="service-section">
                    <p>Expert exterior & interior cleaning</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;

