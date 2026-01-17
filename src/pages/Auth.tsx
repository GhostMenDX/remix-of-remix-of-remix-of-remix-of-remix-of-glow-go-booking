import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";
import { toast } from "@/hooks/use-toast";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

const emailSchema = z.string().trim().email("E-mail inválido").max(255);
const passwordSchema = z
  .string()
  .min(8, "Senha precisa ter pelo menos 8 caracteres")
  .max(72, "Senha muito longa");

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha").max(72),
});

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [busy, setBusy] = useState<"login" | "signup" | null>(null);

  const from = useMemo(() => {
    const state = location.state as { from?: Location } | null;
    const pathname = state?.from?.pathname;
    return pathname && pathname !== "/auth" ? pathname : "/dashboard";
  }, [location.state]);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onLogin = async (values: LoginValues) => {
    setBusy("login");
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setBusy(null);

    if (error) {
      toast({
        title: "Não foi possível entrar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Bem-vindo(a)!", description: "Login realizado com sucesso." });
    navigate(from, { replace: true });
  };

  const onSignup = async (values: SignupValues) => {
    setBusy("signup");
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo: redirectUrl },
    });

    setBusy(null);

    if (error) {
      toast({
        title: "Não foi possível criar sua conta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Conta criada!",
      description: "Você já pode acessar o dashboard.",
    });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="container max-w-md py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Acesso</h1>
            <p className="text-sm text-muted-foreground">Entre para abrir o Dashboard</p>
          </div>
        </div>

        <Card className="p-6 sm:p-7 rounded-[2rem] border-border/40 shadow-card bg-card/80 backdrop-blur">
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid grid-cols-2 bg-secondary/60 p-1.5 rounded-2xl">
              <TabsTrigger value="login" className="rounded-xl">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-5">
              <form
                className="space-y-5"
                onSubmit={loginForm.handleSubmit(onLogin)}
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input
                    id="login-email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email?.message && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password?.message && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-2xl h-12 font-bold shadow-soft hover:shadow-elevated transition-all"
                  disabled={busy === "login"}
                >
                  {busy === "login" ? "Entrando…" : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-5">
              <form
                className="space-y-5"
                onSubmit={signupForm.handleSubmit(onSignup)}
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email?.message && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="mínimo 8 caracteres"
                    {...signupForm.register("password")}
                  />
                  {signupForm.formState.errors.password?.message && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-2xl h-12 font-bold shadow-soft hover:shadow-elevated transition-all"
                  disabled={busy === "signup"}
                >
                  {busy === "signup" ? "Criando…" : "Criar conta"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Dica: em testes, você pode manter o auto-confirmação de e-mail ativada para entrar imediatamente.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
