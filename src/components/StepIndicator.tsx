import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-6 mb-10 px-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                currentStep > step.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : currentStep === step.id
                  ? "gradient-primary text-primary-foreground shadow-elevated"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              ) : (
                step.id
              )}
              {currentStep === step.id && (
                <motion.div
                  layoutId="activeStep"
                  className="absolute inset-0 rounded-2xl border-2 border-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`text-xs mt-3 hidden sm:block font-medium transition-colors duration-300 ${
                currentStep >= step.id
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </motion.span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="relative w-8 sm:w-16 h-1 mx-2 sm:mx-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 gradient-primary rounded-full"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
