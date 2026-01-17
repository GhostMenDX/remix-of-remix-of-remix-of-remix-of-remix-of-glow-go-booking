import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, User, Phone, CreditCard, Scissors, Calendar, Clock, UserCircle } from "lucide-react";
import { BookingData } from "@/hooks/useBooking";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

interface CustomerFormProps {
  bookingData: BookingData;
  onUpdateCustomer: (data: Partial<BookingData["customer"]>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const CustomerForm = ({
  bookingData,
  onUpdateCustomer,
  onNext,
  onPrev,
}: CustomerFormProps) => {
  const { customer, service, date, specialist, time } = bookingData;

  const isValid = customer.firstName && customer.lastName && customer.phone;

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

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
          <UserCircle className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Seus dados
        </h2>
        <p className="text-muted-foreground text-lg">
          Preencha suas informações para finalizar
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
        {/* Resumo do agendamento */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl p-6 shadow-elevated border border-border/30 order-2 md:order-1"
        >
          <h3 className="font-display text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
            <Scissors className="w-5 h-5 text-primary" />
            Resumo do agendamento
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">Serviço</span>
                <p className="font-semibold text-foreground">{service?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">Data</span>
                <p className="font-semibold text-foreground">
                  {date && format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">Horário</span>
                <p className="font-semibold text-foreground">{time}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">Profissional</span>
                <p className="font-semibold text-foreground">{specialist?.name}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl">
                <div>
                  <span className="text-sm text-muted-foreground">Total</span>
                  <p className="text-sm text-muted-foreground">{service?.duration}</p>
                </div>
                <span className="text-3xl font-bold text-primary">
                  R$ {service?.price}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulário */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl p-6 shadow-elevated border border-border/30 order-1 md:order-2"
        >
          <h3 className="font-display text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Informações de contato
          </h3>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4 text-muted-foreground" />
                Nome
              </Label>
              <Input
                id="firstName"
                placeholder="Digite seu nome"
                value={customer.firstName}
                onChange={(e) => onUpdateCustomer({ firstName: e.target.value })}
                className="bg-background h-12 rounded-xl border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4 text-muted-foreground" />
                Sobrenome
              </Label>
              <Input
                id="lastName"
                placeholder="Digite seu sobrenome"
                value={customer.lastName}
                onChange={(e) => onUpdateCustomer({ lastName: e.target.value })}
                className="bg-background h-12 rounded-xl border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4 text-muted-foreground" />
                WhatsApp
              </Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={customer.phone}
                onChange={(e) => onUpdateCustomer({ phone: formatPhone(e.target.value) })}
                className="bg-background h-12 rounded-xl border-2 focus:border-primary transition-colors"
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground">
                Você receberá a confirmação por WhatsApp
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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
          disabled={!isValid}
          size="lg"
          className="gap-2 px-8 h-12 rounded-xl shadow-soft hover:shadow-elevated transition-all disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          Ir para pagamento
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
