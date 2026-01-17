import { useMemo, useState } from "react";
import { StepIndicator } from "@/components/StepIndicator";
import { ServiceSelection } from "@/components/booking/ServiceSelection";
import { DateSelection } from "@/components/booking/DateSelection";
import { SpecialistSelection } from "@/components/booking/SpecialistSelection";
import { TimeSelection } from "@/components/booking/TimeSelection";
import { CustomerForm } from "@/components/booking/CustomerForm";
import { PaymentScreen } from "@/components/booking/PaymentScreen";
import { ConfirmationScreen } from "@/components/booking/ConfirmationScreen";
import { useBooking, Appointment } from "@/hooks/useBooking";
import { Calendar, ChevronRight, Clock, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, Service, categories } from "@/data/services";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const steps = [
  { id: 1, label: "Serviço" },
  { id: 2, label: "Data" },
  { id: 3, label: "Profissional" },
  { id: 4, label: "Horário" },
  { id: 5, label: "Dados" },
];

type SortOption = "popular" | "price_asc" | "price_desc" | "duration_asc" | "duration_desc";

const sortLabels: Record<SortOption, string> = {
  popular: "Populares",
  price_asc: "Menor preço",
  price_desc: "Maior preço",
  duration_asc: "Menor duração",
  duration_desc: "Maior duração",
};

const durationToMinutes = (duration: string) => {
  // Exemplos: "2h", "1h30", "45min"
  const d = duration.toLowerCase().replace(/\s+/g, "");

  if (d.includes("h")) {
    const [hPart, rest] = d.split("h");
    const hours = Number.parseInt(hPart || "0", 10) || 0;
    const minutes = rest ? Number.parseInt(rest.replace("min", "") || "0", 10) || 0 : 0;
    return hours * 60 + minutes;
  }

  if (d.includes("min")) {
    return Number.parseInt(d.replace("min", ""), 10) || 0;
  }

  return 0;
};

