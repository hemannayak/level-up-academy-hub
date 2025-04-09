
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-levelup-dark-blue text-white pt-12 pb-6">
      <div className="levelup-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">LevelUp Learning</h3>
            <p className="text-sm opacity-80 mb-6">
              Empowering learners to achieve their goals through engaging, gamified education.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-levelup-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-levelup-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-levelup-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-levelup-purple transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-sm opacity-80 hover:opacity-100 hover:text-levelup-purple transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:opacity-100 hover:text-levelup-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm opacity-80 hover:opacity-100 hover:text-levelup-purple transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm opacity-80 hover:opacity-100 hover:text-levelup-purple transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm opacity-80 hover:opacity-100 hover:text-levelup-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-levelup-purple" />
                <span className="text-sm opacity-80">
                  Team17, 2nd year CSD-B, HITAM
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-levelup-purple" />
                <span className="text-sm opacity-80">+91-XXXXXXXX</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-levelup-purple" />
                <span className="text-sm opacity-80">info@leveluplearning.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe</h3>
            <p className="text-sm opacity-80 mb-4">
              Stay updated with our latest courses and offers.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md text-levelup-dark-blue focus:outline-none focus:ring-2 focus:ring-levelup-purple"
              />
              <button
                type="submit"
                className="bg-levelup-purple hover:bg-levelup-purple/90 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-sm opacity-70">
            &copy; {currentYear} LevelUp Learning. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
