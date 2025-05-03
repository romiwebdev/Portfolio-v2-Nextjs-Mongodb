// pages/admin/settings.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Settings, Lock, User, Check, X } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [currentUsername, setCurrentUsername] = useState(router.query.username || '');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validasi
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newUsername,
          currentPassword,
          newPassword
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setCurrentUsername(data.username || currentUsername);
        setNewUsername('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Update settings error:', error);
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Account Settings
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {message.text && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <Check className="w-5 h-5 mr-2" />
                  ) : (
                    <X className="w-5 h-5 mr-2" />
                  )}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="currentUsername" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Username
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{currentUsername}</span>
                </div>
              </div>

              <div>
                <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">
                  New Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new username"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </h3>

              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter current password"
                    required={newUsername || newPassword}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                    disabled={!newPassword}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}