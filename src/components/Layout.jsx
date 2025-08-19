import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNhostClient, useUserData, useAuthenticationStatus, useAccessToken } from '@nhost/react';

const Layout = () => {
  const user = useUserData(); // User profile info
  const nhost = useNhostClient();

  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const accessToken = useAccessToken(); // Current session JWT

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Chats', href: '/chats', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href) => location.pathname === href;
  const userAvatar = user?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  // Redirect to login if no active session
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-dark-800/90 backdrop-blur-xl border-r border-gray-700/50 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">SecureChat</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-700/50 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={userAvatar}
              alt={user?.displayName || 'User Avatar'}
              className="w-10 h-10 rounded-full border-2 border-primary-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.displayName || 'Guest User'}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={async () => {

  await nhost.auth.signOut();
  sessionStorage.removeItem("user");
  navigate('/');
}}

            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="h-16 bg-dark-800/50 backdrop-blur-xl border-b border-gray-700/50 flex items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">End-to-end encrypted</span>
          </div>
        </div>

        <div className="flex-1">
          {/* Debug session (optional) */}
          {/* <pre className="text-gray-400 text-xs p-4">{accessToken}</pre> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
