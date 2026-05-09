import { useState, useEffect } from 'react';
import { usersAPI } from '../lib/api';
import { Search, Shield, User, GraduationCap, Trash2, AlertTriangle, Plus, X, Mail, Lock } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'instructor' });
  const [addLoading, setAddLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await usersAPI.getAll(params);
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const updateRole = async (userId, role) => {
    try {
      await usersAPI.updateRole(userId, role);
      fetchUsers();
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setDeleting(userId);
    try {
      await usersAPI.delete(userId);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await usersAPI.create(newUser);
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'instructor' });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create user');
    } finally {
      setAddLoading(false);
    }
  };

  const roleIcons = { admin: Shield, instructor: User, student: GraduationCap };
  const roleColors = { admin: 'badge-primary', instructor: 'badge-warning', student: 'badge-info' };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-12" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field md:w-48">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
                ) : users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.bio?.slice(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select value={user.role} onChange={e => updateRole(user._id, e.target.value)} className="input-field py-1.5 text-sm w-32">
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteUser(user._id)} disabled={deleting === user._id} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                        {deleting === user._id ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-md animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={addUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required className="input-field pl-12" placeholder="Rajesh Kumar" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required className="input-field pl-12" placeholder="rajesh@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required className="input-field pl-12" placeholder="Password" minLength={6} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="input-field">
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost flex-1">Cancel</button>
                  <button type="submit" disabled={addLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {addLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Plus className="w-5 h-5" />}
                    {addLoading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
