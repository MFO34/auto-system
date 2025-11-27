import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, TextField, FormControl, InputLabel, MenuItem, Select, Alert } from "@mui/material";

const WizardStep = ({ title, children }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ marginBottom: 12 }}>{title}</h3>
    {children}
  </div>
);

const MaintenanceWizard = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [step, setStep] = useState(1);
  const [schedule, setSchedule] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    phoneNumber: "",
    notes: "",
    licensePlate: "",
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    mileage: "",
  });

  const maintenanceServices = useMemo(
    () => services.filter((s) => s.serviceType === "MAINTENANCE"),
    [services]
  );

  const groupByCategory = useMemo(() => {
    return maintenanceServices.reduce((acc, svc) => {
      const key = (svc.category || "GENERAL").toUpperCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(svc);
      return acc;
    }, {});
  }, [maintenanceServices]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.serviceId === service.serviceId);
      if (exists) {
        return prev.filter((s) => s.serviceId !== service.serviceId);
      }
      return [...prev, service];
    });
  };

  const calculatePrice = async (servicesToPrice) => {
    try {
      const payload = servicesToPrice.map((s) => ({
        serviceId: s.serviceId,
        quantity: 1,
      }));
      const response = await axios.post(
        "http://localhost:8080/appointment/calculate-price",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setTotalPrice(response.data?.total ?? 0);
    } catch (err) {
      const fallback = servicesToPrice.reduce((sum, s) => sum + (s.servicePrice || 0), 0);
      setTotalPrice(fallback);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getallservices");
        setServices(response.data || []);
      } catch (err) {
        setError("Servis listesi alınamadı. Lütfen sayfayı yenileyin.");
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedServices.length > 0) {
      calculatePrice(selectedServices);
    } else {
      setTotalPrice(0);
    }
  }, [selectedServices]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const submitBooking = async () => {
    setError("");
    setMessage("");
    const dateTime = new Date(schedule.toISOString());
    const bookingDetails = {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      phoneNumber: form.phoneNumber,
      vehicleDetails: {
        licensePlate: form.licensePlate,
        brand: form.brand || null,
        model: form.model || null,
        year: form.year ? parseInt(form.year, 10) : null,
        fuelType: form.fuelType || null,
        mileage: form.mileage ? parseInt(form.mileage, 10) : null,
      },
      services: selectedServices.map((s) => ({ serviceId: s.serviceId, quantity: 1 })),
      appointmentDate: dateTime.toISOString().split("T")[0],
      appointmentTime: dateTime.toTimeString().slice(0, 5),
      notes: form.notes || null,
    };

    const required = [
      form.customerName,
      form.customerEmail,
      form.phoneNumber,
      form.licensePlate,
      bookingDetails.services.length,
    ];
    if (required.some((f) => !f)) {
      setError("Lütfen zorunlu alanları doldurun ve en az bir bakım servisi seçin.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/appointment/book",
        bookingDetails,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 || response.status === 201) {
        setMessage("Randevu oluşturuldu!");
      }
    } catch (err) {
      setError(err?.response?.data || "Randevu oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = (key, items) => (
    <div key={key} style={{ marginBottom: 12 }}>
      <strong>{key}</strong>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {items.map((svc) => {
          const active = selectedServices.some((s) => s.serviceId === svc.serviceId);
          return (
            <button
              key={svc.serviceId}
              onClick={() => toggleService(svc)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: active ? "2px solid #ff7f00" : "1px solid #ccc",
                background: active ? "#fff5e6" : "#f9f9f9",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600 }}>{svc.serviceName}</div>
              <div style={{ fontSize: 12 }}>{svc.category}</div>
              <div style={{ color: "#ff7f00", fontWeight: 700 }}>
                {svc.servicePrice ? `${svc.servicePrice} ₺` : "-"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "16px" }}>
      <h2>Bakım Sihirbazı</h2>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ marginBottom: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {step === 1 && (
        <WizardStep title="Araç ve İletişim Bilgileri">
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
            <TextField label="Ad Soyad" name="customerName" value={form.customerName} onChange={handleInput} />
            <TextField label="E-posta" name="customerEmail" value={form.customerEmail} onChange={handleInput} />
            <TextField label="Telefon" name="phoneNumber" value={form.phoneNumber} onChange={handleInput} />
            <TextField label="Plaka" name="licensePlate" value={form.licensePlate} onChange={handleInput} />
            <TextField label="Marka" name="brand" value={form.brand} onChange={handleInput} />
            <TextField label="Model" name="model" value={form.model} onChange={handleInput} />
            <TextField label="Yıl" type="number" name="year" value={form.year} onChange={handleInput} />
            <FormControl fullWidth>
              <InputLabel>Yakıt Tipi</InputLabel>
              <Select value={form.fuelType} name="fuelType" label="Yakıt Tipi" onChange={handleInput}>
                <MenuItem value="PETROL">Benzin</MenuItem>
                <MenuItem value="DIESEL">Dizel</MenuItem>
                <MenuItem value="ELECTRIC">Elektrik</MenuItem>
                <MenuItem value="HYBRID">Hibrit</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Kilometre" type="number" name="mileage" value={form.mileage} onChange={handleInput} />
          </div>
        </WizardStep>
      )}

      {step === 2 && (
        <WizardStep title="Yağ Seçimi">
          {renderCategory("OIL", groupByCategory["OIL"] || [])}
          {renderCategory("ENGINE", groupByCategory["ENGINE"] || [])}
          {renderCategory("OTHER", groupByCategory["OTHER"] || [])}
        </WizardStep>
      )}

      {step === 3 && (
        <WizardStep title="Filtreler ve Ekstra Hizmetler">
          {renderCategory("FILTER", groupByCategory["FILTER"] || [])}
          {renderCategory("CHECK", groupByCategory["CHECK"] || [])}
          {renderCategory("GENERAL", groupByCategory["GENERAL"] || [])}
        </WizardStep>
      )}

      {step === 4 && (
        <WizardStep title="Tarih ve Not">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Randevu Tarih/Saat"
              value={schedule}
              onChange={(newVal) => setSchedule(newVal)}
            />
          </LocalizationProvider>
          <TextField
            label="Not (opsiyonel)"
            name="notes"
            value={form.notes}
            onChange={handleInput}
            multiline
            minRows={2}
            sx={{ marginTop: 2, width: "100%" }}
          />
        </WizardStep>
      )}

      {step === 5 && (
        <WizardStep title="Özet">
          <p>Seçilen hizmet sayısı: {selectedServices.length}</p>
          <p>Toplam fiyat: {totalPrice} ₺</p>
          <ul>
            {selectedServices.map((s) => (
              <li key={s.serviceId}>
                {s.serviceName} - {s.servicePrice} ₺
              </li>
            ))}
          </ul>
        </WizardStep>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Button variant="outlined" disabled={step === 1} onClick={prevStep}>
          Geri
        </Button>
        {step < 5 ? (
          <Button variant="contained" onClick={nextStep}>
            İleri
          </Button>
        ) : (
          <Button variant="contained" disabled={loading} onClick={submitBooking}>
            {loading ? "Gönderiliyor..." : "Randevuyu Oluştur"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MaintenanceWizard;
