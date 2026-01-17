import { useState, useEffect } from "react";
import { useBooking, Appointment } from "@/hooks/useBooking";
import { useSpecialists } from "@/hooks/useSpecialists";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Users,
  ArrowLeft,
  TrendingUp,
  Star,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  getSchedules, 
  updateSpecialistSchedule, 
  allTimeSlots, 
  dayNames,
  SpecialistSchedule 
} from "@/data/schedules";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { getAppointments, updateAppointmentStatus } = useBooking();
  const { specialists } = useSpecialists();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specialistFilter, setSpecialistFilter] = useState<string>("all");
  const [schedules, setSchedules] = useState<SpecialistSchedule[]>([]);
  const [selectedSpecialistForSchedule, setSelectedSpecialistForSchedule] = useState<string>("");

  useEffect(() => {
    const loadData = () => {
      const data = getAppointments();
      const parsed = data.map((apt: Appointment) => ({
        ...apt,
        date: apt.date ? new Date(apt.date) : null,
        createdAt: apt.createdAt ? new Date(apt.createdAt) : new Date(),
      }));
      setAppointments(parsed.reverse());
      setSchedules(getSchedules());
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (specialists.length > 0 && !selectedSpecialistForSchedule) {
      setSelectedSpecialistForSchedule(specialists[0].id);
    }
  }, [specialists]);

  const filteredAppointments = appointments.filter((apt) => {
    const statusMatch = statusFilter === "all" || apt.status === statusFilter;
    const specialistMatch = specialistFilter === "all" || apt.specialist?.id === specialistFilter;
    return statusMatch && specialistMatch;
  });

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    revenue: appointments
      .filter((a) => a.paymentStatus === "paid")
      .reduce((sum, a) => sum + (a.service?.price || 0), 0),
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full px-3 py-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Confirmado
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full px-3 py-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
            Pendente
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 rounded-full px-3 py-1 font-medium">
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDateLabel = (date: Date | null) => {
    if (!date) return "Data não definida";
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    return format(date, "dd/MM/yyyy");
  };

  const handleConfirm = (id: string) => {
    updateAppointmentStatus(id, "confirmed", "paid");
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: "confirmed", paymentStatus: "paid" } : apt
      )
    );
  };

  const handleCancel = (id: string) => {
    updateAppointmentStatus(id, "cancelled");
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "cancelled" } : apt))
    );
  };

  const getSpecialistSlots = (specialistId: string, dayOfWeek: number) => {
    const schedule = schedules.find(
      (s) => s.specialistId === specialistId && s.dayOfWeek === dayOfWeek
    );
    return schedule?.slots || [];
  };

  const toggleSlot = (specialistId: string, dayOfWeek: number, slot: string) => {
    const currentSlots = getSpecialistSlots(specialistId, dayOfWeek);
    const newSlots = currentSlots.includes(slot)
      ? currentSlots.filter((s) => s !== slot)
      : [...currentSlots, slot].sort();
    
    updateSpecialistSchedule(specialistId, dayOfWeek, newSlots);
    setSchedules(getSchedules());
  };

  const selectedSpecialist = specialists.find(s => s.id === selectedSpecialistForSchedule);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Premium */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Link 
                to="/" 
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Gerencie seu salão de beleza</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sistema online
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats Cards Premium */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="group bg-card hover:bg-card/80 rounded-3xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-4xl font-bold text-foreground tracking-tight">{stats.total}</p>
            <p className="text-sm text-muted-foreground mt-1">Total agendamentos</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="group bg-card hover:bg-card/80 rounded-3xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
              </span>
            </div>
            <p className="text-4xl font-bold text-foreground tracking-tight">{stats.confirmed}</p>
            <p className="text-sm text-muted-foreground mt-1">Confirmados</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="group bg-card hover:bg-card/80 rounded-3xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-4xl font-bold text-foreground tracking-tight">{stats.pending}</p>
            <p className="text-sm text-muted-foreground mt-1">Pendentes</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="group bg-gradient-to-br from-primary/10 via-card to-card hover:from-primary/15 rounded-3xl p-6 shadow-sm border border-primary/20 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-4xl font-bold text-foreground tracking-tight">
              R$ {stats.revenue.toLocaleString("pt-BR")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Receita total</p>
          </motion.div>
        </motion.div>

        {/* Tabs Premium */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm p-1.5 rounded-2xl border border-border/50 shadow-sm">
            <TabsTrigger 
              value="appointments" 
              className="rounded-xl gap-2.5 px-5 py-2.5 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger 
              value="schedules" 
              className="rounded-xl gap-2.5 px-5 py-2.5 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
            >
              <Clock className="w-4 h-4" />
              Horários
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="rounded-xl gap-2.5 px-5 py-2.5 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
            >
              <Users className="w-4 h-4" />
              Equipe
            </TabsTrigger>
          </TabsList>

          {/* Agendamentos Tab */}
          <TabsContent value="appointments" className="space-y-6">
            {/* Filters Premium */}
            <motion.div 
              className="flex flex-wrap items-center gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={specialistFilter} onValueChange={setSpecialistFilter}>
                <SelectTrigger className="w-56 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm">
                  <SelectValue placeholder="Profissional" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Todas profissionais</SelectItem>
                  {specialists.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto text-sm text-muted-foreground">
                {filteredAppointments.length} resultado(s)
              </div>
            </motion.div>

            {/* Appointments List Premium */}
            <AnimatePresence mode="wait">
              {filteredAppointments.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-20 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50"
                >
                  <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Nenhum agendamento encontrado
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Ajuste os filtros ou aguarde novos agendamentos chegarem.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      variants={itemVariants}
                      className="group bg-card hover:bg-card/80 rounded-3xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:border-border transition-all duration-500"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <User className="w-3.5 h-3.5" />
                              Cliente
                            </div>
                            <p className="font-semibold text-foreground">
                              {appointment.customer.firstName} {appointment.customer.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" />
                              {appointment.customer.phone}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5" />
                              Serviço
                            </div>
                            <p className="font-semibold text-foreground">{appointment.service?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.specialist?.name}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <Calendar className="w-3.5 h-3.5" />
                              Data e Hora
                            </div>
                            <p className="font-semibold text-foreground">{getDateLabel(appointment.date)}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {appointment.time}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <DollarSign className="w-3.5 h-3.5" />
                              Valor
                            </div>
                            <p className="font-semibold text-primary text-lg">
                              R$ {appointment.service?.price}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.paymentStatus === "paid" ? (
                                <span className="text-emerald-600">✓ Pago</span>
                              ) : (
                                <span className="text-amber-600">Aguardando</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {getStatusBadge(appointment.status)}
                          
                          {appointment.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-xl border-border/50 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 transition-all duration-300"
                                onClick={() => handleCancel(appointment.id)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                                onClick={() => handleConfirm(appointment.id)}
                              >
                                Confirmar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Horários Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <motion.div 
              className="bg-card rounded-3xl p-6 lg:p-8 border border-border/50 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="font-display text-xl font-semibold">Horários Disponíveis</h3>
                  <p className="text-sm text-muted-foreground mt-1">Configure os horários de cada profissional</p>
                </div>
                <Select value={selectedSpecialistForSchedule} onValueChange={setSelectedSpecialistForSchedule}>
                  <SelectTrigger className="w-56 rounded-xl border-border/50 bg-background/50">
                    <SelectValue placeholder="Selecionar profissional" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {specialists.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSpecialist && (
                <div className="space-y-6">
                  <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-muted/50 to-muted/20 rounded-2xl border border-border/30">
                    <img
                      src={selectedSpecialist.avatar}
                      alt={selectedSpecialist.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                    />
                    <div>
                      <h4 className="font-display font-semibold text-lg">{selectedSpecialist.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedSpecialist.role}</p>
                      <div className="flex gap-1.5 mt-2">
                        {selectedSpecialist.specialties.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs rounded-full px-2.5">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-border/50">
                    <table className="w-full">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="text-left text-sm font-semibold text-foreground p-4">Horário</th>
                          {[1, 2, 3, 4, 5, 6].map((day) => (
                            <th key={day} className="text-center text-sm font-semibold text-foreground p-4 min-w-[70px]">
                              {dayNames[day]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allTimeSlots.map((slot, idx) => (
                          <tr key={slot} className={idx % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                            <td className="p-4 text-sm font-medium text-foreground">{slot}</td>
                            {[1, 2, 3, 4, 5, 6].map((day) => {
                              const isActive = getSpecialistSlots(selectedSpecialistForSchedule, day).includes(slot);
                              return (
                                <td key={day} className="text-center p-4">
                                  <Checkbox
                                    checked={isActive}
                                    onCheckedChange={() => toggleSlot(selectedSpecialistForSchedule, day, slot)}
                                    className="w-5 h-5 rounded-lg data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Equipe Tab */}
          <TabsContent value="team" className="space-y-6">
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {specialists.map((specialist) => {
                const specialistAppointments = appointments.filter(a => a.specialist?.id === specialist.id);
                const thisMonthRevenue = specialistAppointments
                  .filter(a => a.paymentStatus === "paid")
                  .reduce((sum, a) => sum + (a.service?.price || 0), 0);

                return (
                  <motion.div 
                    key={specialist.id} 
                    variants={itemVariants}
                    className="group bg-card hover:bg-card/80 rounded-3xl p-6 border border-border/50 hover:shadow-xl hover:border-border transition-all duration-500"
                  >
                    <div className="flex items-start gap-5">
                      <div className="relative">
                        <img
                          src={specialist.avatar}
                          alt={specialist.name}
                          className="w-20 h-20 rounded-2xl object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">{specialist.rating}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-semibold text-xl truncate">{specialist.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{specialist.role}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {specialist.specialties.map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs rounded-full px-2.5 py-0.5">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
                      <div className="text-center p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-xl font-bold text-foreground">{specialist.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Avaliação</p>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-xl font-bold text-foreground mb-1">{specialistAppointments.length}</p>
                        <p className="text-xs text-muted-foreground">Agendamentos</p>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-xl font-bold text-emerald-600 mb-1">R$ {thisMonthRevenue}</p>
                        <p className="text-xs text-muted-foreground">Receita</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