const Index = () => {
  const {
    currentStep,
    bookingData,
    updateBooking,
    updateCustomer,
    nextStep,
    prevStep,
    saveAppointment,
    updateAppointmentStatus,
    resetBooking,
  } = useBooking();

  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortOption, setSortOption] = useState<SortOption>("popular");

  const [filterOpen, setFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState("Todos");
  const [draftSort, setDraftSort] = useState<SortOption>("popular");

  const handleProceedToPayment = () => {
    const appointment = saveAppointment();
    setCurrentAppointment(appointment);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    if (currentAppointment) {
      updateAppointmentStatus(currentAppointment.id, "confirmed", "paid");
    }
    setShowPayment(false);
    setShowConfirmation(true);
  };

  const handlePaymentExpired = () => {
    if (currentAppointment) {
      updateAppointmentStatus(currentAppointment.id, "cancelled", "expired");
    }
  };

  const handleNewBooking = () => {
    resetBooking();
    setShowPayment(false);
    setShowConfirmation(false);
    setCurrentAppointment(null);
    setShowBooking(false);
  };

  const handleSelectService = (service: Service) => {
    updateBooking({ service, specialist: null });
    setShowBooking(true);
    nextStep();
  };

  const filteredServices = useMemo(() => {
    const byCategory =
      selectedCategory === "Todos" ? services : services.filter((s) => s.category === selectedCategory);

    const sorted = [...byCategory].sort((a, b) => {
      switch (sortOption) {
        case "popular": {
          const ap = a.popular ? 1 : 0;
          const bp = b.popular ? 1 : 0;
          if (bp !== ap) return bp - ap;
          return a.name.localeCompare(b.name);
        }
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "duration_asc":
          return durationToMinutes(a.duration) - durationToMinutes(b.duration);
        case "duration_desc":
          return durationToMinutes(b.duration) - durationToMinutes(a.duration);
        default:
          return 0;
      }
    });

    return sorted;
  }, [selectedCategory, sortOption]);

  const renderStep = () => {
    if (showConfirmation) {
      return (
        <ConfirmationScreen
          bookingData={bookingData}
          appointmentId={currentAppointment?.id || ""}
          onNewBooking={handleNewBooking}
        />
      );
    }

    if (showPayment) {
      return (
        <PaymentScreen
          bookingData={bookingData}
          appointment={currentAppointment}
          onPaymentComplete={handlePaymentComplete}
          onPaymentExpired={handlePaymentExpired}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedService={bookingData.service}
            onSelect={(service) => updateBooking({ service, specialist: null })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <DateSelection
            selectedDate={bookingData.date}
            onSelect={(date) => updateBooking({ date: date || null })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <SpecialistSelection
            selectedSpecialist={bookingData.specialist}
            selectedService={bookingData.service}
            onSelect={(specialist) => updateBooking({ specialist })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <TimeSelection
            selectedTime={bookingData.time}
            onSelect={(time) => updateBooking({ time })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <CustomerForm
            bookingData={bookingData}
            onUpdateCustomer={updateCustomer}
            onNext={handleProceedToPayment}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Tela inicial com procedimentos */}
      {!showBooking && !showPayment && !showConfirmation && (
        <div className="min-h-screen">
          {/* Header Premium */}
          <header className="sticky top-0 z-50 glass border-b border-border/30">
            <div className="container py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-display text-xl font-extrabold tracking-tight">
                      Beleza<span className="text-gradient">Studio</span>
                    </span>
                    <p className="text-xs text-muted-foreground font-medium">Salão & Estética</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero moderno */}
          <section className="container py-10 sm:py-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                Agendamento Online
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-5">
                Escolha seu <span className="text-gradient">procedimento</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
                Selecione o serviço desejado, veja o valor e agende com as melhores profissionais.
              </p>
            </div>
          </section>

          {/* Filtros + botão Filtrar */}
          <section className="container pb-8">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl px-4 h-12 font-bold"
                onClick={() => {
                  setDraftCategory(selectedCategory);
                  setDraftSort(sortOption);
                  setFilterOpen(true);
                }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtrar
              </Button>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide flex-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? "gradient-primary text-white shadow-glow"
                        : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                    }`}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogContent className="max-w-lg rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display">Filtrar serviços</DialogTitle>
                  <DialogDescription>
                    Escolha uma categoria e como deseja ordenar a lista.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Categorias</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setDraftCategory(category)}
                          className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 ${
                            draftCategory === category
                              ? "gradient-primary text-white shadow-glow"
                              : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Ordenar por</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setDraftSort(opt)}
                          className={`px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all duration-200 border ${
                            draftSort === opt
                              ? "border-primary/40 bg-primary/10 text-foreground"
                              : "border-border/50 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {sortLabels[opt]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => {
                      setDraftCategory("Todos");
                      setDraftSort("popular");
                      setSelectedCategory("Todos");
                      setSortOption("popular");
                      setFilterOpen(false);
                    }}
                  >
                    Limpar
                  </Button>
                  <Button
                    type="button"
                    className="rounded-2xl"
                    onClick={() => {
                      setSelectedCategory(draftCategory);
                      setSortOption(draftSort);
                      setFilterOpen(false);
                    }}
                  >
                    Aplicar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>

          {/* Grid de serviços premium */}
          <section className="container pb-16">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className="group relative bg-card rounded-[2rem] p-7 border border-border/40 hover:border-primary/30 hover:shadow-elevated transition-all duration-500 text-left overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                    
                    {/* Popular badge */}
                    {service.popular && (
                      <Badge className="absolute top-5 right-5 gradient-primary text-white border-0 rounded-xl px-3 py-1 text-xs font-bold shadow-soft">
                        Popular
                      </Badge>
                    )}

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-soft transition-all duration-500">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="font-display text-xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                        {service.name}
                      </h3>
                      <p className="text-[15px] text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                        {service.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-5 border-t border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground bg-secondary/60 px-4 py-2 rounded-xl">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-semibold">{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display text-2xl font-extrabold text-primary">
                            R$ {service.price}
                          </span>
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:gradient-primary group-hover:text-white group-hover:shadow-soft transition-all duration-300">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Footer Premium */}
          <section className="container pb-12">
            <div className="bg-gradient-to-br from-card to-secondary/50 rounded-[2rem] p-8 sm:p-10 text-center border border-border/30 shadow-card">
              <h3 className="font-display text-2xl font-extrabold mb-3 tracking-tight">Dúvidas?</h3>
              <p className="text-muted-foreground font-medium mb-6">
                Entre em contato pelo WhatsApp para tirar suas dúvidas
              </p>
              <Button className="rounded-2xl px-8 h-12 font-bold shadow-soft hover:shadow-elevated transition-all">
                Falar no WhatsApp
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* Fluxo de agendamento */}
      {(showBooking || showPayment || showConfirmation) && (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header do booking */}
            {!showConfirmation && !showPayment && (
              <div className="mb-8">
                <button
                  onClick={handleNewBooking}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-display font-semibold">BelezaStudio</span>
                </button>
                <StepIndicator steps={steps} currentStep={currentStep} />
              </div>
            )}
            
            {renderStep()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
