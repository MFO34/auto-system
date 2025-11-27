import React from 'react';
import logo from '../../Resources/logo.png';
import './NavigationBar.css';
import { Button } from 'react-bootstrap';
import {Link, useNavigate} from "react-router-dom";
import {
    Image,
    NavContainer,
    NavLeft,
    NavRight, 
} from './NavBar.styles';

function NavigationBar() {
    const navigate = useNavigate();

    return (
        <NavContainer>
            <NavLeft>
                <h1 style={{
                    margin: 0,
                    padding: '15px 20px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#FF6B35',
                    letterSpacing: '1px'
                }}>
                    🚗 AUTO CAR WASH
                </h1>
            </NavLeft>
            <NavRight>
                <Link to="/"
                style={{ textDecoration: "none", color: "inherit" }}
                >
                    <h1 style={{ paddingLeft: 10 }}> Home </h1>
                </Link>
                <Link to="/aboutus"
                style={{ textDecoration: "none", color: "inherit" }}
                >
                    <h1 style={{ paddingLeft: 10 }}> About </h1>
                </Link>
                <Link to="/services"
                style={{ textDecoration: "none", color: "inherit" }}
                >
                    <h1 style={{ paddingLeft: 10 }}> Services </h1>
                </Link>
                <Link to="/contact"
                style={{ textDecoration: "none", color: "inherit" }}
                >
                    <h1 style={{ paddingLeft: 10 }}> Contact </h1>
                </Link>
                <Button
                    style={{
                        margin: '10px',
                        width: '200px',
                        backgroundColor: '#222322',
                        color: '#fff',
                        border: '1px solid #fff',
                        borderRadius: '5px',
                    }}
                        onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.color = '#000';
                    }}
                        onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#000';
                        e.target.style.color = '#fff';
                    }}
                    onClick={() => navigate("/service")}
                >
                    <h1 style={{  }}> BookNow </h1>
                </Button>
            </NavRight>
        </NavContainer>
    );
}

export default NavigationBar;