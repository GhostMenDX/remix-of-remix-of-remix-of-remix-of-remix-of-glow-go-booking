import { useState } from "react";
import { Service } from "@/data/services";
import { Specialist } from "@/data/specialists";

export interface BookingData {
  service: Service | null;
  date: Date | null;
  specialist: Specialist | null;
  time: string | null;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export interface Appointment extends BookingData {
  id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  paymentStatus: "pending" | "paid" | "expired";
}

const STORAGE_KEY = "beleza_studio_appointments";

export const useBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    date: null,
    specialist: null,
    time: null,
    customer: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const updateBooking = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const updateCustomer = (data: Partial<BookingData["customer"]>) => {
    setBookingData((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...data },
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const saveAppointment = (): Appointment => {
    const appointment: Appointment = {
      ...bookingData,
      id: `APT-${Date.now()}`,
      status: "pending",
      createdAt: new Date(),
      paymentStatus: "pending",
    };

    const existing = localStorage.getItem(STORAGE_KEY);
    const appointments: Appointment[] = existing ? JSON.parse(existing) : [];
    appointments.push(appointment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

    return appointment;
  };

  const getAppointments = (): Appointment[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment["status"],
    paymentStatus?: Appointment["paymentStatus"]
  ) => {
    const appointments = getAppointments();
    const updated = appointments.map((apt) =>
      apt.id === id
        ? { ...apt, status, paymentStatus: paymentStatus ?? apt.paymentStatus }
        : apt
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setBookingData({
      service: null,
      date: null,
      specialist: null,
      time: null,
      customer: {
        firstName: "",
        lastName: "",
        phone: "",
      },
    });
  };

  return {
    currentStep,
    bookingData,
    updateBooking,
    updateCustomer,
    nextStep,
    prevStep,
    goToStep,
    saveAppointment,
    getAppointments,
    updateAppointmentStatus,
    resetBooking,
  };
};
