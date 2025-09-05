import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users, BarChart3, Loader2 } from 'lucide-react';
import { useAuth } from "../../../contexts/AuthContext";
import UserTable from './UserTable';
import UserFilters from './UserFilters';
import StatusMessages from './StatusMessages';
import Pagination from './Pagination';

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
        <StatusMessages error={error} success={success} setError={setError} setSuccess={setSuccess} />
        
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

        <UserFilters 
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        />

        <UserTable
          users={users}
          loading={loading}
          currentUser={user}
          updating={updating}
          deleting={deleting}
          handleRoleUpdate={handleRoleUpdate}
          handleDeleteUser={handleDeleteUser}
          handleSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalUsers={totalUsers}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;