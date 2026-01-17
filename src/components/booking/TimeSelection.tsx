import { TimeSlot } from "@/components/TimeSlot";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, Sun, Sunset, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface TimeSelectionProps {
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const morningSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const afternoonSlots = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
const eveningSlots = ["18:00", "18:30", "19:00", "19:30"];

// Simulando alguns horários indisponíveis
const unavailableSlots = ["10:00", "14:30", "17:00"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface TimeGroupProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  slots: string[];
  selectedTime: string | null;
  unavailableSlots: string[];
  onSelect: (time: string) => void;
}

const TimeGroup = ({ title, icon, iconBg, slots, selectedTime, unavailableSlots, onSelect }: TimeGroupProps) => (
  <motion.div 
    variants={itemVariants}
    className="bg-card rounded-3xl p-6 shadow-card border border-border/30 hover:shadow-elevated transition-all duration-300"
  >
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
    </div>
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {slots.map((time) => (
        <TimeSlot
          key={time}
          time={time}
          isSelected={selectedTime === time}
          isAvailable={!unavailableSlots.includes(time)}
          onSelect={onSelect}
        />
      ))}
    </div>
  </motion.div>
);

export const TimeSelection = ({
  selectedTime,
  onSelect,
  onNext,
  onPrev,
}: TimeSelectionProps) => {
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
          <Clock className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Escolha o horário
        </h2>
        <p className="text-muted-foreground text-lg">
          Selecione o melhor horário para seu atendimento
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-4 mb-8"
      >
        <TimeGroup
          title="Manhã"
          icon={<Sun className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-100"
          slots={morningSlots}
          selectedTime={selectedTime}
          unavailableSlots={unavailableSlots}
          onSelect={onSelect}
        />

        <TimeGroup
          title="Tarde"
          icon={<Sunset className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-100"
          slots={afternoonSlots}
          selectedTime={selectedTime}
          unavailableSlots={unavailableSlots}
          onSelect={onSelect}
        />

        <TimeGroup
          title="Noite"
          icon={<Moon className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-100"
          slots={eveningSlots}
          selectedTime={selectedTime}
          unavailableSlots={unavailableSlots}
          onSelect={onSelect}
        />
      </motion.div>

      {selectedTime && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
            <Clock className="w-5 h-5 text-primary" />
            <p className="text-lg font-medium text-foreground">
              Horário selecionado: <span className="text-primary font-semibold">{selectedTime}</span>
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
          disabled={!selectedTime}
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
