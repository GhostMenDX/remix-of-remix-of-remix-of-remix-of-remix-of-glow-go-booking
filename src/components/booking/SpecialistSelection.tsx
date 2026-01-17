import { useSpecialists } from "@/hooks/useSpecialists";
import { Specialist } from "@/data/specialists";
import { Service } from "@/data/services";
import { SpecialistCard } from "@/components/SpecialistCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { canSpecialistDoService } from "@/data/serviceSpecialistMapping";

interface SpecialistSelectionProps {
  selectedSpecialist: Specialist | null;
  selectedService: Service | null;
  onSelect: (specialist: Specialist) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SpecialistSelection = ({
  selectedSpecialist,
  selectedService,
  onSelect,
  onNext,
  onPrev,
}: SpecialistSelectionProps) => {
  const { specialists } = useSpecialists();

  // Filtra especialistas que podem atender o serviço selecionado
  const availableSpecialists = specialists.filter((specialist) => {
    if (!selectedService) return true;
    return canSpecialistDoService(specialist.specialties, selectedService.id);
  });

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Escolha a profissional
        </h2>
        <p className="text-muted-foreground">
          {selectedService 
            ? `Especialistas disponíveis para ${selectedService.name}`
            : "Selecione uma profissional"
          }
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto mb-8">
        {availableSpecialists.map((specialist, index) => (
          <div
            key={specialist.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-fade-in-up opacity-0"
          >
            <SpecialistCard
              specialist={specialist}
              isSelected={selectedSpecialist?.id === specialist.id}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>

      {availableSpecialists.length === 0 && (
        <div className="text-center py-12 bg-card rounded-3xl border border-border/50 mb-8">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhum profissional disponível para este serviço.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Por favor, escolha outro serviço ou entre em contato conosco.
          </p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onPrev} className="gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedSpecialist}
          size="lg"
          className="gap-2 px-8 rounded-xl"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
