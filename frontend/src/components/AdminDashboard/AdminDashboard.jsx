import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import DashboardOverview from './DashboardOverview';
import GuardianManagement from './GuardianManagement';
import RecentAssessments from './RecentAssessments';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import './AdminDashboard.css';

/**
 * AdminDashboard - Professional admin dashboard component
 * Connects to real database and displays meaningful data for platform administrators
 * Only accessible to users with role='admin'
 */
function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin on mount
  useEffect(() => {
    if (authLoading) {
      // Still loading auth state, don't redirect yet
      return;
    }
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, authLoading, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRefresh = () => {
    fetchStats();
  };

  // Show loading while checking auth state
  if (authLoading) {
    return <div className="loading-state"><p>Loading...</p></div>;
  }

  // Show error if not admin
  if (!user || user.role !== 'admin') {
    return <div className="loading-state"><p>Redirecting...</p></div>;
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        currentPage={currentPage}
        onNavigate={handleNavClick}
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
      />

      <div className="admin-main">
        <AdminTopbar onMenuClick={handleToggleSidebar} />

        <div className="admin-content">
          {currentPage === 'dashboard' && (
            <DashboardOverview stats={stats} loading={loading} onRefresh={handleRefresh} />
          )}

          {currentPage === 'guardians' && (
            <GuardianManagement />
          )}

          {currentPage === 'assessments' && (
            <RecentAssessments />
          )}

          {currentPage === 'analytics' && (
            <AdminAnalytics stats={stats} />
          )}

          {currentPage === 'settings' && (
            <AdminSettings />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
