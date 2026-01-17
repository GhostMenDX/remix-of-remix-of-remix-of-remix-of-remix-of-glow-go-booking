import { useState } from "react";
import { Header } from "@/components/Header";
import { useSpecialists } from "@/hooks/useSpecialists";
import { Specialist } from "@/data/specialists";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Professionals = () => {
  const { specialists, addSpecialist, updateSpecialist, deleteSpecialist } = useSpecialists();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
    specialties: "",
  });

  const resetForm = () => {
    setFormData({ name: "", role: "", avatar: "", specialties: "" });
    setEditingSpecialist(null);
  };

  const handleOpenDialog = (specialist?: Specialist) => {
    if (specialist) {
      setEditingSpecialist(specialist);
      setFormData({
        name: specialist.name,
        role: specialist.role,
        avatar: specialist.avatar,
        specialties: specialist.specialties.join(", "),
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.role) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e função.",
        variant: "destructive",
      });
      return;
    }

    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingSpecialist) {
      updateSpecialist(editingSpecialist.id, {
        name: formData.name,
        role: formData.role,
        avatar: formData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
        specialties: specialtiesArray,
      });
      toast({
        title: "Profissional atualizado!",
        description: `${formData.name} foi atualizado com sucesso.`,
      });
    } else {
      addSpecialist({
        name: formData.name,
        role: formData.role,
        avatar: formData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
        specialties: specialtiesArray,
      });
      toast({
        title: "Profissional adicionado!",
        description: `${formData.name} foi adicionado à equipe.`,
      });
    }

    handleCloseDialog();
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteSpecialist(deletingId);
      toast({
        title: "Profissional removido",
        description: "O profissional foi removido da equipe.",
      });
      setDeletingId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Equipe de Profissionais
            </h1>
            <p className="text-muted-foreground">
              Gerencie sua equipe de especialistas
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Adicionar Profissional
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{specialists.length}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-gold" />
              </div>
              <span className="text-sm text-muted-foreground">Média de Avaliação</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {specialists.length > 0
                ? (specialists.reduce((sum, s) => sum + s.rating, 0) / specialists.length).toFixed(1)
                : "0.0"}
            </p>
          </div>
        </div>

        {/* Professionals Grid */}
        {specialists.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhum profissional cadastrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Adicione sua equipe para começar a receber agendamentos.
            </p>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar primeiro profissional
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist, index) => (
              <div
                key={specialist.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                className="animate-fade-in opacity-0 bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarImage src={specialist.avatar} alt={specialist.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {specialist.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">
                        {specialist.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{specialist.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(specialist)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => confirmDelete(specialist.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="text-sm font-medium">{specialist.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({specialist.reviews} avaliações)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {specialist.specialties.map((specialty, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingSpecialist ? "Editar Profissional" : "Novo Profissional"}
            </DialogTitle>
            <DialogDescription>
              {editingSpecialist
                ? "Atualize as informações do profissional."
                : "Adicione um novo membro à sua equipe."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                placeholder="Ex: Maria Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <Input
                id="role"
                placeholder="Ex: Hair Stylist Senior"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">URL da foto</Label>
              <Input
                id="avatar"
                placeholder="https://exemplo.com/foto.jpg"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
              <Input
                id="specialties"
                placeholder="Ex: Corte, Coloração, Progressiva"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingSpecialist ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover profissional?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O profissional será removido
              permanentemente da sua equipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Professionals;
