// Horários disponíveis por especialista
export interface SpecialistSchedule {
  specialistId: string;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, etc.
  slots: string[];
}

// Horários padrão
const defaultSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// Horários por especialista por dia da semana
export const defaultSchedules: SpecialistSchedule[] = [
  // Ana Carolina - Hair Stylist (Segunda a Sábado)
  { specialistId: "ana", dayOfWeek: 1, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { specialistId: "ana", dayOfWeek: 2, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { specialistId: "ana", dayOfWeek: 3, slots: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"] },
  { specialistId: "ana", dayOfWeek: 4, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { specialistId: "ana", dayOfWeek: 5, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"] },
  { specialistId: "ana", dayOfWeek: 6, slots: ["09:00", "10:00", "11:00", "12:00"] },

  // Marina Santos - Tratamentos (Segunda a Sexta)
  { specialistId: "marina", dayOfWeek: 1, slots: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"] },
  { specialistId: "marina", dayOfWeek: 2, slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
  { specialistId: "marina", dayOfWeek: 3, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { specialistId: "marina", dayOfWeek: 4, slots: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"] },
  { specialistId: "marina", dayOfWeek: 5, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },

  // Juliana Oliveira - Nail Designer (Segunda a Sábado)
  { specialistId: "juliana", dayOfWeek: 1, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"] },
  { specialistId: "juliana", dayOfWeek: 2, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"] },
  { specialistId: "juliana", dayOfWeek: 3, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"] },
  { specialistId: "juliana", dayOfWeek: 4, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"] },
  { specialistId: "juliana", dayOfWeek: 5, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"] },
  { specialistId: "juliana", dayOfWeek: 6, slots: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"] },

  // Fernanda Lima - Esteticista (Terça a Sábado)
  { specialistId: "fernanda", dayOfWeek: 2, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { specialistId: "fernanda", dayOfWeek: 3, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { specialistId: "fernanda", dayOfWeek: 4, slots: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"] },
  { specialistId: "fernanda", dayOfWeek: 5, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { specialistId: "fernanda", dayOfWeek: 6, slots: ["09:00", "10:00", "11:00", "12:00"] },
];

const STORAGE_KEY = "beleza_studio_schedules";

export const getSchedules = (): SpecialistSchedule[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSchedules));
  return defaultSchedules;
};

export const saveSchedules = (schedules: SpecialistSchedule[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
};

export const getSpecialistScheduleForDay = (specialistId: string, dayOfWeek: number): string[] => {
  const schedules = getSchedules();
  const schedule = schedules.find(
    (s) => s.specialistId === specialistId && s.dayOfWeek === dayOfWeek
  );
  return schedule?.slots || [];
};

export const updateSpecialistSchedule = (
  specialistId: string,
  dayOfWeek: number,
  slots: string[]
) => {
  const schedules = getSchedules();
  const existingIndex = schedules.findIndex(
    (s) => s.specialistId === specialistId && s.dayOfWeek === dayOfWeek
  );

  if (existingIndex >= 0) {
    schedules[existingIndex].slots = slots;
  } else {
    schedules.push({ specialistId, dayOfWeek, slots });
  }

  saveSchedules(schedules);
};

export const allTimeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

export const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const fullDayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
