export interface Specialist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviews: number;
  specialties: string[];
}

export const specialists: Specialist[] = [
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
