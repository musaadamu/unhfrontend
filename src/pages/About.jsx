import { Link } from 'react-router-dom';
import {
  Award,
  Users,
  Target,
  Heart,
  Zap,
  Sun,
  Shield,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Star,
  Lightbulb,
  Wrench
} from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '500+', label: 'Happy Customers' },
    { icon: <Award className="w-8 h-8" />, value: '10+', label: 'Years Experience' },
    { icon: <CheckCircle className="w-8 h-8" />, value: '1000+', label: 'Projects Completed' },
    { icon: <Star className="w-8 h-8" />, value: '100%', label: 'Customer Satisfaction' }
  ];

  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Quality Assurance',
      description: 'We guarantee the highest quality products and services, using only genuine parts and certified equipment.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We listen to your needs and provide tailored solutions.',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      icon: <Lightbulb className="w-12 h-12" />,
      title: 'Innovation',
      description: 'We stay updated with the latest technology and best practices in electrical and solar solutions.',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Professional Team',
      description: 'Our certified technicians bring expertise and dedication to every project.',
      gradient: 'from-green-500 to-teal-600'
    }
  ];

  const services = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Electrical Solutions',
      items: ['House Wiring', 'Distribution Boards', 'Lighting Systems', 'Safety Inspections']
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: 'Solar Power',
      items: ['Solar Panels', 'Inverters', 'Battery Systems', 'Complete Installation']
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Maintenance & Repair',
      items: ['Appliance Repair', 'Preventive Maintenance', 'Emergency Services', 'Technical Support']
    }
  ];

  const timeline = [
    {
      year: '2014',
      title: 'Company Founded',
      description: 'UNH Electric & Electronic Enterprise was established in Potiskum Main Market'
    },
    {
      year: '2016',
      title: 'Expansion',
      description: 'Expanded services to include solar power solutions and installations'
    },
    {
      year: '2019',
      title: 'Recognition',
      description: 'Became a trusted name in electrical and solar services across Yobe State'
    },
    {
      year: '2024',
      title: 'Digital Transformation',
      description: 'Launched online platform for easier access to products and services'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About UNH Electric & Electronic Enterprise
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your Trusted Partner for Quality Electrical Appliances and Professional Solar Solutions in Potiskum
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  <strong className="text-blue-600">UNH Electric & Electronic Enterprise</strong> is a leading provider of electrical appliances and solar equipment in Potiskum, Yobe State, Nigeria. Founded by <strong>Usman Nasiru Haruna</strong>, we have been serving the community with dedication and excellence.
                </p>
                <p>
                  Located in the heart of <strong>Potiskum Main Market</strong>, we specialize in the sales, installation, maintenance, and repair of electrical and electronic appliances. Our commitment to quality and customer satisfaction has made us a trusted name in the region.
                </p>
                <p>
                  We offer a comprehensive range of products including refrigerators, air conditioners, washing machines, televisions, solar panels, inverters, batteries, and much more. Our team of certified technicians ensures professional installation and reliable after-sales service.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To provide high-quality electrical appliances and solar solutions that enhance the lives of our customers, while delivering exceptional service through professional installation, maintenance, and support. We strive to make modern electrical and solar technology accessible and affordable to everyone in our community.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To become the leading provider of electrical and solar solutions in Northern Nigeria, recognized for our commitment to quality, innovation, and customer satisfaction. We envision a future where every home and business has access to reliable electrical power and sustainable solar energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-r ${value.gradient} p-6 text-white`}>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center">{value.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 text-center">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive electrical and solar solutions for your home and business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <ul className="space-y-3">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A decade of growth and excellence
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 hidden md:block"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 md:text-right">
                    {index % 2 === 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    {index % 2 !== 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visit Us Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Experience quality products and exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
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
          </div>

          <div className="text-center">
            <Link
              to="/products"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              Browse Our Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

