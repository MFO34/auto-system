import React, { useState, useEffect } from 'react';
import './AllServices.css';

export default function AllServices() {
    const [services, setServices] = useState([]);
    const [showServices, setShowServices] = useState(false);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        if (showServices) {
            fetch('http://localhost:8080/getallservices')
                .then(response => response.json())
                .then(data => setServices(data))
                .catch(error => console.error('Error fetching services:', error));
        }
    }, [showServices]);

    const filteredServices = services.filter(service => {
        if (filter === 'ALL') return true;
        return service.serviceType === filter;
    });

    return (
        <div className="all-services-container">
            <button
                className="toggle-services-button"
                onClick={() => setShowServices(prevShowServices => !prevShowServices)}
            >
                {showServices ? 'Hide all services' : 'Show all services'}
            </button>
            {showServices && (
                <div className="services-table-container">
                    <div className="service-filter-buttons" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '20px'
                    }}>
                        <button
                            onClick={() => setFilter('ALL')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: filter === 'ALL' ? '#FF6B35' : '#f0f0f0',
                                color: filter === 'ALL' ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            All Services
                        </button>
                        <button
                            onClick={() => setFilter('WASH')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: filter === 'WASH' ? '#4CAF50' : '#f0f0f0',
                                color: filter === 'WASH' ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Car Wash
                        </button>
                        <button
                            onClick={() => setFilter('MAINTENANCE')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: filter === 'MAINTENANCE' ? '#FF9800' : '#f0f0f0',
                                color: filter === 'MAINTENANCE' ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Maintenance
                        </button>
                    </div>
                    <table className="services-table fade-in">
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map(service => (
                                <tr key={service.serviceId}>
                                    <td>{service.serviceName}</td>
                                    <td>
                                        <span style={{
                                            backgroundColor: service.serviceType === 'WASH' ? '#4CAF50' :
                                                           service.serviceType === 'MAINTENANCE' ? '#FF9800' : '#2196F3',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {service.serviceType || 'SERVICE'}
                                        </span>
                                    </td>
                                    <td>{service.serviceDesc}</td>
                                    <td className="service-price">Rs. {service.servicePrice} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}