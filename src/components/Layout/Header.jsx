import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Settings,
  Bell,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { useAlertStore } from '../../store/alertStore.js';

export const Header = ({ onMenuToggle, isMobileSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const unreadCount = useAlertStore((state) => state.unreadCount);
  const alerts = useAlertStore((state) => state.alerts);
  const markAsRead = useAlertStore((state) => state.markAsRead);
  const addToast = useAlertStore((state) => state.addToast);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleHelpClick = () => {
    addToast({
      type: 'info',
      message: 'Help center coming soon.',
      duration: 3000,
    });
  };
  const handleSettingsClick = () => {
    addToast({
      type: 'info',
      message: 'Settings page coming soon.',
      duration: 3000,
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onMenuToggle(!isMobileSidebarOpen)}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
            title="Toggle Sidebar"
          >
            {isMobileSidebarOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </button>
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <i className="fa-solid fa-car text-lg text-white"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900">DriverFeed</h1>
              <p className="text-xs text-slate-500">Sentiment Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="hidden flex-1 px-8 md:block">
          <div className="relative">
            <input
              type="search"
              placeholder="Search drivers, feedback..."
              className="w-full max-w-xs rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="relative rounded-lg p-2 hover:bg-slate-100 transition-colors"
              title="Notifications"
              aria-haspopup="true"
              aria-expanded={isAlertOpen}
              onClick={() => setIsAlertOpen((prev) => !prev)}
            >
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isAlertOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">Alerts</p>
                  <span className="text-xs text-slate-500">{unreadCount} unread</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {alerts.length === 0 && (
                    <div className="px-4 py-6 text-sm text-slate-500 text-center">
                      No alerts right now
                    </div>
                  )}
                  {alerts.slice(0, 5).map((alert) => (
                    <Link
                      key={alert.id}
                      to={alert.driverId ? `/driver/${alert.driverId}` : '#'}
                      onClick={() => markAsRead(alert.id)}
                      className="block px-4 py-3 border-b border-slate-100 hover:bg-slate-50"
                    >
                      <p className="text-sm font-medium text-slate-900">{alert.driverName}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Score: {alert.currentScore.toFixed(2)} • {alert.reason}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button
            className="hidden rounded-lg p-2 hover:bg-slate-100 sm:block transition-colors"
            title="Help"
            onClick={handleHelpClick}
          >
            <HelpCircle className="h-5 w-5 text-slate-600" />
          </button>

          {/* Settings */}
          <button
            className="hidden rounded-lg p-2 hover:bg-slate-100 sm:block transition-colors"
            title="Settings"
            onClick={handleSettingsClick}
          >
            <Settings className="h-5 w-5 text-slate-600" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 transition-colors"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="User"
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden text-sm font-medium text-slate-900 sm:block">Admin</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                <div className="p-3 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-500">admin@driverfeed.com</p>
                </div>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <hr className="my-2" />
                <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
