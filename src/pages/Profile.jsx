import { useState, useEffect } from "react";
import {
  Camera,
  Shield,
  User,
  Mail,
  Calendar,
  Globe,
  Bell,
} from "lucide-react";

const Profile = () => {
  // Load user from sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [storedUser]);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">No user found in session. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-6">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-primary-100">Your account information</p>
          </div>
        </div>

        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-700/50">
            <div className="relative">
              <img
                src={
                  user.avatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={user.displayName || "User"}
                className="w-16 h-16 rounded-full border-2 border-primary-500/30"
              />
              <button
                type="button"
                disabled
                className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full opacity-50 cursor-not-allowed"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">
                {user.displayName}
              </h2>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Verified</span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" /> Username
                </label>
                <p className="px-4 py-3 bg-dark-700/50 border border-gray-600 rounded-lg text-white">
                  {user.username || "—"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" /> Email
                </label>
                <p className="px-4 py-3 bg-dark-700/50 border border-gray-600 rounded-lg text-white">
                  {user.email || "—"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" /> Language
                </label>
                <p className="px-4 py-3 bg-dark-700/50 border border-gray-600 rounded-lg text-white">
                  {user.language || "en"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Bell className="w-4 h-4 inline mr-2" /> Notifications
                </label>
                <p className="px-4 py-3 bg-dark-700/50 border border-gray-600 rounded-lg text-white">
                  {user.notifications ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <p className="px-4 py-3 bg-dark-700/50 border border-gray-600 rounded-lg text-white whitespace-pre-line">
                {user.bio || "No bio available"}
              </p>
            </div>

            {/* Security Section */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" /> Security & Privacy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">
                      End-to-End Encryption
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    All your messages are fully encrypted.
                  </p>
                </div>
                <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary-400" />
                    <span className="text-sm font-medium text-primary-400">
                      Account Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Your account has been verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
