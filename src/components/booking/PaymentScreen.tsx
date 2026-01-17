import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentTimer } from "@/components/PaymentTimer";
import { BookingData, Appointment } from "@/hooks/useBooking";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Copy, CheckCircle2, XCircle, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentScreenProps {
  bookingData: BookingData;
  appointment: Appointment | null;
  onPaymentComplete: () => void;
  onPaymentExpired: () => void;
}

export const PaymentScreen = ({
  bookingData,
  appointment,
  onPaymentComplete,
  onPaymentExpired,
}: PaymentScreenProps) => {
  const [expired, setExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  const { service, date, specialist, time, customer } = bookingData;

  // PIX simulado
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${appointment?.id || 'PIX-CODE'}520400005303986540${service?.price?.toFixed(2)}5802BR5925BELEZA STUDIO6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({
      title: "Código PIX copiado!",
      description: "Cole no seu aplicativo de banco para pagar.",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExpire = () => {
    setExpired(true);
    onPaymentExpired();
  };

  if (expired) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
          Tempo expirado
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          O tempo para pagamento expirou. Por favor, realize um novo agendamento.
        </p>
        <Button onClick={() => window.location.reload()} size="lg">
          Fazer novo agendamento
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
          Pagamento via PIX
        </h2>
        <p className="text-muted-foreground">
          Escaneie o QR Code ou copie o código para pagar
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
        {/* QR Code e Timer */}
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50 flex flex-col items-center">
          <PaymentTimer initialMinutes={5} onExpire={handleExpire} />
          
          <div className="mt-6 mb-6 p-6 bg-background rounded-xl border border-border">
            <div className="w-48 h-48 bg-foreground/5 rounded-lg flex items-center justify-center">
              <QrCode className="w-32 h-32 text-foreground/80" />
            </div>
          </div>

          <div className="w-full">
            <p className="text-sm text-muted-foreground mb-2 text-center">
              Ou copie o código PIX:
            </p>
            <div className="relative">
              <div className="p-3 bg-muted rounded-lg text-xs font-mono break-all text-muted-foreground">
                {pixCode.slice(0, 50)}...
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 gap-2"
                onClick={handleCopyPix}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={onPaymentComplete}
            size="lg"
            className="w-full mt-6 gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Já fiz o pagamento
          </Button>
        </div>

        {/* Resumo */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-display text-lg font-semibold mb-6 text-foreground">
            Detalhes do agendamento
          </h3>
          
          <div className="space-y-4">
            <div className="pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Cliente</span>
              <p className="font-medium text-foreground">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>

            <div className="pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Serviço</span>
              <p className="font-medium text-foreground">{service?.name}</p>
              <p className="text-sm text-muted-foreground">{service?.duration}</p>
            </div>

            <div className="pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Data e horário</span>
              <p className="font-medium text-foreground">
                {date && format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">às {time}</p>
            </div>

            <div className="pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Profissional</span>
              <p className="font-medium text-foreground">{specialist?.name}</p>
              <p className="text-sm text-muted-foreground">{specialist?.role}</p>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total a pagar</span>
                <span className="text-3xl font-bold text-primary">
                  R$ {service?.price}
                </span>
              </div>
            </div>

            {appointment && (
              <div className="pt-4 mt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Código do agendamento: <span className="font-mono">{appointment.id}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
