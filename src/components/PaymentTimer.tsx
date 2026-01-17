import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

interface PaymentTimerProps {
  initialMinutes: number;
  onExpire: () => void;
}

export const PaymentTimer = ({ initialMinutes, onExpire }: PaymentTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / (initialMinutes * 60)) * 100;

  const isLow = timeLeft <= 60;

  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            className="fill-none stroke-muted"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            className={`fill-none transition-colors ${
              isLow ? "stroke-destructive" : "stroke-primary"
            }`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${isLow ? "text-destructive" : "text-foreground"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">restantes</span>
        </div>
      </div>

      {isLow && (
        <div className="flex items-center justify-center gap-2 text-destructive text-sm animate-pulse">
          <AlertCircle className="w-4 h-4" />
          <span>Tempo quase esgotando!</span>
        </div>
      )}
    </div>
  );
};
