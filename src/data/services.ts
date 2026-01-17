import { Scissors, Palette, Sparkles, Hand, Droplets, Star, Crown, Heart } from "lucide-react";

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  icon: typeof Scissors;
  category: string;
  popular?: boolean;
  bonus?: string[];
}

export const services: Service[] = [
  {
    id: "coloracao",
    name: "Coloração Profissional",
    description: "Transforme seu visual com nossa coloração premium de longa duração",
    duration: "2h",
    price: 180,
    icon: Palette,
    category: "Cabelo",
    popular: true,
  },
  {
    id: "corte",
    name: "Corte & Styling",
    description: "Corte personalizado que valoriza sua beleza natural",
    duration: "1h",
    price: 80,
    icon: Scissors,
    category: "Cabelo",
    popular: true,
  },
  {
    id: "sobrancelha",
    name: "Design de Sobrancelhas",
    description: "Desenho profissional para realçar seu olhar",
    duration: "30min",
    price: 45,
    icon: Sparkles,
    category: "Estética",
  },
  {
    id: "manutencao",
    name: "Retoque & Manutenção",
    description: "Manutenção completa para manter seu visual impecável",
    duration: "1h30",
    price: 120,
    icon: Star,
    category: "Cabelo",
  },
  {
    id: "alisamento-express",
    name: "Alisamento Express",
    description: "Fios lisos e brilhantes em uma única sessão",
    duration: "2h",
    price: 200,
    icon: Droplets,
    category: "Tratamentos",
    popular: true,
  },
  {
    id: "spa-maos-pes",
    name: "Spa Mãos & Pés",
    description: "Manicure e pedicure completa com tratamento relaxante",
    duration: "1h30",
    price: 90,
    icon: Hand,
    category: "Unhas",
  },
  {
    id: "pedicure",
    name: "Pedicure Completa",
    description: "Cuidado completo para seus pés com esmaltação",
    duration: "45min",
    price: 50,
    icon: Heart,
    category: "Unhas",
  },
  {
    id: "manicure",
    name: "Manicure Completa",
    description: "Tratamento completo para unhas impecáveis",
    duration: "45min",
    price: 40,
    icon: Sparkles,
    category: "Unhas",
  },
  {
    id: "hidratacao-profunda",
    name: "Hidratação Profunda",
    description: "Tratamento intensivo que devolve a vida aos seus fios",
    duration: "1h30",
    price: 150,
    icon: Droplets,
    category: "Tratamentos",
  },
  {
    id: "transformacao-total",
    name: "Pacote Transformação Total",
    description: "Progressiva premium com tratamento completo",
    duration: "4h",
    price: 450,
    icon: Crown,
    category: "Tratamentos",
    popular: true,
    bonus: [
      "Pré-química inclusa",
      "Kit Cronograma Capilar para casa",
      "Acompanhamento personalizado"
    ],
  },
];

export const categories = ["Todos", "Cabelo", "Tratamentos", "Unhas", "Estética"];
