import React from 'react';
import { AdminAuthProvider, useAdminAuthContext } from '../components/AdminAuthProvider';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPageContent = () => {
  const { admin, isLoading } = useAdminAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

const AdminPage = () => {
  return (
    <AdminAuthProvider>
      <AdminPageContent />
    </AdminAuthProvider>
  );
};

export default AdminPage;