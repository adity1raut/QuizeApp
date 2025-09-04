import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  Trash2, 
  Edit, 
  Calendar, 
  TrendingUp,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  UserCheck,
  Shield,
  Eye,
  Filter
} from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchUsers = async () => {
    if (!isAuthenticated || !isAdmin()) return;

    try {
      setLoading(true);
      setError("");
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter })
      });
      
      const response = await axios.get(`/api/admin/users?${params}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data.data || response.data;
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || data.total || 0);
    } catch (err) {
      console.error('Fetch users error:', err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || "Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search/filter changes
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, isAuthenticated, isAdmin]);

  const handleRoleUpdate = async (userId, newRole) => {
    // Prevent self-demotion
    if (user?.id === userId && newRole !== 'Admin') {
      setError("You cannot change your own admin role");
      return;
    }

    try {
      setUpdating(userId);
      setError("");
      setSuccess("");
      
      const response = await axios.put(`/api/admin/users/${userId}/role`, 
        { role: newRole },
        { 
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(`User role updated to ${newRole} successfully!`);
      
      // Update the user in the current list instead of refetching
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Role update error:', err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || "Failed to update user role");
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    // Prevent self-deletion
    if (user?.id === userId) {
      setError("You cannot delete your own account");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        setDeleting(userId);
        setError("");
        setSuccess("");
        
        await axios.delete(`/api/admin/users/${userId}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        
        setSuccess(`User "${username}" deleted successfully!`);
        
        // Remove user from the current list
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        setTotalUsers(prev => prev - 1);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error('Delete user error:', err);
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError(err.response?.data?.error || err.response?.data?.message || "Failed to delete user");
        }
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-900/30 text-red-300 border-red-700';
      case 'Moderator':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      default:
        return 'bg-green-900/30 text-green-300 border-green-700';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="flex items-center bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-400 hover:text-red-300 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
            <span className="flex-1">{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="ml-2 text-green-400 hover:text-green-300 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Users className="h-8 w-8 mr-3 text-purple-400" />
              User Management
            </h1>
            <p className="text-gray-400 mt-1">
              Total Users: {totalUsers}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/analytics")}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="User">Users</option>
                <option value="Admin">Admins</option>
                <option value="Moderator">Moderators</option>
              </select>
              <select
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="username-asc">Name A-Z</option>
                <option value="username-desc">Name Z-A</option>
                <option value="role-asc">Role A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
            </div>
          )}
          
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No users found</p>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => handleSort('username')}
                    >
                      <div className="flex items-center">
                        User
                        {sortBy === 'username' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center">
                        Role
                        {sortBy === 'role' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Joined
                        {sortBy === 'createdAt' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((userData) => (
                    <tr key={userData._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                            <span className="text-sm font-medium text-white">
                              {userData.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {userData.username}
                              {user?.id === userData._id && (
                                <span className="ml-2 text-xs text-purple-400">(You)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {userData.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={userData.role}
                          onChange={(e) => handleRoleUpdate(userData._id, e.target.value)}
                          disabled={updating === userData._id || user?.id === userData._id}
                          className={`text-sm bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${getRoleBadgeColor(userData.role)}`}
                        >
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                          <option value="Moderator">Moderator</option>
                        </select>
                        {updating === userData._id && (
                          <Loader2 className="inline-block ml-2 h-4 w-4 text-purple-500 animate-spin" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(userData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(userData.role)}`}>
                          {userData.role === 'Admin' && <Shield className="h-3 w-3 mr-1" />}
                          {userData.role === 'Moderator' && <UserCheck className="h-3 w-3 mr-1" />}
                          {userData.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {/* Add view user details functionality */}}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userData._id, userData.username)}
                            disabled={deleting === userData._id || user?.id === userData._id}
                            className="text-red-400 hover:text-red-300 transition-colors p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title={user?.id === userData._id ? "Cannot delete your own account" : "Delete User"}
                          >
                            {deleting === userData._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Showing page <span className="font-medium text-white">{currentPage}</span> of{' '}
                      <span className="font-medium text-white">{totalPages}</span>
                      {totalUsers > 0 && (
                        <span> ({totalUsers} total users)</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        First
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-800 text-sm font-medium text-gray-300">
                        {currentPage}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Last
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;