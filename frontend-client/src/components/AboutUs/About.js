import React from 'react'
import './about.css';
import image from '../../Resources/photo4.jpg';

function AboutUs() {
    return (
        <div className='container'>
            <div className='box'>
                <img className='about-img' src={image} alt='About Us' />
            </div>
            <div className='about-para'>
                <h3 className='about-h'>About Us</h3>
                <p> Welcome to Auto Car Wash & Maintenance where Quality Meets Care! With our skilled technicians and modern facility,
                    we are dedicated to delivering exceptional car wash services, maintenance, and detailing experience tailored to every vehicle.
                    Visit us and experience professional automotive care with state-of-the-art equipment.</p>
            </div>
        </div>
    );
}

export default AboutUs;