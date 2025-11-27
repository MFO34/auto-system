import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPhoneVolume, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <>
      <footer className="Footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h3>AUTO CAR WASH</h3>
              <p style={{ fontSize: '14px', marginTop: '10px', color: '#ccc' }}>
                Premium car wash and maintenance services for your vehicle
              </p>
              <div className="footer-icons">
                <FontAwesomeIcon icon={faFacebook} />
                <FontAwesomeIcon icon={faInstagram} />
              </div>
            </div>
            <div className="col-md-3">
              <h5>Quick Links</h5>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/service">Book Now</a></li>
                <li><a href="/">About Us</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact Info</h5>
              <p><FontAwesomeIcon icon={faPhoneVolume} /> 076 4177433 </p>
              <p><FontAwesomeIcon icon={faEnvelope} /> fato786@yahoo.com </p>
              <p><FontAwesomeIcon icon={faPaperPlane} /> Send us a message</p>
              <p style={{ fontSize: '12px', marginTop: '10px', color: '#aaa' }}>
                Open: Mon-Sat 8:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>
        <div className='Last-footer'>
          <p>Copyright 2024 Auto Car Wash & Maintenance. All rights reserved.</p>
        </div>
      </footer >
  </>

  );
}

export default Footer;