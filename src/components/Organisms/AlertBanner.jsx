/**
 * Alert Banner Component - Organism component
 * Displays alert notifications for drivers below threshold
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Bell, X } from 'lucide-react';
import { Card, Button, Badge } from '../Atoms/index.jsx';
import { useAlertStore } from '../../store/alertStore.js';

export const AlertBanner = ({ onAlertClick, maxVisible = 3 }) => {
  const alerts = useAlertStore((state) => state.alerts);
  const unreadCount = useAlertStore((state) => state.unreadCount);
  const removeAlert = useAlertStore((state) => state.removeAlert);
  const markAsRead = useAlertStore((state) => state.markAsRead);

  const visibleAlerts = alerts.slice(0, maxVisible);

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Header with bell icon */}
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
        <Bell className="h-5 w-5 text-red-600" />
        <span className="text-sm font-medium text-red-900">
          {unreadCount} new alert{unreadCount !== 1 ? 's' : ''}
        </span>
        {alerts.length > maxVisible && (
          <span className="text-xs text-red-700 ml-auto">
            +{alerts.length - maxVisible} more
          </span>
        )}
      </div>

      {/* Alert cards */}
      <div className="space-y-2">
        {visibleAlerts.map((alert) => (
          <Card
            key={alert.id}
            className="p-4 border-l-4 border-l-red-500 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              if (!alert.driverId) {
                markAsRead(alert.id);
                onAlertClick?.(alert.id);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    {alert.driverId ? (
                      <Link
                        to={`/driver/${alert.driverId}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                        onClick={() => {
                          markAsRead(alert.id);
                          onAlertClick?.(alert.id);
                        }}
                      >
                        {alert.driverName}
                      </Link>
                    ) : (
                      <p className="font-medium text-slate-900">{alert.driverName}</p>
                    )}
                    <p className="text-sm text-slate-600 mt-0.5">
                      Current score: <span className="font-semibold">{alert.currentScore.toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{alert.reason}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAlert(alert.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {alert.severity === 'critical' && (
              <Badge variant="danger" size="sm" className="mt-2">
                Critical
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertBanner;
