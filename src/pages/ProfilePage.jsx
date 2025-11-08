import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateUserProfile, updatePassword } from '../redux/slices/authSlice';
import { User, Mail, Phone, MapPin, Lock, Loader, ShoppingBag, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config/api';

const ProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits'),
  address: Yup.object().shape({
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
  }),
});

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateUserProfile(values)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Profile update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })).unwrap();
      toast.success('Password updated successfully!');
      resetForm();
    } catch (err) {
      toast.error(err || 'Password update failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders') {
        setLoadingOrders(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.success) {
            setOrders(response.data.orders);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Failed to load orders');
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'orders'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'password'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {activeTab === 'profile' && (
              <Formik
                initialValues={{
                  name: user?.name || '',
                  phone: user?.phone || '',
                  address: {
                    street: user?.address?.street || '',
                    city: user?.address?.city || '',
                    state: user?.address?.state || '',
                    zipCode: user?.address?.zipCode || '',
                  },
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleProfileUpdate}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="phone"
                          name="phone"
                          type="tel"
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Address
                      </h3>

                      <div>
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <Field
                          id="address.street"
                          name="address.street"
                          type="text"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <Field
                            id="address.city"
                            name="address.city"
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <Field
                            id="address.state"
                            name="address.state"
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Zip Code
                          </label>
                          <Field
                            id="address.zipCode"
                            name="address.zipCode"
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {(isSubmitting || loading) ? (
                          <>
                            <Loader className="animate-spin h-5 w-5 mr-2" />
                            Updating...
                          </>
                        ) : (
                          'Update Profile'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {activeTab === 'password' && (
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={PasswordSchema}
                onSubmit={handlePasswordUpdate}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6 max-w-md">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {(isSubmitting || loading) ? (
                          <>
                            <Loader className="animate-spin h-5 w-5 mr-2" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {activeTab === 'orders' && (
              <div>
                {loadingOrders ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader className="animate-spin h-8 w-8 text-primary-600" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                    <div className="mt-6">
                      <a
                        href="/products"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Browse Products
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Order Number</p>
                            <p className="text-lg font-semibold text-gray-900">{order.orderNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Order Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <Package className="h-5 w-5 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                            <div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                <span className="font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-sm text-gray-500">+ {order.items.length - 2} more items</p>
                            )}
                          </div>

                          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Total Amount</span>
                            <span className="text-lg font-bold text-primary-600">₦{order.total.toLocaleString()}</span>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <span className={`text-xs px-2 py-1 rounded ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                              order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                              {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

