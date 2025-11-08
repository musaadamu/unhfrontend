import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { clearCart } from '../redux/slices/cartSlice';
import { API_URL } from '../config/api';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Payment Information
    paymentMethod: 'cash',
    
    // Order Notes
    notes: ''
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0 && !orderPlaced) {
      toast.info('Your cart is empty');
      navigate('/products');
      return;
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast.info('Please login to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Pre-fill user information if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [items, isAuthenticated, user, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateShipping = () => {
    // Free shipping for orders over ₦50,000
    if (total >= 50000) return 0;
    // Flat rate shipping
    return 2000;
  };

  const calculateTax = () => {
    // 7.5% VAT
    return total * 0.075;
  };

  const shippingFee = calculateShipping();
  const tax = calculateTax();
  const grandTotal = total + shippingFee + tax;

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state'];
    
    for (let field of required) {
      if (!formData[field] || formData[field].trim() === '') {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Validate phone
    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || ''
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        subtotal: total,
        shippingFee: shippingFee,
        tax: tax,
        total: grandTotal,
        notes: formData.notes
      };

      const response = await axios.post(
        `${API_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrderNumber(response.data.order.orderNumber);
        setOrderPlaced(true);
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Order Placed Successfully!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've received your order and will process it shortly.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
              <p className="text-2xl font-bold text-blue-600">{orderNumber}</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                A confirmation email has been sent to <strong>{formData.email}</strong>
              </p>
              
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-blue-600" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="08012345678"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter your street address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-800">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-800">Bank Transfer</p>
                      <p className="text-sm text-gray-600">Transfer to our bank account</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-800">Debit/Credit Card</p>
                      <p className="text-sm text-gray-600">Pay securely with your card</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Order Notes (Optional)
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any special instructions for your order?"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <img
                        src={`/images/products/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-blue-600">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold">₦{total.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span className="font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₦${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (7.5%)</span>
                    <span className="font-semibold">₦{tax.toLocaleString()}</span>
                  </div>

                  {shippingFee === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 font-semibold">
                        🎉 You've qualified for FREE shipping!
                      </p>
                    </div>
                  )}

                  {total < 50000 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        Add ₦{(50000 - total).toLocaleString()} more for FREE shipping
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">₦{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

