import { Button } from "@/components/ui/button";
import { BookingData } from "@/hooks/useBooking";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Calendar, Share2, Clock, User, Scissors, MapPin, PartyPopper, Copy, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface ConfirmationScreenProps {
  bookingData: BookingData;
  appointmentId: string;
  onNewBooking: () => void;
}

export const ConfirmationScreen = ({
  bookingData,
  appointmentId,
  onNewBooking,
}: ConfirmationScreenProps) => {
  const { service, date, specialist, time, customer } = bookingData;

  useEffect(() => {
    // Dispara confetti quando a tela carrega
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d4795c', '#e6a058', '#f4d47c']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d4795c', '#e6a058', '#f4d47c']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleShare = () => {
    const text = `🎉 Meu agendamento no Beleza Studio:\n\n✂️ ${service?.name}\n📅 ${date && format(date, "dd/MM/yyyy")} às ${time}\n👤 Com ${specialist?.name}\n\n📍 Código: ${appointmentId}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Meu agendamento - Beleza Studio",
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Informações do agendamento copiadas.",
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appointmentId);
    toast({
      title: "Código copiado!",
      description: "O código do agendamento foi copiado.",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center px-4"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="relative w-28 h-28 mx-auto mb-6"
      >
        <div className="absolute inset-0 rounded-full gradient-primary animate-pulse opacity-30" />
        <div className="relative w-28 h-28 rounded-full gradient-primary flex items-center justify-center shadow-elevated">
          <CheckCircle2 className="w-14 h-14 text-primary-foreground" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg"
        >
          <PartyPopper className="w-5 h-5 text-accent-foreground" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Agendamento confirmado!
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Seu horário está reservado. Enviamos os detalhes para seu WhatsApp.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto bg-card rounded-3xl p-6 shadow-elevated border border-border/30 mb-8 overflow-hidden relative"
      >
        {/* Badge de sucesso */}
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-xl">
          ✓ Confirmado
        </div>

        <div className="flex items-center justify-center gap-3 mb-6 pt-4">
          <Calendar className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-semibold">
            {date && format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-secondary/50 p-4 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Horário</span>
            </div>
            <p className="font-semibold text-lg">{time}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-secondary/50 p-4 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-1">
              <Scissors className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Serviço</span>
            </div>
            <p className="font-semibold">{service?.name}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-secondary/50 p-4 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Profissional</span>
            </div>
            <p className="font-semibold">{specialist?.name}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-secondary/50 p-4 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Duração</span>
            </div>
            <p className="font-semibold">{service?.duration}</p>
          </motion.div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">Código do agendamento</p>
          <div className="flex items-center justify-center gap-2">
            <p className="font-mono text-xl font-bold text-primary tracking-wider">{appointmentId}</p>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} className="h-8 w-8 p-0">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">
                Olá, <strong>{customer.firstName}</strong>! 👋
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Te esperamos no dia marcado! Chegue com 10 minutos de antecedência.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row justify-center gap-4"
      >
        <Button 
          variant="outline" 
          onClick={handleShare} 
          className="gap-2 h-12 px-6 rounded-xl border-2 hover:bg-secondary/80 transition-all"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
        <Button 
          onClick={onNewBooking} 
          size="lg" 
          className="gap-2 h-12 px-8 rounded-xl shadow-soft hover:shadow-elevated transition-all"
        >
          <Calendar className="w-4 h-4" />
          Fazer novo agendamento
        </Button>
      </motion.div>
    </motion.div>
  );
};
