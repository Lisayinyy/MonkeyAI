import { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Investor',
    email: user?.email || 'john.investor@email.com',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    // Here you would normally validate and send to backend
    // For security, you'd need to verify identity (e.g., re-enter password)
    setProfileData(editedData);
    updateUserProfile(editedData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!user) return;
    const next = { name: user.name, email: user.email };
    setProfileData(next);
    setEditedData(next);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f1e] pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-[#60a5fa]/15 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-[#252541] rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Success Message */}
        {showSuccess && (
          <Card className="border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-950/30">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Profile updated successfully
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-950/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Shield size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  Account Security Notice
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Changing your name or email requires verification. You may be asked to confirm your identity or re-authenticate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User size={28} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {profileData.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Member since Aug 2025</p>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile Information
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User size={14} />
                    Full Name
                  </label>
                  <Input
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="bg-white dark:bg-[#252541] border-gray-200 dark:border-[#60a5fa]/20"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This is how you'll be identified in the app
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail size={14} />
                    Email Address
                  </label>
                  <Input
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-white dark:bg-[#252541] border-gray-200 dark:border-[#60a5fa]/20"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Used for login and important notifications
                  </p>
                </div>

                <Card className="border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-950/30">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        After saving, you may need to verify your email address and re-authenticate for security purposes.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2.5 bg-gray-200 dark:bg-[#252541] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-[#2d2d4a] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Security
              </h2>
            </div>

            {!showPasswordChange ? (
              <button
                onClick={() => setShowPasswordChange(true)}
                className="w-full py-2.5 bg-gray-100 dark:bg-[#252541] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-[#2d2d4a] transition-colors"
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="bg-white dark:bg-[#252541] border-gray-200 dark:border-[#60a5fa]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="bg-white dark:bg-[#252541] border-gray-200 dark:border-[#60a5fa]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="bg-white dark:bg-[#252541] border-gray-200 dark:border-[#60a5fa]/20"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="flex-1 py-2.5 bg-gray-200 dark:bg-[#252541] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-[#2d2d4a] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Here you would validate and send to backend
                      setShowPasswordChange(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 3000);
                    }}
                    className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-gray-700 dark:text-gray-300 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-3 py-2.5 bg-gray-100 dark:bg-[#252541] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-[#2d2d4a] transition-colors">
              Enable 2FA
            </button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
              <h2 className="text-base font-semibold text-red-900 dark:text-red-400">
                Danger Zone
              </h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="w-full py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
