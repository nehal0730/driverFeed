import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ChevronDown,
  TrendingUp,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const menuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
      href: '/',
      badge: null,
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Drivers',
      href: '/drivers',
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Reports',
      href: '/reports',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 shadow-lg transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Menu</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  onClick={onClose}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};
