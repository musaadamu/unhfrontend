import { Link } from 'react-router-dom';
import { Zap, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    UNH Electric
                  </h3>
                  <p className="text-xs text-gray-400">Quality & Trust</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your trusted source for quality electrical and electronic appliances in Potiskum. 
                We provide genuine products and professional services.
              </p>
              {/* Social Media Links */}
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="bg-gray-800 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="bg-gray-800 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="bg-gray-800 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="bg-gray-800 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Products
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/services" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Services
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Product Categories */}
            <div>
              <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Categories
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/products?category=Fittings" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Fittings
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products?category=Lighting" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Lighting
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products?category=Kitchen Appliances" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Kitchen Appliances
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products?category=Entertainment" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Entertainment
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products?category=Security" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Security
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products?category=Power Backup" 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    → Power Backup
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mt-1 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-400 leading-relaxed">
                      Potiskum Main Market<br />
                      Potiskum, Yobe State<br />
                      Nigeria
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <a 
                      href="tel:+2348142517157" 
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      +234 814 251 7157
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Mon - Sat: 8AM - 6PM</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <a 
                      href="mailto:unhelectronic@gmail.com" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 break-all"
                    >
                      unhelectronic@gmail.com
                    </a>
                    <p className="text-xs text-gray-500 mt-1">24/7 Support</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {currentYear} <span className="font-semibold text-white">UNH Electric & Electronic Enterprise</span>. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

