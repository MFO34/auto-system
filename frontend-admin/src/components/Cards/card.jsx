import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Avatar, Box, IconButton, Skeleton, Typography } from "@mui/material";
import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import react-confirm-alert module
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { APPOINTMENT_ACTION_TYPES } from "../../constants/appointment.type";
import { toast } from "react-toastify";

import {
  CardContainerWrapper,
  CardContainer,
  CardDetails,
  CardDetailsExpand,
  ButtonContainer,
  Button,
} from "./card.styles";

const Card = ({
  id,
  img,
  children,
  backGround,
  loading,
  employee,
  updateStatus,
  // removeAppointment,
  // errorDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = localStorage.getItem("user");
  const { access_token } = JSON.parse(user);
  const dispatch = useDispatch();

  const statusValue =
    (employee.status || (employee.approved ? "CONFIRMED" : "PENDING"))?.toUpperCase();
  const statusColor =
    statusValue === "CONFIRMED"
      ? "green"
      : statusValue === "COMPLETED"
      ? "blue"
      : statusValue === "CANCELLED"
      ? "red"
      : "#ff9800";
  const mechanicName = employee.employee
    ? `${employee.employee.empFirstName || ""} ${employee.employee.empLastName || ""}`.trim()
    : "Atölye personeli atanmadı";
  const appointmentDateLabel = employee.appointmentDate || employee.date;
  const appointmentTimeLabel = employee.appointmentTime || employee.time;
  const vehiclePlate = employee.vehicle?.licensePlate;
  const totalPrice = employee.totalPrice ?? employee.total ?? null;
  const services =
    employee.appointmentServices ||
    (employee.services ? employee.services : []);

  const removeAppointment = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/appointment/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
      if (response?.statusText === "OK") {
        throw new Error("Something went wrong");
      } else {
        dispatch({
          type: APPOINTMENT_ACTION_TYPES.DELETE_APPOINTMENT,
          payload: response.data,
        });
        toast.error("Successfully deleted", {
          position: "top-right",
        });
      }
    } catch (error) {}
  };
  const showConfirmationAlert = (title, message, onConfirm) => {
    confirmAlert({
      title: title || "Confirmation",
      message: message || "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: onConfirm,
        },
        {
          label: "No",
          onClick: () => {}, // Do nothing if No is clicked
        },
      ],
    });
  };

  const appointmentDetails = () => {
    setIsOpen(!isOpen);
  };

  // console.log(employee.approved);
  return (
    <CardContainerWrapper backGround={backGround}>
      <CardContainer>
        <Box>
          {loading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
              style={{ marginRight: 5 }}
            />
          ) : (
            <Avatar src={img} />
          )}
        </Box>
        {loading ? (
          <Box sx={{ width: "100%" }}>
            <Skeleton width="100%">
              <Typography fontSize={12}>.</Typography>
            </Skeleton>
            <Box display="flex" alignItems="center">
              {[...Array(3)].map(() => (
                <Skeleton
                  style={{ marginRight: 5, borderRadius: 15 }}
                  variant="rounded"
                  width={70}
                />
              ))}
            </Box>

            <Skeleton width="100%">
              <Typography fontSize={12}>.</Typography>
            </Skeleton>
          </Box>
        ) : (
          <CardDetails>{children}</CardDetails>
        )}
        {!loading && (
          <IconButton sx={{ marginLeft: "auto" }} onClick={appointmentDetails}>
            <MoreVertIcon />
          </IconButton>
        )}
      </CardContainer>
      {isOpen && (
        <CardDetailsExpand opacity={isOpen}>
          <CardContainer>
            <Box>
              {loading ? (
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={40}
                  height={40}
                  style={{ marginRight: 5 }}
                />
              ) : (
                <Avatar />
              )}
            </Box>
            {loading ? (
              <Box sx={{ width: "100%" }}>
                <Skeleton width="100%">
                  <Typography fontSize={12}>.</Typography>
                </Skeleton>
                <Box display="flex" alignItems="center">
                  {[...Array(3)].map(() => (
                    <Skeleton
                      style={{ marginRight: 5, borderRadius: 15 }}
                      variant="rounded"
                      width={70}
                    />
                  ))}
                </Box>

                <Skeleton width="100%">
                  <Typography fontSize={12}>.</Typography>
                </Skeleton>
              </Box>
            ) : (
              <CardDetails>
                <p style={{ fontSize: "12px", fontWeight: "600" }}>
                  {employee.customerName || "Müşteri"}
                </p>
                <span style={{ fontSize: "11px", fontWeight: "500" }}>
                  Personel: {mechanicName}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "500" }}>
                  Araç: {vehiclePlate || "—"}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "500" }}>
                  Tarih/Saat: {appointmentDateLabel} {appointmentTimeLabel}
                </span>
                {totalPrice !== null && (
                  <span style={{ fontSize: "11px", fontWeight: "500" }}>
                    Toplam: {totalPrice}
                  </span>
                )}
                {services && services.length > 0 && (
                  <span style={{ fontSize: "11px", fontWeight: "500" }}>
                    Hizmetler:{" "}
                    {services
                      .map((s) => s.service?.serviceName || s.serviceName)
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: statusColor,
                  }}
                >
                  Durum: {statusValue}
                </span>
              </CardDetails>
            )}
          </CardContainer>
          <ButtonContainer>
            {statusValue !== "CONFIRMED" && statusValue !== "COMPLETED" ? (
              <Button
                onClick={() => updateStatus("CONFIRMED", employee.id)}
              >
                Onayla
              </Button>
            ) : (
              <Button
                onClick={() => updateStatus("CANCELLED", employee.id)}
                style={{
                  background: "orange",
                }}
              >
                İptal
              </Button>
            )}
            <Button
              onClick={() =>
                showConfirmationAlert(
                  "Delete Appointment",
                  "Are you sure you want to delete this appointment?",
                  () => removeAppointment(employee.id)
                )
              }
              style={{
                background: "red",
              }}
            >
              Remove
            </Button>
          </ButtonContainer>
        </CardDetailsExpand>
      )}
      {/* <ToastContainer /> */}
    </CardContainerWrapper>
  );
};

export default Card;
