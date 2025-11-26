import { Link, useNavigate } from "react-router-dom";
import { Search, LogIn, LogOut, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold">BlogHub</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            <Link to="/?category=Development" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Development
            </Link>
            <Link to="/?category=Design" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Design
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            
            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
