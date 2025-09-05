import React from "react";
import {
  Calendar,
  Shield,
  UserCheck,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";

const UserTable = ({
  users,
  loading,
  currentUser,
  updating,
  deleting,
  handleRoleUpdate,
  handleDeleteUser,
  handleSort,
  sortBy,
  sortOrder,
}) => {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-900/30 text-red-300 border-red-700";
      case "Moderator":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-700";
      default:
        return "bg-green-900/30 text-green-300 border-green-700";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
        </div>
      )}

      {users.length === 0 ? (
        <div className="p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No users found</p>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort("username")}
                >
                  <div className="flex items-center">
                    User
                    {sortBy === "username" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center">
                    Role
                    {sortBy === "role" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Joined
                    {sortBy === "createdAt" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
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
                <tr
                  key={userData._id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                        <span className="text-sm font-medium text-white">
                          {userData.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {userData.username}
                          {currentUser?.id === userData._id && (
                            <span className="ml-2 text-xs text-purple-400">
                              (You)
                            </span>
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
                      onChange={(e) =>
                        handleRoleUpdate(userData._id, e.target.value)
                      }
                      disabled={
                        updating === userData._id ||
                        currentUser?.id === userData._id
                      }
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
                      {new Date(userData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(userData.role)}`}
                    >
                      {userData.role === "Admin" && (
                        <Shield className="h-3 w-3 mr-1" />
                      )}
                      {userData.role === "Moderator" && (
                        <UserCheck className="h-3 w-3 mr-1" />
                      )}
                      {userData.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          /* Add view user details functionality */
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteUser(userData._id, userData.username)
                        }
                        disabled={
                          deleting === userData._id ||
                          currentUser?.id === userData._id
                        }
                        className="text-red-400 hover:text-red-300 transition-colors p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          currentUser?.id === userData._id
                            ? "Cannot delete your own account"
                            : "Delete User"
                        }
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
    </div>
  );
};

export default UserTable;
