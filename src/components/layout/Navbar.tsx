
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  X,
  BookOpen,
  Trophy,
  User,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn] = useState(false); // This would be replaced with actual auth state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="levelup-container">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="sr-only">LevelUp Learning</span>
              <div className="h-8 w-8 bg-levelup-purple rounded-md flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-levelup-dark-blue">
                LevelUp Learning
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/courses"
              className="text-levelup-gray hover:text-levelup-purple transition-colors duration-200"
            >
              Courses
            </Link>
            <Link
              to="/about"
              className="text-levelup-gray hover:text-levelup-purple transition-colors duration-200"
            >
              About
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-levelup-gray" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-levelup-purple focus:border-transparent"
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link to="/profile">
                  <Button className="bg-levelup-purple hover:bg-levelup-purple/90">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-levelup-purple hover:bg-levelup-purple/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-levelup-gray hover:text-levelup-purple focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-accordion-down">
          <div className="pt-2 pb-4 space-y-1 px-4">
            <Link
              to="/courses"
              className="block py-2 text-levelup-gray hover:text-levelup-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Courses
              </div>
            </Link>
            <Link
              to="/about"
              className="block py-2 text-levelup-gray hover:text-levelup-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                About
              </div>
            </Link>
            <div className="pt-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-levelup-gray" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-levelup-purple focus:border-transparent"
                />
              </div>
            </div>
            <div className="pt-4 pb-2 border-t border-gray-200">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-levelup-gray hover:text-levelup-purple"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2 text-levelup-gray hover:text-levelup-purple"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-levelup-gray hover:text-levelup-purple"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-levelup-purple font-medium hover:text-levelup-purple/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
