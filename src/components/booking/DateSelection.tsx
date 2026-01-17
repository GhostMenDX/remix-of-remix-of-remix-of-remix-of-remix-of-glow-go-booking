import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

interface DateSelectionProps {
  selectedDate: Date | null;
  onSelect: (date: Date | undefined) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const DateSelection = ({
  selectedDate,
  onSelect,
  onNext,
  onPrev,
}: DateSelectionProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4"
    >
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-elevated"
        >
          <CalendarDays className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Escolha a data
        </h2>
        <p className="text-muted-foreground text-lg">
          Selecione o melhor dia para você
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-card rounded-3xl p-6 shadow-elevated border border-border/30 backdrop-blur-sm">
          <Calendar
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={onSelect}
            disabled={(date) => date < today}
            locale={ptBR}
            className="pointer-events-auto"
          />
        </div>
      </motion.div>

      {selectedDate && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-lg font-medium text-foreground">
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-4"
      >
        <Button 
          variant="outline" 
          onClick={onPrev} 
          className="gap-2 h-12 px-6 rounded-xl border-2 hover:bg-secondary/80 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedDate}
          size="lg"
          className="gap-2 px-8 h-12 rounded-xl shadow-soft hover:shadow-elevated transition-all disabled:opacity-50"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
