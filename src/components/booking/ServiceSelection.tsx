import { useState } from "react";
import { Service, services, categories } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceSelectionProps {
  selectedService: Service | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
}

export const ServiceSelection = ({
  selectedService,
  onSelect,
  onNext,
}: ServiceSelectionProps) => {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredServices =
    activeCategory === "Todos"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Escolha seu serviço
        </h2>
        <p className="text-muted-foreground">
          Selecione o tratamento que deseja realizar
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredServices.map((service, index) => (
          <div
            key={service.id}
            style={{ animationDelay: `${index * 0.05}s` }}
            className="animate-fade-in-up opacity-0"
          >
            <ServiceCard
              service={service}
              isSelected={selectedService?.id === service.id}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          disabled={!selectedService}
          size="lg"
          className="gap-2 px-8 rounded-2xl"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
