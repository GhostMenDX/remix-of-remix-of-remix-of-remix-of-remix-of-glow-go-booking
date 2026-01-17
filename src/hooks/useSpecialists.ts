import { useState, useEffect } from "react";
import { Specialist } from "@/data/specialists";

const STORAGE_KEY = "beleza_studio_specialists";

const defaultSpecialists: Specialist[] = [
  {
    id: "ana",
    name: "Ana Carolina",
    role: "Hair Stylist Senior",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    reviews: 234,
    specialties: ["Coloração", "Corte", "Progressiva"],
  },
  {
    id: "marina",
    name: "Marina Santos",
    role: "Especialista em Tratamentos",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    rating: 4.8,
    reviews: 189,
    specialties: ["Hidratação", "Tratamentos Capilares"],
  },
  {
    id: "juliana",
    name: "Juliana Oliveira",
    role: "Nail Designer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    rating: 5.0,
    reviews: 312,
    specialties: ["Manicure", "Pedicure", "Nail Art"],
  },
  {
    id: "fernanda",
    name: "Fernanda Lima",
    role: "Esteticista",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    rating: 4.7,
    reviews: 156,
    specialties: ["Design de Sobrancelhas", "Estética Facial"],
  },
];

export const useSpecialists = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSpecialists();
  }, []);

  const loadSpecialists = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSpecialists(JSON.parse(stored));
    } else {
      // Initialize with default specialists
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSpecialists));
      setSpecialists(defaultSpecialists);
    }
    setIsLoading(false);
  };

  const saveSpecialists = (data: Specialist[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSpecialists(data);
  };

  const addSpecialist = (specialist: Omit<Specialist, "id" | "rating" | "reviews">) => {
    const newSpecialist: Specialist = {
      ...specialist,
      id: `specialist-${Date.now()}`,
      rating: 5.0,
      reviews: 0,
    };
    const updated = [...specialists, newSpecialist];
    saveSpecialists(updated);
    return newSpecialist;
  };

  const updateSpecialist = (id: string, data: Partial<Specialist>) => {
    const updated = specialists.map((s) =>
      s.id === id ? { ...s, ...data } : s
    );
    saveSpecialists(updated);
  };

  const deleteSpecialist = (id: string) => {
    const updated = specialists.filter((s) => s.id !== id);
    saveSpecialists(updated);
  };

  return {
    specialists,
    isLoading,
    addSpecialist,
    updateSpecialist,
    deleteSpecialist,
    refreshSpecialists: loadSpecialists,
  };
};
