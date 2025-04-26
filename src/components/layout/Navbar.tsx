import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle, LogOut, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  return <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl text-gradient font-extrabold text-violet-600">LevelUp Learning</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/courses" className="text-foreground hover:text-primary transition-colors">
              Courses
            </Link>
            <Link to="/leaderboard" className="text-foreground hover:text-primary transition-colors">
              Leaderboard
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            {user ? <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <Button variant="ghost" className="p-2 rounded-full bg-secondary/50 hover:bg-secondary">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block animate-fade-in border border-border">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">Profile</Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">Settings</Link>
                      <button className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary flex items-center" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div> : <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="gradient">Register</Button>
                </Link>
              </div>}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="outline-none text-foreground hover:text-primary transition-colors" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            <Link to="/" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/courses" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
              Courses
            </Link>
            <Link to="/leaderboard" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
              Leaderboard
            </Link>
            <Link to="/contact" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
              Contact
            </Link>
            {user ? <>
                <Link to="/dashboard" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <Link to="/profile" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link to="/settings" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
                  Settings
                </Link>
                <button className="w-full text-left py-2 text-destructive hover:text-destructive/80 flex items-center" onClick={() => {
            handleLogout();
            toggleMenu();
          }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </> : <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button variant="gradient" className="w-full">Register</Button>
                </Link>
              </div>}
          </div>}
      </div>
    </nav>;
};
export default Navbar;