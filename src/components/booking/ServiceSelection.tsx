import { useMemo, useState } from "react";
import { Service, services, categories } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

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

  const filteredServices = useMemo(
    () =>
      activeCategory === "Todos"
        ? services
        : services.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-primary/20">
          <Sparkles className="w-4 h-4" />
          Etapa 1 de 5
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Escolha seu serviço
        </h2>
        <p className="text-muted-foreground">
          Selecione o tratamento que deseja realizar
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-8 -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeCategory === category
                ? "gradient-primary text-white shadow-glow"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
            }`}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredServices.map((service, index) => (
          <div
            key={service.id}
            style={{ animationDelay: `${index * 0.05}s` }}
            className="animate-fade-in-up"
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
