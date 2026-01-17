import { Service } from "@/data/services";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export const ServiceCard = ({ service, isSelected, onSelect }: ServiceCardProps) => {
  const Icon = service.icon;

  return (
    <div
      onClick={() => onSelect(service)}
      className={`relative p-5 rounded-3xl border bg-card transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected 
          ? "ring-2 ring-primary shadow-lg border-primary" 
          : "border-border/50 hover:border-primary/30 hover:shadow-md"
      }`}
    >
      {service.popular && (
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground border-0 rounded-xl">
          Popular
        </Badge>
      )}
      
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {service.description}
          </p>
          
          {service.bonus && (
            <div className="mb-3 space-y-1">
              {service.bonus.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-primary">
                  <Gift className="w-3 h-3" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-xl">
                {service.duration}
              </span>
              <span className="text-xs text-muted-foreground">
                {service.category}
              </span>
            </div>
            <span className="font-semibold text-primary text-lg">
              R$ {service.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
