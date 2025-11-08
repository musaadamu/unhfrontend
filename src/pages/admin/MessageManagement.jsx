import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Mail,
  Search,
  Eye,
  Trash2,
  Send,
  X,
  User,
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const MessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0
  });

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (statusFilter) params.append('status', statusFilter);
      params.append('limit', '100');

      const response = await axios.get(
        `http://localhost:5000/api/contact?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessages(response.data.messages);
        calculateStats(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (messagesData) => {
    const stats = {
      total: messagesData.length,
      unread: messagesData.filter(m => m.status === 'unread').length,
      read: messagesData.filter(m => m.status === 'read').length,
      replied: messagesData.filter(m => m.status === 'replied').length
    };
    setStats(stats);
  };

  const viewMessageDetails = async (message) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/contact/${message._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSelectedMessage(response.data.message);
        setShowDetailsModal(true);
        
        // Mark as read if unread
        if (message.status === 'unread') {
          await handleReply(message._id, '', 'read');
        }
      }
    } catch (error) {
      console.error('Error fetching message details:', error);
      toast.error('Failed to fetch message details');
    }
  };

  const handleReply = async (messageId, reply, status = 'replied') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/contact/${messageId}/reply`,
        { reply, status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        if (reply) {
          toast.success('Reply sent successfully');
          setReplyText('');
        }
        fetchMessages();
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const handleDelete = async (messageId, senderName) => {
    if (window.confirm(`Are you sure you want to delete the message from ${senderName}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:5000/api/contact/${messageId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          toast.success('Message deleted successfully');
          fetchMessages();
          setShowDetailsModal(false);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    const searchLower = searchTerm.toLowerCase();
    return (
      message.name?.toLowerCase().includes(searchLower) ||
      message.email?.toLowerCase().includes(searchLower) ||
      message.subject?.toLowerCase().includes(searchLower) ||
      message.message?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    const colors = {
      unread: 'bg-yellow-100 text-yellow-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      unread: <AlertCircle className="w-4 h-4" />,
      read: <CheckCircle className="w-4 h-4" />,
      replied: <Send className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Message Management
        </h1>
        <p className="text-gray-600">View and respond to customer messages</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Messages</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Unread</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Read</p>
              <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Replied</p>
              <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            </div>
            <Send className="w-10 h-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Sender</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No messages found
                  </td>
                </tr>
              ) : (
                filteredMessages.map((message) => (
                  <tr 
                    key={message._id} 
                    className={`hover:bg-gray-50 transition ${
                      message.status === 'unread' ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{message.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-600">{message.email}</p>
                        <p className="text-gray-500">{message.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 truncate max-w-xs">
                        {message.subject || 'No Subject'}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {message.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(message.status)}`}>
                        {getStatusIcon(message.status)}
                        {message.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewMessageDetails(message)}
                          className="text-blue-600 hover:text-blue-700 transition"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(message._id, message.name)}
                          className="text-red-600 hover:text-red-700 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Details Modal */}
      {showDetailsModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Message Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Sender Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Sender Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="font-semibold text-gray-800">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <p className="font-semibold text-gray-800">{selectedMessage.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Date
                    </p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Message
                </h3>
                {selectedMessage.subject && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-semibold text-gray-800">{selectedMessage.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Status</h3>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(selectedMessage.status)}`}>
                    {getStatusIcon(selectedMessage.status)}
                    {selectedMessage.status}
                  </span>
                  {selectedMessage.repliedAt && (
                    <p className="text-sm text-gray-600">
                      Replied on {new Date(selectedMessage.repliedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Reply Section */}
              {selectedMessage.reply && (
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Your Reply
                  </h3>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.reply}</p>
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {selectedMessage.reply ? 'Send Another Reply' : 'Send Reply'}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (replyText.trim()) {
                      handleReply(selectedMessage._id, replyText);
                    }
                  }}
                  className="space-y-4"
                >
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedMessage._id, selectedMessage.name)}
                      className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 font-semibold flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex-1 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-300 font-semibold text-center flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Email Directly
                </a>
                <a
                  href={`tel:${selectedMessage.phone}`}
                  className="flex-1 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all duration-300 font-semibold text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageManagement;

