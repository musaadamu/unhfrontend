import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Sun,
  Zap,
  Settings,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Award,
  Users,
  ArrowRight,
  Lightbulb,
  Fan,
  Tv,
  Home as HomeIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config/api';

const Services = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    serviceCategory: '',
    description: '',
    preferredDate: ''
  });
  const [loading, setLoading] = useState(false);

  const services = [
    {
      icon: <Sun className="w-12 h-12" />,
      title: 'Solar Installation',
      description: 'Complete solar power system installation for homes and businesses',
      features: [
        'Solar panel installation',
        'Inverter setup and configuration',
        'Battery bank installation',
        'Wiring and electrical connections',
        'System testing and commissioning'
      ],
      gradient: 'from-yellow-500 to-orange-500',
      category: 'solar'
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Electrical Installation',
      description: 'Professional electrical wiring and installation services',
      features: [
        'Complete house wiring',
        'Distribution board installation',
        'Socket and switch installation',
        'Lighting installation',
        'Electrical safety inspection'
      ],
      gradient: 'from-blue-500 to-purple-500',
      category: 'electrical'
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: 'Repair & Maintenance',
      description: 'Expert repair and maintenance for all electrical appliances',
      features: [
        'Appliance troubleshooting',
        'Component replacement',
        'Preventive maintenance',
        'Performance optimization',
        'Emergency repairs'
      ],
      gradient: 'from-green-500 to-teal-500',
      category: 'appliance'
    },
    {
      icon: <Settings className="w-12 h-12" />,
      title: 'Technical Consultation',
      description: 'Professional advice on electrical and solar solutions',
      features: [
        'Energy audit and assessment',
        'System design and planning',
        'Cost estimation',
        'Product recommendations',
        'Technical support'
      ],
      gradient: 'from-purple-500 to-pink-500',
      category: 'electrical'
    }
  ];

  const whyChooseUs = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Certified Technicians',
      description: 'Our team consists of highly trained and certified professionals'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Guarantee',
      description: 'We guarantee quality workmanship and use only genuine parts'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Timely Service',
      description: 'We respect your time and complete projects on schedule'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Customer Satisfaction',
      description: 'Your satisfaction is our priority with 24/7 support'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/services/request`, formData);
      
      if (response.data.success) {
        toast.success('Service request submitted successfully! We will contact you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          serviceType: '',
          serviceCategory: '',
          description: '',
          preferredDate: ''
        });
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit service request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Electrical & Solar Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Expert Installation, Repair, and Maintenance Services in Potiskum
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#request-service"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
              >
                Request Service
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="tel:+2348142517157"
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive electrical and solar solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-r ${service.gradient} p-6 text-white`}>
                  <div className="flex items-center gap-4">
                    {service.icon}
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                  </div>
                  <p className="mt-3 text-white/90">{service.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose UNH Electric & Electronic Enterprise
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Request Form */}
      <section id="request-service" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Request a Service
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-xl shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your location in Potiskum"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select service type</option>
                  <option value="installation">Installation</option>
                  <option value="repair">Repair</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Service Category
                </label>
                <select
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="electrical">Electrical</option>
                  <option value="solar">Solar</option>
                  <option value="appliance">Appliance</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe the service you need..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Service Request'}
            </button>
          </form>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-blue-100">
              We're here to help with all your electrical and solar needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Phone</h3>
              <a href="tel:+2348142517157" className="text-blue-100 hover:text-white transition">
                +234 814 251 7157
              </a>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <a href="mailto:unhelectronic@gmail.com" className="text-blue-100 hover:text-white transition">
                unhelectronic@gmail.com
              </a>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Location</h3>
              <p className="text-blue-100">
                Potiskum Main Market<br />
                Potiskum, Yobe State, Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

