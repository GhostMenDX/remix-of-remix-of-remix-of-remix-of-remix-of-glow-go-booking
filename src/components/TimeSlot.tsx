import { Check } from "lucide-react";

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  isAvailable: boolean;
  onSelect: (time: string) => void;
}

export const TimeSlot = ({ time, isSelected, isAvailable, onSelect }: TimeSlotProps) => {
  return (
    <button
      onClick={() => isAvailable && onSelect(time)}
      disabled={!isAvailable}
      className={`relative px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
        !isAvailable
          ? "bg-muted text-muted-foreground/50 cursor-not-allowed line-through"
          : isSelected
          ? "gradient-primary text-primary-foreground shadow-soft"
          : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
      }`}
    >
      {time}
      {isSelected && (
        <Check className="absolute top-1 right-1 w-3 h-3" />
      )}
    </button>
  );
};
