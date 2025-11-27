import React, { useState } from 'react';
import './ServicesPage.css'; // Import the CSS file
import NavigationBar from '../components/NavBar/NavigationBar';
import Footer from '../components/Footer/Footer';
import ServiceCard from '../components/ServiceCard/ServiceCard';
import ServiceCard2 from '../components/ServiceCard2/ServiceCard2';
import imageSrc from '../Resources/photo5.jpg';
import img from '../Resources/photo6.jpg';
import AllServices from '../components/Service/AllServices';
import ServiceSlider from '../components/Service/ServiceSlider';
// Import the icons for light and dark mode
import { FaSun, FaMoon } from 'react-icons/fa'; 

export default function ServicesPage() {
    const [darkMode, setDarkMode] = useState(false);
    const para = "Experience premium car care at its finest. From comprehensive exterior washes to detailed interior cleaning and professional maintenance services, we offer everything your vehicle needs. Our state-of-the-art facility and skilled technicians ensure your car receives the best treatment. Whether it's a quick wash or complete maintenance, we've got you covered.";

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={darkMode ? 'dark-mode' : 'light-mode'}>
            <NavigationBar />
            <button className='toggle-button' onClick={toggleDarkMode}>
                {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className='title'>
                <h1>Our Services</h1>
                <p>{para}</p>
            </div>
            <div className='service-card'>
                <ServiceCard imageSrc={imageSrc} />
            </div>
            <ServiceSlider />
            <div className='service-card2'>
                <ServiceCard2 imageSrc={img} />
            </div>
            <AllServices />
            <Footer />
        </div>
    );
}
