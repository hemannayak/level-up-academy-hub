
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-levelup-purple">
              LevelUp Learning
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-levelup-purple">
              Home
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-levelup-purple">
              Courses
            </Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-levelup-purple">
              Leaderboard
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-levelup-purple">
              Contact
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-levelup-purple">
                  Dashboard
                </Link>
                <div className="relative group">
                  <Button variant="ghost" className="p-2 rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link to="/" className="block py-2 text-gray-700 hover:text-levelup-purple" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/courses" className="block py-2 text-gray-700 hover:text-levelup-purple" onClick={toggleMenu}>
              Courses
            </Link>
            <Link to="/leaderboard" className="block py-2 text-gray-700 hover:text-levelup-purple" onClick={toggleMenu}>
              Leaderboard
            </Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-levelup-purple" onClick={toggleMenu}>
              Contact
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-levelup-purple" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-levelup-purple" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link to="/settings" className="block py-2 text-gray-700 hover:text-levelup-purple" onClick={toggleMenu}>
                  Settings
                </Link>
                <button
                  className="w-full text-left py-2 text-red-600 hover:text-red-700 flex items-center"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
