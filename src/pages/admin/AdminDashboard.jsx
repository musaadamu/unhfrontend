import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import axios from 'axios';
import { API_URL } from '../../config/api';

const AdminDashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/api/products?limit=1000`),
        axios.get(`${API_URL}/api/categories`)
      ]);

      setStats({
        totalProducts: productsRes.data.total || 0,
        totalCategories: categoriesRes.data.count || 0,
        totalOrders: 0,
        totalRevenue: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 fixed h-full z-30`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-400 mt-1">{user?.name}</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path, item.exact)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                  : 'hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Section - Home & Logout */}
        <div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            <Home size={20} />
            {sidebarOpen && <span>Go to Home</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {location.pathname === '/admin/dashboard' ? (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Products</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalProducts}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Categories</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCategories}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FolderTree className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Revenue</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">₦{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 text-2xl font-bold">₦</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/admin/products"
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all group"
                  >
                    <Package className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="font-semibold text-gray-800">Manage Products</h3>
                    <p className="text-sm text-gray-500 mt-1">Add, edit, or delete products</p>
                  </Link>

                  <Link
                    to="/admin/categories"
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-lg transition-all group"
                  >
                    <FolderTree className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="font-semibold text-gray-800">Manage Categories</h3>
                    <p className="text-sm text-gray-500 mt-1">Organize product categories</p>
                  </Link>

                  <Link
                    to="/admin/orders"
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-lg transition-all group"
                  >
                    <ShoppingCart className="text-green-600 mb-2 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="font-semibold text-gray-800">View Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">Process customer orders</p>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

