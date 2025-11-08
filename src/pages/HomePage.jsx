import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zap, Sun, Wrench, ShoppingCart } from 'lucide-react';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              UNH Electric & Electronic Enterprise
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Your trusted partner for electrical appliances and solar solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700"
              >
                <Wrench className="mr-2 h-5 w-5" />
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Electrical Appliances</h3>
            <p className="text-gray-600">
              Wide range of quality electrical appliances for home and office use
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
              <Sun className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Solar Equipment</h3>
            <p className="text-gray-600">
              Premium solar panels, inverters, and batteries for sustainable energy
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
              <Wrench className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Installation Services</h3>
            <p className="text-gray-600">
              Professional installation and maintenance services by certified technicians
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Message for Logged-in Users */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-primary-700">
              Browse our latest products and services, or manage your account.
            </p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {!user && (
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create an account to enjoy exclusive benefits and faster checkout
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

