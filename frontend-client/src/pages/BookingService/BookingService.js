import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

import {Alert, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import Card from "../../components/BarberShop/BarbershopCard";
import {
    BarberShopAddress as ServiceDescription,
    BarberShopName as ServiceName,
    CardFlex,
    Ratings,
    Tag,
    Tags,
} from "../../components/BarberShop/barbershop.card.styles";
import NavigationBar from "../../components/NavBar/NavigationBar";
import {currentCart} from "../../selector/cart.selector";
import {colors} from "../../styles/colors";
import {AboutHeading, BarberContainer, FloatingButton, FloatingButtonAdd,} from "../BarberShop/barber.styles";
import axios from "axios";

import useAuthHandler from "../../hooks/use.auth";
import useInputHandler from "../../hooks/InputHandler";
import {Form, FormContainer,} from "../auth.styles";
import AddIcon from "@mui/icons-material/Add";
import {renderTimeViewClock} from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

export const InitialState = {
    name: "",
    email: "",
    phone: "",
    stylist: "",
    date: "",
    notes: "",
    // Vehicle information
    licensePlate: "",
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    mileage: "",
    color: ""
};

const BookService = () => {
    const [value, setValue] = React.useState(dayjs(new Date()));
    const dispatch = useDispatch();
    const [stylists, setStylists] = useState([]);
    const cartItems = useSelector(currentCart);
    const navigate = useNavigate();
    const [selectedStylist, setSelectedStylist] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [serviceList, setServiceList] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const { handleInput, formInput, setFormInput } = useInputHandler(InitialState);

    const { success, setSuccess, booking, error, setError } = useAuthHandler(formInput, selectedStylist, paymentMethod, serviceList, totalAmount);

    // Define dummy cart items
    const [CartItems, setCartItems] = useState([]);

    useEffect(() => {
        // store ISO to avoid parsing issues on backend
        formInput.date = value.toISOString();

        // Fetch mechanics/technicians (employees)
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:8080/employees");
                console.log("Employees:", response.data);
                setStylists(response.data);
            } catch (e) {
                console.error("Error fetching employees:", e);
                setError("Failed to load mechanics. Please refresh the page.");
            }
        };
        fetchEmployees();

        // Fetch services
        const fetchServices = async () => {
            try {
                const response = await axios.get("http://localhost:8080/getallservices");
                console.log("Services:", response.data);
                setCartItems(response.data);
            } catch (e) {
                console.error("Error fetching services:", e);
                setError("Failed to load services. Please refresh the page.");
            }
        };
        fetchServices();
    }, []);

    const handleDateChange = (date) => {
        formInput.date = date.toISOString();
        console.log(formInput.date);
    };

    // Calculate price using backend API
    const calculatePrice = async (services) => {
        try {
            const appointmentServices = services.map(service => ({
                serviceId: service.serviceId,
                quantity: 1
            }));

            const response = await axios.post(
                "http://localhost:8080/appointment/calculate-price",
                appointmentServices,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 200) {
                setTotalAmount(response.data?.total ?? 0);
                console.log("Price calculation:", response.data);
            }
        } catch (e) {
            console.error("Error calculating price:", e);
            // Fallback to manual calculation
            const manualTotal = services.reduce((sum, service) => sum + service.servicePrice, 0);
            setTotalAmount(manualTotal);
        }
    };

    const addService = (cartItem) => {
        // Check if the service is already added
        if (!serviceList.some(item => item.serviceId === cartItem.serviceId)) {
            const newServiceList = [...serviceList, cartItem];
            setServiceList(newServiceList);
            calculatePrice(newServiceList);
        }
    }

    const rmService = (cartItem) => {
        // Check if the service exists in the list before removing
        if (serviceList.some(item => item.serviceId === cartItem.serviceId)) {
            const newServiceList = serviceList.filter(item => item.serviceId !== cartItem.serviceId);
            setServiceList(newServiceList);
            if (newServiceList.length > 0) {
                calculatePrice(newServiceList);
            } else {
                setTotalAmount(0);
            }
        }
    }

    return (
        <>
            <NavigationBar />
            <BookServiceWrapper>
                <AboutHeading>Select Your Services</AboutHeading>
                <ServiceTypeNote>Choose from our car wash and maintenance services</ServiceTypeNote>
                <BookServiceContainer>
                    {CartItems?.map(
                        (cartItem) => {
                            const isSelected = serviceList.some(item => item.serviceId === cartItem.serviceId);
                            return (
                            <Card
                                key={cartItem.serviceId}
                                style={{
                                    border: isSelected ? '3px solid #FF6B35' : '1px solid #ddd',
                                    backgroundColor: isSelected ? '#FFF5F0' : 'white',
                                    boxShadow: isSelected ? '0 4px 12px rgba(255, 107, 53, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <ServiceName>{cartItem.serviceName?.toUpperCase().trim()}</ServiceName>
                                <ServiceDescription>
                                    {cartItem.serviceDesc?.length > 80
                                        ? `${cartItem.serviceDesc.slice(0, 80)}...`
                                        : cartItem.serviceDesc}
                                </ServiceDescription>
                                <CardFlex>
                                    <Tags>
                                        <Tag style={{
                                            backgroundColor: cartItem.serviceType === 'WASH' ? '#4CAF50' :
                                                           cartItem.serviceType === 'MAINTENANCE' ? '#FF9800' : '#2196F3',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {cartItem.serviceType || 'SERVICE'}
                                        </Tag>
                                        {isSelected && (
                                            <Tag style={{
                                                backgroundColor: '#FF6B35',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                marginLeft: '5px'
                                            }}>
                                                ✓ SELECTED
                                            </Tag>
                                        )}
                                    </Tags>
                                    <Ratings style={{ marginLeft: 'auto' }}>
                                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.colorOrange }}>
                                            ₺{cartItem.servicePrice}
                                        </span>
                                    </Ratings>
                                </CardFlex>
                                <CardFlex style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <FloatingButton
                                        onClick={() => rmService(cartItem)}
                                        disabled={!serviceList.some(item => item.serviceId === cartItem.serviceId)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        <RemoveIcon
                                            fontSize="16px"
                                            sx={{color: colors.colorWhite}}
                                        />
                                    </FloatingButton>
                                    <FloatingButtonAdd
                                        onClick={() => addService(cartItem)}
                                        disabled={serviceList.some(item => item.serviceId === cartItem.serviceId)}
                                    >
                                        <AddIcon
                                            fontSize="16px"
                                            sx={{color: colors.colorWhite}}
                                        />
                                    </FloatingButtonAdd>
                                </CardFlex>
                            </Card>
                        );
                        }
                    )}
                </BookServiceContainer>
                <FormContainer>
                    {error && (
                        <Alert
                            onClose={() => setError("")}
                            sx={{ margin: "10px", width: "100%" }}
                            severity="error"
                        >
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert
                            onClose={() => setSuccess("")}
                            sx={{ margin: "10px", width: "100%" }}
                            severity="success"
                        >
                            {success}
                        </Alert>
                    )}
                    <Form onSubmit={booking}>
                        <TextField
                            fullWidth
                            type="text"
                            size="small"
                            label="Name"
                            name="name"
                            onChange={handleInput}
                            value={formInput.name}
                            className="form-element"
                        />
                        <TextField
                            fullWidth
                            type="text"
                            size="small"
                            label="Email"
                            name="email"
                            onChange={handleInput}
                            value={formInput.email}
                            className="form-element"
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Phone"
                            type="text"
                            name="phone"
                            onChange={handleInput}
                            value={formInput.phone}
                            className="form-element"
                        />

                        <AboutHeading style={{ fontSize: '1.2em', marginTop: '20px', marginBottom: '10px' }}>Vehicle Information</AboutHeading>

                        <TextField
                            fullWidth
                            size="small"
                            label="License Plate"
                            type="text"
                            name="licensePlate"
                            onChange={handleInput}
                            value={formInput.licensePlate}
                            className="form-element"
                            required
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Brand (e.g., Toyota, Honda)"
                            type="text"
                            name="brand"
                            onChange={handleInput}
                            value={formInput.brand}
                            className="form-element"
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Model (e.g., Camry, Civic)"
                            type="text"
                            name="model"
                            onChange={handleInput}
                            value={formInput.model}
                            className="form-element"
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Year"
                            type="number"
                            name="year"
                            onChange={handleInput}
                            value={formInput.year}
                            className="form-element"
                        />
                        <FormControl fullWidth style={{ margin: '5px 0' }} className="form-element">
                            <InputLabel>Fuel Type</InputLabel>
                            <Select
                                value={formInput.fuelType}
                                name="fuelType"
                                onChange={handleInput}
                            >
                                <MenuItem value="PETROL">Petrol</MenuItem>
                                <MenuItem value="DIESEL">Diesel</MenuItem>
                                <MenuItem value="ELECTRIC">Electric</MenuItem>
                                <MenuItem value="HYBRID">Hybrid</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            size="small"
                            label="Mileage (km)"
                            type="number"
                            name="mileage"
                            onChange={handleInput}
                            value={formInput.mileage}
                            className="form-element"
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Color"
                            type="text"
                            name="color"
                            onChange={handleInput}
                            value={formInput.color}
                            className="form-element"
                        />

                        <AboutHeading style={{ fontSize: '1.2em', marginTop: '20px', marginBottom: '10px' }}>Appointment Details</AboutHeading>

                        <FormControl fullWidth style={{ margin: '5px 0' }} className="form-element">
                            <InputLabel>Select Mechanic/Technician</InputLabel>
                            <Select
                                value={selectedStylist}
                                onChange={(e) => setSelectedStylist(e.target.value)}
                            >
                                {stylists.map((stylist) => (
                                    <MenuItem key={stylist.empId} value={stylist.empId}>
                                        {`${stylist.empFirstName} ${stylist.empLastName}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth style={{ margin: '0px 0' }} className="form-element">
                            <InputLabel>Select Payment Method</InputLabel>
                            <Select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <MenuItem value="Online Transfer">Online Transfer</MenuItem>
                                <MenuItem value="Cash">Cash</MenuItem>
                            </Select>
                        </FormControl>
                        <div className="datepicker-container">

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label={"Pick Date and Time"}
                                value={value}
                                onChange={(newValue) => {
                                    console.log(newValue);
                                    setValue(newValue);
                                    handleDateChange(newValue);
                                }}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                            />
                            </LocalizationProvider>
                        </div>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            size="small"
                            label="Notes (optional)"
                            type="text"
                            name="notes"
                            onChange={handleInput}
                            value={formInput.notes}
                            className="form-element"
                            placeholder="Örn: İç detaylı temizlik, ekstra leke çıkarma vb."
                        />
                        {serviceList.length > 0 && (
                            <SelectedServicesContainer>
                                <AboutHeading style={{ fontSize: '1em', marginBottom: '10px' }}>Selected Services:</AboutHeading>
                                {serviceList.map((item) => (
                                    <ServiceLineItem key={item.serviceId}>
                                        <span>{item.serviceName}</span>
                                        <span>₺{item.servicePrice}</span>
                                    </ServiceLineItem>
                                ))}
                                <TotalAmountDiv>Total: ₺{totalAmount}</TotalAmountDiv>
                            </SelectedServicesContainer>
                        )}
                        <Button
                            type="submit"
                            style={{
                                display: "block",
                                margin: "0 20px",
                                border: `2px solid ${colors.colorOrange}`,
                                color: colors.colorOrange,
                            }}
                            variant="outlined"
                        >
                            Book an Appointment
                        </Button>
                    </Form>
                </FormContainer>
            </BookServiceWrapper>
        </>
    );
};

export default BookService;

export const BookServiceWrapper = styled.div`
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ServiceTypeNote = styled.p`
    text-align: center;
    color: #666;
    margin-bottom: 20px;
    font-size: 1.1em;
`;

export const BookServiceContainer = styled(BarberContainer)`
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    margin: 20px 0;
    gap: 20px;
`;

export const BookServiceHeading = styled(AboutHeading)``;

export const SelectedServicesContainer = styled.div`
    background: #f9f9f9;
    border: 2px solid ${colors.colorOrange};
    border-radius: 8px;
    padding: 15px;
    margin: 20px 0;
`;

export const ServiceLineItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }

    span:first-child {
        color: #333;
        font-weight: 500;
    }

    span:last-child {
        color: ${colors.colorOrange};
        font-weight: bold;
    }
`;

export const TotalAmountDiv = styled.div`
    margin: 15px 0 0 0;
    padding-top: 15px;
    border-top: 2px solid ${colors.colorOrange};
    font-size: 1.5em;
    font-weight: bold;
    text-align: right;
    color: ${colors.colorOrange};
`;
