import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShoppingCart,
  Phone,
  MapPin,
  Star,
  Lightbulb,
  Tv,
  Shield,
  Battery,
  Wrench,
  Mail,
  Send,
  CheckCircle
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config/api';

const Home = () => {
  const dispatch = useDispatch();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products?featured=true&limit=6`);
      console.log('API Response:', response.data); // Debug log
      setFeaturedProducts(response.data.products || response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', contactForm);

      if (response.data.success) {
        toast.success(response.data.message);
        setContactSubmitted(true);
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });

        // Reset submitted state after 5 seconds
        setTimeout(() => {
          setContactSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const categories = [
    { name: 'Fittings', icon: Wrench, description: 'Switches, Sockets, Cables', color: 'bg-blue-500' },
    { name: 'Lighting', icon: Lightbulb, description: 'Bulbs, Lamps, Fans', color: 'bg-yellow-500' },
    { name: 'Kitchen Appliances', icon: ShoppingCart, description: 'Refrigerators, Stoves, Blenders', color: 'bg-green-500' },
    { name: 'Entertainment', icon: Tv, description: 'TVs, Radios, Speakers', color: 'bg-purple-500' },
    { name: 'Security', icon: Shield, description: 'CCTV, Alarms, Sensors', color: 'bg-red-500' },
    { name: 'Power Backup', icon: Battery, description: 'Generators, Solar, Inverters', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Zap className="w-12 h-12" />
              <h1 className="text-5xl font-bold">UNH Electric & Electronic Enterprise</h1>
            </div>
            <p className="text-xl mb-8">
              Your trusted source for quality electrical and electronic appliances in Potiskum
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Potiskum Main Market</span>
              </div>
              <a href="tel:+2348142517157" className="flex items-center gap-2 hover:text-blue-200 transition">
                <Phone className="w-5 h-5" />
                <span>+234 814 251 7157</span>
              </a>
              <a href="mailto:unhelectronic@gmail.com" className="flex items-center gap-2 hover:text-blue-200 transition">
                <Mail className="w-5 h-5" />
                <span>unhelectronic@gmail.com</span>
              </a>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
              <Link
                to="/services"
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Shop by Category
              </h2>
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Explore our comprehensive range of electrical and electronic products
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const gradients = [
                'from-blue-500 to-blue-700',
                'from-yellow-400 to-orange-500',
                'from-green-500 to-emerald-600',
                'from-purple-500 to-indigo-600',
                'from-red-500 to-pink-600',
                'from-orange-500 to-amber-600'
              ];
              const badges = ['Popular', 'Trending', 'Essential', 'Hot', 'New', 'Featured'];
              const badgeColors = [
                'bg-blue-100 text-blue-600',
                'bg-yellow-100 text-yellow-600',
                'bg-green-100 text-green-600',
                'bg-purple-100 text-purple-600',
                'bg-red-100 text-red-600',
                'bg-orange-100 text-orange-600'
              ];
              const hoverTextColors = [
                'group-hover:text-blue-100',
                'group-hover:text-yellow-100',
                'group-hover:text-green-100',
                'group-hover:text-purple-100',
                'group-hover:text-red-100',
                'group-hover:text-orange-100'
              ];

              return (
                <Link
                  key={index}
                  to={`/products?category=${category.name}`}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`bg-gradient-to-br ${category.color.replace('bg-', 'from-')}-100 ${category.color.replace('bg-', 'to-')}-200 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                        <Icon className={`w-10 h-10 ${category.color.replace('bg-', 'text-')}-600 group-hover:text-white transition-colors duration-500`} />
                      </div>
                      <div className={`${badgeColors[index]} text-xs font-bold px-3 py-1 rounded-full group-hover:bg-white group-hover:${badgeColors[index].split(' ')[1]} transition-colors duration-500`}>
                        {badges[index]}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-white transition-colors duration-500">
                      {category.name}
                    </h3>
                    <p className={`text-gray-600 ${hoverTextColors[index]} transition-colors duration-500 mb-4`}>
                      {category.description}
                    </p>
                    <div className={`flex items-center ${category.color.replace('bg-', 'text-')}-600 group-hover:text-white font-semibold transition-colors duration-500`}>
                      <span>Browse Collection</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full"></div>
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                Discover our handpicked selection of top-quality products
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <span>View All Products</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-6 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={`/images/products/${product.images[0]?.url || product.images[0]}`}
                      alt={product.images[0]?.alt || product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                      }}
                    />
                    {product.stock < 10 && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        Low Stock
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ₦{product.price.toLocaleString()}
                        </span>
                        {product.unit && <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg transform hover:scale-105 ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add'}
                      </button>
                    </div>
                    {product.rating && product.rating.count > 0 && (
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{product.rating.average.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({product.rating.count} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Why Choose UNH Electric?
              </h2>
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Your trusted partner for quality electrical solutions in Potiskum
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Quality Products */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl border-2 border-transparent group-hover:border-blue-500">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 group-hover:text-white transition-colors duration-500">
                  Quality Products
                </h3>
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-blue-50 transition-colors duration-500">
                  We offer only genuine, high-quality electrical and electronic products from trusted brands
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full group-hover:w-24 transition-all duration-500"></div>
                </div>
              </div>
            </div>

            {/* Installation Services */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl border-2 border-transparent group-hover:border-green-500">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Wrench className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 group-hover:text-white transition-colors duration-500">
                  Installation Services
                </h3>
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-green-50 transition-colors duration-500">
                  Professional installation and maintenance services for all products we sell
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full group-hover:w-24 transition-all duration-500"></div>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl border-2 border-transparent group-hover:border-orange-500">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 w-24 h-24 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <Phone className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 group-hover:text-white transition-colors duration-500">
                  Customer Support
                </h3>
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-orange-50 transition-colors duration-500">
                  Dedicated customer support to help you choose the right products for your needs
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-amber-600 rounded-full group-hover:w-24 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-5xl font-bold mb-2">10+</div>
                <div className="text-blue-100 text-lg">Years of Experience</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-5xl font-bold mb-2">1000+</div>
                <div className="text-blue-100 text-lg">Happy Customers</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-blue-100 text-lg">Product Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Get In Touch
                </h2>
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                Have questions? We're here to help! Send us a message or reach out directly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 transform hover:scale-105 transition-all duration-500 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Visit Our Store */}
                  <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2 text-lg">Visit Our Store</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Potiskum Main Market<br />
                        Potiskum, Yobe State<br />
                        Nigeria
                      </p>
                    </div>
                  </div>

                  {/* Call Us */}
                  <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2 text-lg">Call Us</h4>
                      <a
                        href="tel:+2348142517157"
                        className="text-gray-600 hover:text-green-600 transition font-semibold text-lg block"
                      >
                        +234 814 251 7157
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Mon - Sat: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  {/* Email Us */}
                  <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2 text-lg">Email Us</h4>
                      <a
                        href="mailto:unhelectronic@gmail.com"
                        className="text-gray-600 hover:text-purple-600 transition font-semibold block"
                      >
                        unhelectronic@gmail.com
                      </a>
                      <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">Business Hours</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50">
                      <span className="text-gray-700 font-medium">Monday - Friday</span>
                      <span className="font-bold text-blue-600">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-green-50">
                      <span className="text-gray-700 font-medium">Saturday</span>
                      <span className="font-bold text-green-600">8:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-red-50">
                      <span className="text-gray-700 font-medium">Sunday</span>
                      <span className="font-bold text-red-600">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 transform hover:scale-105 transition-all duration-500 border border-gray-100">
                {contactSubmitted ? (
                  <div className="text-center py-12">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                      <CheckCircle className="relative w-20 h-20 text-green-500 mx-auto" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                        <Send className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Send Us a Message
                      </h3>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      {/* Name Field */}
                      <div className="group">
                        <label htmlFor="home-name" className="block text-sm font-bold text-gray-700 mb-2">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="home-name"
                            name="name"
                            value={contactForm.name}
                            onChange={handleContactChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="group">
                        <label htmlFor="home-email" className="block text-sm font-bold text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="home-email"
                            name="email"
                            value={contactForm.email}
                            onChange={handleContactChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div className="group">
                        <label htmlFor="home-phone" className="block text-sm font-bold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            id="home-phone"
                            name="phone"
                            value={contactForm.phone}
                            onChange={handleContactChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                            placeholder="+234 XXX XXX XXXX"
                          />
                        </div>
                      </div>

                      {/* Subject Field */}
                      <div className="group">
                        <label htmlFor="home-subject" className="block text-sm font-bold text-gray-700 mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="home-subject"
                            name="subject"
                            value={contactForm.subject}
                            onChange={handleContactChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                            placeholder="How can we help?"
                          />
                        </div>
                      </div>

                      {/* Message Field */}
                      <div className="group">
                        <label htmlFor="home-message" className="block text-sm font-bold text-gray-700 mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            id="home-message"
                            name="message"
                            value={contactForm.message}
                            onChange={handleContactChange}
                            required
                            rows="5"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none group-hover:border-gray-300"
                            placeholder="Tell us more about your inquiry..."
                          ></textarea>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={contactLoading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg transform hover:scale-105 ${
                          contactLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        {contactLoading ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6" />
                            <span className="text-lg">Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Banner */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-lg transform rotate-12"></div>
          <div className="absolute top-40 right-20 w-16 h-16 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 border-4 border-white rounded-lg transform -rotate-12"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 border-4 border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-30"></div>
                <div className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 rounded-full border-4 border-white border-opacity-30">
                  <Wrench className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Need Installation or Repair Services?
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl mb-10 text-green-50 leading-relaxed max-w-3xl mx-auto">
              We provide professional installation, maintenance, and repair services for all electrical and electronic appliances
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 transform hover:scale-105 transition-all duration-300">
                <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Expert Technicians</h3>
                <p className="text-green-100 text-sm">Certified professionals with years of experience</p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 transform hover:scale-105 transition-all duration-300">
                <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Fast Response</h3>
                <p className="text-green-100 text-sm">Quick turnaround time for all service requests</p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 transform hover:scale-105 transition-all duration-300">
                <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Fair Pricing</h3>
                <p className="text-green-100 text-sm">Transparent and competitive service rates</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/services"
                className="group relative bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-3 shadow-2xl transform hover:scale-105"
              >
                <span>Request Service</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <a
                href="tel:+2348142517157"
                className="group bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300 inline-flex items-center gap-3 transform hover:scale-105"
              >
                <Phone className="w-6 h-6" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

