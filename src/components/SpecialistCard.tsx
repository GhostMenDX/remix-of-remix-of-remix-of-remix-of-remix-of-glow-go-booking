import { Specialist } from "@/data/specialists";
import { Star, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SpecialistCardProps {
  specialist: Specialist;
  isSelected: boolean;
  onSelect: (specialist: Specialist) => void;
}

export const SpecialistCard = ({ specialist, isSelected, onSelect }: SpecialistCardProps) => {
  return (
    <div
      onClick={() => onSelect(specialist)}
      className={`relative p-5 rounded-3xl border transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary"
          : "border-border/50 bg-card hover:border-primary/30 hover:shadow-md"
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 rounded-2xl border-2 border-primary/20">
          <AvatarImage src={specialist.avatar} alt={specialist.name} className="rounded-2xl" />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-2xl">
            {specialist.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h4 className="font-display font-semibold text-foreground">
            {specialist.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {specialist.role}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{specialist.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({specialist.reviews} avaliações)
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mt-4">
        {specialist.specialties.map((specialty, index) => (
          <span
            key={index}
            className="text-xs px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground"
          >
            {specialty}
          </span>
        ))}
      </div>
    </div>
  );
};
