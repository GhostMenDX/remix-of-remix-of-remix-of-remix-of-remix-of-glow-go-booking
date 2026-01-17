import { Sparkles, Calendar, LayoutDashboard, Users, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-shadow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display text-xl font-semibold text-foreground">
              Beleza
            </span>
            <span className="font-display text-xl font-light text-primary">Studio</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Agendar</span>
            </Button>
          </Link>
          <Link to="/professionals">
            <Button
              variant={location.pathname === "/professionals" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Equipe</span>
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant={location.pathname === "/dashboard" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>

          {!loading && (
            user ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            ) : (
              <Link to="/auth" state={{ from: location }}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </Button>
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};
